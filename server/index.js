// Backend Sabor & Ruta — puente Node.js/Express <-> Oracle Autonomous Database (OCI)
// Driver oficial node-oracledb en modo Thin + Oracle Wallet (mTLS).
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import oracledb from 'oracledb';
import { SCHEMA, TABLE_NAMES } from '../shared/schema.js';
import { buildDataset } from '../shared/dataset.js';
import { REPORT_SQL, usesRestauranteBind } from '../shared/reportQueries.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

const cfg = {
  user: process.env.DB_USER || 'ADMIN',
  password: process.env.DB_PASSWORD || '',
  connectString: process.env.DB_CONNECT_STRING || 'proyectorestaurante_medium',
  configDir: process.env.TNS_ADMIN,
  walletLocation: process.env.TNS_ADMIN,
  walletPassword: process.env.DB_WALLET_PASSWORD || process.env.DB_PASSWORD || undefined, // el wallet de OCI suele usar la misma clave
};

let pool = null;
let lastError = null;

async function initPool() {
  if (!cfg.password || cfg.password === 'TuPasswordDeOracleCloud') {
    lastError = 'DB_PASSWORD no configurado en .env';
    console.log('ℹ️  Modo local: configure DB_PASSWORD en .env para conectar con Oracle Cloud.');
    return;
  }
  try {
    pool = await oracledb.createPool({
      ...cfg,
      poolMin: 1,
      poolMax: 4,
      // Los servicios _medium/_high de Autonomous DB activan DML en paralelo, que provoca
      // ORA-12860 al borrar detalle y maestro en la misma transacción. Se desactiva por sesión.
      sessionCallback: (conn, _tag, done) =>
        conn.execute('ALTER SESSION DISABLE PARALLEL DML').then(() => done(), done),
    });
    const conn = await pool.getConnection();
    await conn.close();
    lastError = null;
    console.log('🚀 Conectado a Oracle Autonomous Database:', cfg.connectString);
  } catch (err) {
    pool = null;
    lastError = err.message;
    console.warn('⚠️  No se pudo conectar a Oracle:', err.message);
  }
}

/** Ejecuta fn(conn) con una conexión del pool; hace commit/rollback si tx = true. */
async function withConn(fn, tx = false) {
  if (!pool) {
    const e = new Error('Sin conexión a Oracle. ' + (lastError || ''));
    e.status = 503;
    throw e;
  }
  const conn = await pool.getConnection();
  try {
    const result = await fn(conn);
    if (tx) await conn.commit();
    return result;
  } catch (err) {
    if (tx) await conn.rollback().catch(() => {});
    throw err;
  } finally {
    await conn.close();
  }
}

const OBJ = { outFormat: oracledb.OUT_FORMAT_OBJECT };

/** Traduce errores ORA a mensajes entendibles en la sustentación. */
function friendly(err) {
  const m = err.message || String(err);
  if (m.includes('ORA-02292')) return 'Integridad referencial (ORA-02292): el registro tiene filas hijas asociadas y no puede eliminarse.';
  if (m.includes('ORA-02291')) return 'Integridad referencial (ORA-02291): la llave foránea no existe en la tabla padre.';
  if (m.includes('ORA-00001')) return 'Llave primaria/única duplicada (ORA-00001): ya existe un registro con ese identificador.';
  if (m.includes('ORA-12899')) return 'Valor demasiado largo para la columna (ORA-12899). ' + m;
  return m;
}

const handle = fn => async (req, res) => {
  try {
    res.json(await fn(req, res));
  } catch (err) {
    console.error('❌', err.message);
    res.status(err.status || 500).json({ error: friendly(err) });
  }
};

async function nextId(conn, table, col) {
  const r = await conn.execute(`SELECT NVL(MAX(${col}), 0) + 1 AS ID FROM ${table}`, [], OBJ);
  return r.rows[0].ID;
}

// ---------------------------------------------------------------------------
// Salud y metadatos
// ---------------------------------------------------------------------------
app.get('/api/health', async (_req, res) => {
  if (!pool) await initPool();
  if (!pool) return res.json({ status: 'local', message: lastError });
  try {
    const info = await withConn(c =>
      c.execute(
        `SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS FECHA,
                SYS_CONTEXT('USERENV', 'DB_NAME') AS DB,
                SYS_CONTEXT('USERENV', 'SESSION_USER') AS USUARIO,
                (SELECT COUNT(*) FROM user_tables) AS TABLAS
           FROM dual`, [], OBJ)
    );
    const row = info.rows[0];
    res.json({ status: 'oracle', database: row.DB, user: row.USUARIO, sysdate: row.FECHA, tables: row.TABLAS, service: cfg.connectString });
  } catch (err) {
    res.json({ status: 'local', message: err.message });
  }
});

/** Lee las 30 tablas desde Oracle y arma el mismo dataset que usa la web. */
app.get('/api/dataset', handle(async () =>
  withConn(async conn => {
    const raw = {};
    for (const name of TABLE_NAMES) {
      const cols = SCHEMA[name].columns
        .map(c => (c.type === 'DATE' ? `TO_CHAR(${c.name}, '${c.format}') AS "${c.name}"` : `${c.name} AS "${c.name}"`))
        .join(', ');
      raw[name] = (await conn.execute(`SELECT ${cols} FROM ${name}`, [], OBJ)).rows;
    }
    return buildDataset(raw);
  })
));

/** Diccionario de datos leído del catálogo de Oracle (USER_TAB_COLUMNS / USER_CONSTRAINTS). */
app.get('/api/catalogo', handle(async () =>
  withConn(async conn => {
    const cols = await conn.execute(
      `SELECT table_name, column_name, data_type, data_length, data_precision, nullable, column_id
         FROM user_tab_columns ORDER BY table_name, column_id`, [], OBJ);
    const cons = await conn.execute(
      `SELECT c.table_name, c.constraint_name, c.constraint_type, cc.column_name,
              r.table_name AS ref_table, c.search_condition_vc
         FROM user_constraints c
         JOIN user_cons_columns cc ON cc.constraint_name = c.constraint_name
         LEFT JOIN user_constraints r ON r.constraint_name = c.r_constraint_name
        ORDER BY c.table_name`, [], OBJ);
    const counts = {};
    for (const t of TABLE_NAMES) {
      counts[t] = (await conn.execute(`SELECT COUNT(*) AS N FROM ${t}`, [], OBJ)).rows[0].N;
    }
    return { columns: cols.rows, constraints: cons.rows, counts };
  })
));

// ---------------------------------------------------------------------------
// Reportes: el cliente solo envía el id; el SQL vive en el servidor.
// ---------------------------------------------------------------------------
app.get('/api/reports/:id', handle(async req => {
  const id = Number(req.params.id);
  const sql = REPORT_SQL[id];
  if (!sql) {
    const e = new Error('Reporte inexistente');
    e.status = 404;
    throw e;
  }
  const rest = req.query.restaurante ? Number(req.query.restaurante) : null;
  const binds = usesRestauranteBind(id) ? { idRestaurante: { val: rest, type: oracledb.NUMBER } } : {};
  const started = Date.now();
  const result = await withConn(c => c.execute(sql, binds, OBJ));
  const rows = result.rows.map(r => Object.fromEntries(Object.entries(r).map(([k, v]) => [k.toLowerCase(), v])));
  return { rows, elapsedMs: Date.now() - started };
}));

// ---------------------------------------------------------------------------
// Autenticación (tabla UsuarioSistema si existe; si no, usuarios de demostración)
// ---------------------------------------------------------------------------
const hash = (pass, salt) => crypto.scryptSync(pass, salt, 32).toString('hex');

const DEMO_USERS = [
  { usuario: 'admin', clave: 'admin123', rol: 'Administrador', nombre: 'Administrador General' },
  { usuario: 'gerente.salento', clave: 'salento123', rol: 'Gerente', nombre: 'Carlos Ramírez', restauranteId: 1 },
  { usuario: 'gerente.cartagena', clave: 'cartagena123', rol: 'Gerente', nombre: 'Mariana Pérez', restauranteId: 2 },
  { usuario: 'turista.carlos', clave: 'turista123', rol: 'Turista', nombre: 'Carlos Mendoza', clienteDocumento: 'PE4587123' },
];

async function usuarioSistemaExists(conn) {
  const r = await conn.execute(`SELECT COUNT(*) AS N FROM user_tables WHERE table_name = 'USUARIOSISTEMA'`, [], OBJ);
  return r.rows[0].N > 0;
}

app.post('/api/login', handle(async req => {
  const { usuario, clave } = req.body || {};
  if (!usuario || !clave) {
    const e = new Error('Usuario y contraseña son obligatorios.');
    e.status = 400;
    throw e;
  }
  const user = await withConn(async conn => {
    if (!(await usuarioSistemaExists(conn))) return null;
    const r = await conn.execute(
      `SELECT u.usuario, u.claveHash, u.salt, u.rol, u.Restaurante_idRestaurante AS RID,
              u.Cliente_numeroDocumento AS CDOC,
              CASE WHEN c.numeroDocumento IS NOT NULL THEN c.Nombre || ' ' || c.apellido ELSE u.nombreVisible END AS NOMBRE
         FROM UsuarioSistema u
         LEFT JOIN Cliente c ON c.numeroDocumento = u.Cliente_numeroDocumento
        WHERE LOWER(u.usuario) = LOWER(:u) AND u.activo = 1`, { u: usuario }, OBJ);
    const row = r.rows[0];
    if (!row || hash(clave, row.SALT) !== row.CLAVEHASH) return false;
    return { usuario: row.USUARIO, nombre: row.NOMBRE, rol: row.ROL, restauranteId: row.RID ?? undefined, clienteDocumento: row.CDOC ?? undefined };
  }).catch(() => null);

  if (user) return { ...user, origen: 'Oracle (UsuarioSistema)' };
  if (user === false) {
    const e = new Error('Usuario o contraseña incorrectos.');
    e.status = 401;
    throw e;
  }
  const demo = DEMO_USERS.find(d => d.usuario === String(usuario).toLowerCase() && d.clave === clave);
  if (!demo) {
    const e = new Error('Usuario o contraseña incorrectos.');
    e.status = 401;
    throw e;
  }
  const { clave: _c, ...rest } = demo;
  return { ...rest, origen: 'Servidor (usuarios de demostración)' };
}));

/** Registro de cuenta de turista: inserta Cliente (+ UsuarioSistema si existe la tabla). */
app.post('/api/registro', handle(async req => {
  const { cliente, usuario, clave } = req.body || {};
  if (!cliente?.numeroDocumento || !usuario || !clave || clave.length < 6) {
    const e = new Error('Datos incompletos: documento, usuario y contraseña (mín. 6 caracteres).');
    e.status = 400;
    throw e;
  }
  return withConn(async conn => {
    await insertCliente(conn, cliente);
    let credencialEnOracle = false;
    if (await usuarioSistemaExists(conn)) {
      const salt = crypto.randomBytes(16).toString('hex');
      await conn.execute(
        `INSERT INTO UsuarioSistema (usuario, claveHash, salt, rol, nombreVisible, Cliente_numeroDocumento, activo, fechaCreacion)
         VALUES (:u, :h, :s, 'Turista', :n, :d, 1, SYSDATE)`,
        { u: usuario.toLowerCase(), h: hash(clave, salt), s: salt, n: `${cliente.Nombre} ${cliente.apellido}`, d: cliente.numeroDocumento });
      credencialEnOracle = true;
    }
    return { ok: true, credencialEnOracle };
  }, true);
}));

// ---------------------------------------------------------------------------
// CRUD 1: Restaurante
// ---------------------------------------------------------------------------
const restBinds = b => ({
  nit: b.nit, nombre: b.nombre, direccion: b.direccion, categoria: b.categoriaCocina,
  apertura: b.horaApertura, cierre: b.horaCierre, ciudad: b.Ciudad_idCiudad,
});

app.post('/api/restaurantes', handle(async req =>
  withConn(async conn => {
    const id = await nextId(conn, 'Restaurante', 'idRestaurante');
    await conn.execute(
      `INSERT INTO Restaurante (idRestaurante, nit, nombre, direccion, categoriaCocina, horaApertura, horaCierre, Ciudad_idCiudad)
       VALUES (:id, :nit, :nombre, :direccion, :categoria, TO_DATE(:apertura, 'HH24:MI'), TO_DATE(:cierre, 'HH24:MI'), :ciudad)`,
      { id, ...restBinds(req.body) });
    return { ok: true, id };
  }, true)
));

app.put('/api/restaurantes/:id', handle(async req =>
  withConn(async conn => {
    await conn.execute(
      `UPDATE Restaurante SET nit = :nit, nombre = :nombre, direccion = :direccion, categoriaCocina = :categoria,
              horaApertura = TO_DATE(:apertura, 'HH24:MI'), horaCierre = TO_DATE(:cierre, 'HH24:MI'), Ciudad_idCiudad = :ciudad
        WHERE idRestaurante = :id`,
      { id: Number(req.params.id), ...restBinds(req.body) });
    return { ok: true };
  }, true)
));

app.delete('/api/restaurantes/:id', handle(async req =>
  withConn(async conn => {
    await conn.execute(`DELETE FROM Restaurante WHERE idRestaurante = :id`, { id: Number(req.params.id) });
    return { ok: true };
  }, true)
));

// ---------------------------------------------------------------------------
// CRUD 2: Cliente
// ---------------------------------------------------------------------------
async function insertCliente(conn, c) {
  await conn.execute(
    `INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento)
     VALUES (:doc, :nombre, :apellido, :email, :tel, :pais, :tipo)`,
    { doc: c.numeroDocumento, nombre: c.Nombre, apellido: c.apellido, email: c.email, tel: c.telefono, pais: c.paisOrigen, tipo: Number(c.TipoDocumento_idTipoDocumento) });
}

app.post('/api/clientes', handle(async req => withConn(async conn => (await insertCliente(conn, req.body), { ok: true }), true)));

app.put('/api/clientes/:doc', handle(async req =>
  withConn(async conn => {
    const c = req.body;
    await conn.execute(
      `UPDATE Cliente SET Nombre = :nombre, apellido = :apellido, email = :email, telefono = :tel,
              paisOrigen = :pais, TipoDocumento_idTipoDocumento = :tipo
        WHERE numeroDocumento = :doc`,
      { doc: req.params.doc, nombre: c.Nombre, apellido: c.apellido, email: c.email, tel: c.telefono, pais: c.paisOrigen, tipo: Number(c.TipoDocumento_idTipoDocumento) });
    return { ok: true };
  }, true)
));

app.delete('/api/clientes/:doc', handle(async req =>
  withConn(async conn => {
    await conn.execute(`DELETE FROM Cliente WHERE numeroDocumento = :doc`, { doc: req.params.doc });
    return { ok: true };
  }, true)
));

// ---------------------------------------------------------------------------
// CRUD 3: ExperienciaTuristica
// ---------------------------------------------------------------------------
const expBinds = e => ({
  nombre: e.nombreExperiencia, descripcion: e.descripcion, precio: Number(e.precioPorPersona),
  duracion: Number(e.duracion), rest: Number(e.Restaurante_idRestaurante),
});

app.post('/api/experiencias', handle(async req =>
  withConn(async conn => {
    const id = await nextId(conn, 'ExperienciaTuristica', 'idExperiencia');
    await conn.execute(
      `INSERT INTO ExperienciaTuristica (idExperiencia, nombreExperiencia, descripcion, precioPorPersona, duracion, Restaurante_idRestaurante)
       VALUES (:id, :nombre, :descripcion, :precio, :duracion, :rest)`, { id, ...expBinds(req.body) });
    return { ok: true, id };
  }, true)
));

app.put('/api/experiencias/:id', handle(async req =>
  withConn(async conn => {
    await conn.execute(
      `UPDATE ExperienciaTuristica SET nombreExperiencia = :nombre, descripcion = :descripcion, precioPorPersona = :precio,
              duracion = :duracion, Restaurante_idRestaurante = :rest
        WHERE idExperiencia = :id`, { id: Number(req.params.id), ...expBinds(req.body) });
    return { ok: true };
  }, true)
));

app.delete('/api/experiencias/:id', handle(async req =>
  withConn(async conn => {
    await conn.execute(`DELETE FROM ExperienciaTuristica WHERE idExperiencia = :id`, { id: Number(req.params.id) });
    return { ok: true };
  }, true)
));

// ---------------------------------------------------------------------------
// CRUD 4: Orden (transacción maestro-detalle + especialización salón/domicilio)
// ---------------------------------------------------------------------------
async function writeOrdenChildren(conn, id, o) {
  for (const d of o.detallesMenu || []) {
    await conn.execute(
      `INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (:item, :orden, :cant, :sub)`,
      { item: Number(d.ItemMenu_idItem), orden: id, cant: Number(d.cantidad), sub: Number(d.subTotal) });
  }
  for (const d of o.detallesExperiencia || []) {
    await conn.execute(
      `INSERT INTO DetalleExperienciaOrden (subtotal, asistentes, ExperienciaTuristica_idExperiencia, Orden_idOrden, fechaProgramada)
       VALUES (:sub, :asis, :exp, :orden, TO_DATE(:f, 'YYYY-MM-DD HH24:MI'))`,
      { sub: Number(d.subtotal), asis: Number(d.asistentes), exp: Number(d.ExperienciaTuristica_idExperiencia), orden: id, f: normDateTime(d.fechaProgramada) });
  }
  if (o.tipo === 'Domicilio') {
    await conn.execute(
      `INSERT INTO OrdenDomicilio (direccionEntrega, Orden_idOrden, costoDomicilio, Repartidor_Personal_numeroDocumento)
       VALUES (:dir, :orden, :costo, :rep)`,
      { dir: o.direccionEntrega, orden: id, costo: Number(o.costoDomicilio || 0), rep: o.repartidorId });
  } else {
    await conn.execute(
      `INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (:orden, :mesero, :mesa)`,
      { orden: id, mesero: o.meseroId, mesa: Number(o.mesaId) });
  }
}

async function deleteOrdenChildren(conn, id) {
  for (const t of ['DetalleOrden', 'DetalleExperienciaOrden', 'OrdenRestaurante', 'OrdenDomicilio']) {
    await conn.execute(`DELETE FROM ${t} WHERE Orden_idOrden = :id`, { id });
  }
}

const normDateTime = s => {
  const v = String(s || '').replace('T', ' ');
  return v.length === 10 ? `${v} 00:00` : v.slice(0, 16);
};

app.post('/api/ordenes', handle(async req =>
  withConn(async conn => {
    const o = req.body;
    const id = await nextId(conn, 'Orden', 'idOrden');
    await conn.execute(
      `INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado)
       VALUES (:id, :cli, :total, TO_DATE(:fecha, 'YYYY-MM-DD HH24:MI'), :estado)`,
      { id, cli: o.Cliente_numeroDocumento, total: Number(o.total), fecha: normDateTime(o.fecha), estado: Number(o.Estado_idEstado) });
    await writeOrdenChildren(conn, id, o);
    return { ok: true, id };
  }, true)
));

app.put('/api/ordenes/:id', handle(async req =>
  withConn(async conn => {
    const id = Number(req.params.id);
    const o = req.body;
    await conn.execute(
      `UPDATE Orden SET Cliente_numeroDocumento = :cli, total = :total, fecha = TO_DATE(:fecha, 'YYYY-MM-DD HH24:MI'),
              Estado_idEstado = :estado WHERE idOrden = :id`,
      { id, cli: o.Cliente_numeroDocumento, total: Number(o.total), fecha: normDateTime(o.fecha), estado: Number(o.Estado_idEstado) });
    if (o.detallesMenu) {
      await deleteOrdenChildren(conn, id);
      await writeOrdenChildren(conn, id, o);
    }
    return { ok: true };
  }, true)
));

app.delete('/api/ordenes/:id', handle(async req =>
  withConn(async conn => {
    const id = Number(req.params.id);
    await conn.execute(`DELETE FROM PagoMetodoPago WHERE Pago_idPago IN (SELECT idPago FROM Pago WHERE Orden_idOrden = :id)`, { id });
    await conn.execute(`DELETE FROM Pago WHERE Orden_idOrden = :id`, { id });
    await deleteOrdenChildren(conn, id);
    await conn.execute(`DELETE FROM Orden WHERE idOrden = :id`, { id });
    return { ok: true };
  }, true)
));

// ---------------------------------------------------------------------------
// Reservas y pagos en línea
// ---------------------------------------------------------------------------
app.post('/api/reservas', handle(async req =>
  withConn(async conn => {
    const r = req.body;
    const id = await nextId(conn, 'Reserva', 'idReserva');
    await conn.execute(
      `INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado)
       VALUES (:id, TO_DATE(:f, 'YYYY-MM-DD HH24:MI'), :n, :cli, :rest, :estado)`,
      { id, f: `${r.fechaReserva} ${r.horaReserva}`, n: Number(r.cantidadPersonas), cli: r.Cliente_numeroDocumento, rest: Number(r.Restaurante_idRestaurante), estado: Number(r.Estado_idEstado || 1) });
    for (const p of r.peticionesIds || []) {
      await conn.execute(`INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (:r, :p)`, { r: id, p: Number(p) });
    }
    return { ok: true, id };
  }, true)
));

app.put('/api/reservas/:id/estado', handle(async req =>
  withConn(async conn => {
    await conn.execute(`UPDATE Reserva SET Estado_idEstado = :e WHERE idReserva = :id`, { e: Number(req.body.Estado_idEstado), id: Number(req.params.id) });
    return { ok: true };
  }, true)
));

app.post('/api/pagos', handle(async req =>
  withConn(async conn => {
    const p = req.body;
    const id = await nextId(conn, 'Pago', 'idPago');
    await conn.execute(
      `INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden)
       VALUES (:id, :moneda, :total, :propina, SYSDATE, :orden)`,
      { id, moneda: p.monedaPago || 'COP', total: Number(p.totalPagado), propina: Number(p.propina || 0), orden: Number(p.Orden_idOrden) });
    for (const m of p.metodosPagoIds || []) {
      await conn.execute(`INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (:p, :m)`, { p: id, m: Number(m) });
    }
    if (p.nuevoEstadoOrden) {
      await conn.execute(`UPDATE Orden SET Estado_idEstado = :e WHERE idOrden = :o`, { e: Number(p.nuevoEstadoOrden), o: Number(p.Orden_idOrden) });
    }
    return { ok: true, id };
  }, true)
));

app.listen(PORT, async () => {
  console.log(`📡 Backend Sabor & Ruta en http://localhost:${PORT}`);
  await initPool();
});
