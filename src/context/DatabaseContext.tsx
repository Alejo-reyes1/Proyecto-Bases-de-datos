import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Restaurante,
  Cliente,
  ExperienciaTuristica,
  Orden,
  Reserva,
  Pago,
  UserSession,
  Dataset,
} from '../types';
import { SEED_DATASET } from '../data/seedData';
import { api, HealthInfo } from '../services/api';

export type ConnectionMode = 'oracle-cloud' | 'local-engine' | 'checking';

export interface OpResult {
  success: boolean;
  message: string;
  id?: number;
}

export interface Notificacion {
  id: string;
  tipo: 'recordatorio' | 'pendiente' | 'alerta' | 'info';
  titulo: string;
  detalle: string;
  fecha: string;
}

interface DatabaseContextType extends Dataset {
  user: UserSession | null;
  selectedRestauranteId: number | null; // null = Consolidado Nacional (todas las sedes)
  setSelectedRestauranteId: (id: number | null) => void;

  connectionMode: ConnectionMode;
  isOracleConnected: boolean;
  health: HealthInfo | null;
  lastSync: string | null;
  refreshFromOracle: () => Promise<void>;

  // CRUD Core
  addRestaurante: (r: Omit<Restaurante, 'idRestaurante'>) => Promise<OpResult>;
  updateRestaurante: (id: number, data: Partial<Restaurante>) => Promise<OpResult>;
  deleteRestaurante: (id: number) => Promise<OpResult>;
  addCliente: (c: Cliente) => Promise<OpResult>;
  updateCliente: (doc: string, data: Partial<Cliente>) => Promise<OpResult>;
  deleteCliente: (doc: string) => Promise<OpResult>;
  addExperiencia: (e: Omit<ExperienciaTuristica, 'idExperiencia'>) => Promise<OpResult>;
  updateExperiencia: (id: number, data: Partial<ExperienciaTuristica>) => Promise<OpResult>;
  deleteExperiencia: (id: number) => Promise<OpResult>;
  addOrden: (o: Omit<Orden, 'idOrden'>) => Promise<OpResult>;
  updateOrden: (id: number, data: Partial<Orden>) => Promise<OpResult>;
  deleteOrden: (id: number) => Promise<OpResult>;

  // Reservas, pagos y cuentas
  addReserva: (r: Omit<Reserva, 'idReserva'>) => Promise<OpResult & { reserva?: Reserva }>;
  updateEstadoReserva: (id: number, estado: number) => Promise<OpResult>;
  registrarPago: (p: Omit<Pago, 'idPago' | 'fechaPago'> & { nuevoEstadoOrden?: number }) => Promise<OpResult>;
  registrarCuenta: (c: Cliente, usuario: string, clave: string) => Promise<OpResult>;
  autenticar: (usuario: string, clave: string) => Promise<OpResult>;

  notificaciones: Notificacion[];

  login: (user: UserSession) => void;
  logout: () => void;
  resetDatabase: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const STORAGE_KEY = 'sr_dataset_v2';
const ACCOUNTS_KEY = 'sr_cuentas_locales';

// Usuarios de demostración para el modo sin conexión (mismos que valida el servidor).
const DEMO_USERS: (UserSession & { clave: string })[] = [
  { usuario: 'admin', clave: 'admin123', rol: 'Administrador', nombre: 'Administrador General' },
  { usuario: 'gerente.salento', clave: 'salento123', rol: 'Gerente', nombre: 'Carlos Ramírez', restauranteId: 1 },
  { usuario: 'gerente.cartagena', clave: 'cartagena123', rol: 'Gerente', nombre: 'Mariana Pérez', restauranteId: 2 },
  { usuario: 'turista.carlos', clave: 'turista123', rol: 'Turista', nombre: 'Carlos Mendoza', clienteDocumento: 'PE4587123' },
];

const safeGet = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const safeSet = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* almacenamiento no disponible */
  }
};

const nowDateTime = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const ok = (message: string, id?: number): OpResult => ({ success: true, message, id });
const fail = (message: string): OpResult => ({ success: false, message });

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Dataset>(() => {
    const saved = safeGet(STORAGE_KEY);
    return saved ? JSON.parse(saved) : SEED_DATASET;
  });
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('checking');
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = safeGet('sr_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedRestauranteId, setSelectedRestauranteId] = useState<number | null>(() =>
    user?.rol === 'Gerente' && user.restauranteId ? user.restauranteId : null
  );

  const isOracle = connectionMode === 'oracle-cloud';
  const restName = (id?: number) => data.restaurantes.find(r => r.idRestaurante === id)?.nombre;

  // ---------------------------------------------------------------- Sincronización
  const refreshFromOracle = useCallback(async () => {
    try {
      const h = await api.health();
      setHealth(h);
      if (h.status !== 'oracle') {
        setConnectionMode('local-engine');
        return;
      }
      const ds = (await api.dataset()) as Dataset;
      setData(ds);
      setConnectionMode('oracle-cloud');
      setLastSync(nowDateTime());
    } catch (err) {
      setHealth({ status: 'local', message: (err as Error).message });
      setConnectionMode('local-engine');
    }
  }, []);

  useEffect(() => {
    refreshFromOracle();
  }, [refreshFromOracle]);

  // Sin conexión: reintenta cada 10 s para pasar a Oracle apenas arranque el backend.
  useEffect(() => {
    if (connectionMode !== 'local-engine') return;
    const t = setInterval(refreshFromOracle, 10000);
    return () => clearInterval(t);
  }, [connectionMode, refreshFromOracle]);

  // Solo se persiste en el navegador el trabajo hecho sin conexión.
  useEffect(() => {
    if (connectionMode === 'local-engine') safeSet(STORAGE_KEY, JSON.stringify(data));
  }, [data, connectionMode]);

  useEffect(() => {
    if (user) {
      safeSet('sr_user', JSON.stringify(user));
      if (user.rol === 'Gerente' && user.restauranteId) setSelectedRestauranteId(user.restauranteId);
    } else {
      safeSet('sr_user', null);
      setSelectedRestauranteId(null);
    }
  }, [user]);

  /** Ejecuta la operación en Oracle (y recarga) o localmente según el modo. */
  const run = async (remote: () => Promise<unknown>, local: () => OpResult, okMsg: string): Promise<OpResult> => {
    if (isOracle) {
      try {
        const r = (await remote()) || {};
        await refreshFromOracle();
        return ok(`${okMsg} (COMMIT en Oracle Cloud)`, (r as any).id);
      } catch (err) {
        return fail((err as Error).message);
      }
    }
    const r = local();
    return r.success
      ? { ...r, message: `${r.message} · MODO LOCAL: guardado solo en este navegador, NO en Oracle (inicie npm run server)` }
      : r;
  };

  const nextId = <T,>(arr: T[], key: keyof T) =>
    arr.length ? Math.max(...arr.map(x => Number(x[key]) || 0)) + 1 : 1;

  // ---------------------------------------------------------------- Restaurante
  const addRestaurante = (r: Omit<Restaurante, 'idRestaurante'>) =>
    run(() => api.post('/api/restaurantes', r), () => {
      const id = nextId(data.restaurantes, 'idRestaurante');
      setData(d => ({ ...d, restaurantes: [...d.restaurantes, { ...r, idRestaurante: id }] }));
      return ok('Restaurante registrado (modo local)', id);
    }, 'Restaurante registrado');

  const updateRestaurante = (id: number, patch: Partial<Restaurante>) => {
    const full = { ...data.restaurantes.find(r => r.idRestaurante === id), ...patch };
    return run(() => api.put(`/api/restaurantes/${id}`, full), () => {
      setData(d => ({ ...d, restaurantes: d.restaurantes.map(r => (r.idRestaurante === id ? { ...r, ...patch } : r)) }));
      return ok('Restaurante actualizado (modo local)');
    }, 'Restaurante actualizado');
  };

  const deleteRestaurante = (id: number) =>
    run(() => api.del(`/api/restaurantes/${id}`), () => {
      const hijos = [
        data.experiencias.some(e => e.Restaurante_idRestaurante === id) && 'ExperienciaTuristica',
        data.mesas.some(m => m.Restaurante_idRestaurante === id) && 'Mesa',
        data.personal.some(p => p.Restaurante_idRestaurante === id) && 'Personal',
        data.cartasMenu.some(c => c.Restaurante_idRestaurante === id) && 'CartaMenu',
        data.reservas.some(r => r.Restaurante_idRestaurante === id) && 'Reserva',
        data.resenas.some(r => r.Restaurante_idRestaurante === id) && 'Resena',
      ].filter(Boolean);
      if (hijos.length) return fail(`Integridad referencial (ORA-02292): el restaurante tiene filas en ${hijos.join(', ')}.`);
      setData(d => ({ ...d, restaurantes: d.restaurantes.filter(r => r.idRestaurante !== id) }));
      return ok('Restaurante eliminado (modo local)');
    }, 'Restaurante eliminado');

  // ---------------------------------------------------------------- Cliente
  const addCliente = (c: Cliente) =>
    run(() => api.post('/api/clientes', c), () => {
      if (data.clientes.some(x => x.numeroDocumento === c.numeroDocumento))
        return fail('Llave primaria duplicada (ORA-00001): ya existe un cliente con ese documento.');
      setData(d => ({ ...d, clientes: [c, ...d.clientes] }));
      return ok('Cliente registrado (modo local)');
    }, 'Cliente registrado');

  const updateCliente = (doc: string, patch: Partial<Cliente>) => {
    const full = { ...data.clientes.find(c => c.numeroDocumento === doc), ...patch };
    return run(() => api.put(`/api/clientes/${encodeURIComponent(doc)}`, full), () => {
      setData(d => ({ ...d, clientes: d.clientes.map(c => (c.numeroDocumento === doc ? { ...c, ...patch } : c)) }));
      return ok('Cliente actualizado (modo local)');
    }, 'Cliente actualizado');
  };

  const deleteCliente = (doc: string) =>
    run(() => api.del(`/api/clientes/${encodeURIComponent(doc)}`), () => {
      const hijos = [
        data.ordenes.some(o => o.Cliente_numeroDocumento === doc) && 'Orden',
        data.reservas.some(r => r.Cliente_numeroDocumento === doc) && 'Reserva',
        data.resenas.some(r => r.Cliente_numeroDocumento === doc) && 'Resena',
      ].filter(Boolean);
      if (hijos.length) return fail(`Integridad referencial (ORA-02292): el cliente tiene filas en ${hijos.join(', ')}.`);
      setData(d => ({ ...d, clientes: d.clientes.filter(c => c.numeroDocumento !== doc) }));
      return ok('Cliente eliminado (modo local)');
    }, 'Cliente eliminado');

  // ---------------------------------------------------------------- Experiencia
  const addExperiencia = (e: Omit<ExperienciaTuristica, 'idExperiencia'>) =>
    run(() => api.post('/api/experiencias', e), () => {
      const id = nextId(data.experiencias, 'idExperiencia');
      setData(d => ({ ...d, experiencias: [...d.experiencias, { ...e, idExperiencia: id }] }));
      return ok('Experiencia registrada (modo local)', id);
    }, 'Experiencia registrada');

  const updateExperiencia = (id: number, patch: Partial<ExperienciaTuristica>) => {
    const full = { ...data.experiencias.find(e => e.idExperiencia === id), ...patch };
    return run(() => api.put(`/api/experiencias/${id}`, full), () => {
      setData(d => ({ ...d, experiencias: d.experiencias.map(e => (e.idExperiencia === id ? { ...e, ...patch } : e)) }));
      return ok('Experiencia actualizada (modo local)');
    }, 'Experiencia actualizada');
  };

  const deleteExperiencia = (id: number) =>
    run(() => api.del(`/api/experiencias/${id}`), () => {
      const usada = data.ordenes.some(o => o.detallesExperiencia?.some(x => x.ExperienciaTuristica_idExperiencia === id));
      if (usada) return fail('Integridad referencial (ORA-02292): la experiencia figura en DetalleExperienciaOrden.');
      setData(d => ({ ...d, experiencias: d.experiencias.filter(e => e.idExperiencia !== id) }));
      return ok('Experiencia eliminada (modo local)');
    }, 'Experiencia eliminada');

  // ---------------------------------------------------------------- Orden
  const addOrden = (o: Omit<Orden, 'idOrden'>) =>
    run(() => api.post('/api/ordenes', o), () => {
      const id = nextId(data.ordenes, 'idOrden');
      const nueva: Orden = {
        ...o,
        idOrden: id,
        detallesMenu: o.detallesMenu?.map(x => ({ ...x, Orden_idOrden: id })),
        detallesExperiencia: o.detallesExperiencia?.map(x => ({ ...x, Orden_idOrden: id })),
      };
      setData(d => ({ ...d, ordenes: [nueva, ...d.ordenes] }));
      return ok(`Orden #${id} registrada (modo local)`, id);
    }, 'Orden registrada');

  const updateOrden = (id: number, patch: Partial<Orden>) => {
    const full = { ...data.ordenes.find(o => o.idOrden === id), ...patch };
    // Si solo cambia el estado no se reescriben los detalles.
    const body = patch.detallesMenu ? full : { ...full, detallesMenu: undefined };
    return run(() => api.put(`/api/ordenes/${id}`, body), () => {
      setData(d => ({ ...d, ordenes: d.ordenes.map(o => (o.idOrden === id ? { ...o, ...patch } : o)) }));
      return ok('Orden actualizada (modo local)');
    }, 'Orden actualizada');
  };

  const deleteOrden = (id: number) =>
    run(() => api.del(`/api/ordenes/${id}`), () => {
      setData(d => ({
        ...d,
        ordenes: d.ordenes.filter(o => o.idOrden !== id),
        pagos: d.pagos.filter(p => p.Orden_idOrden !== id),
      }));
      return ok('Orden y sus detalles eliminados (modo local)');
    }, 'Orden y sus detalles eliminados');

  // ---------------------------------------------------------------- Reservas
  const addReserva = async (r: Omit<Reserva, 'idReserva'>) => {
    const res = await run(() => api.post('/api/reservas', r), () => {
      const id = nextId(data.reservas, 'idReserva');
      setData(d => ({ ...d, reservas: [{ ...r, idReserva: id }, ...d.reservas] }));
      return ok('Reserva registrada (modo local)', id);
    }, 'Reserva registrada');
    return { ...res, reserva: res.success ? ({ ...r, idReserva: res.id ?? 0 } as Reserva) : undefined };
  };

  const updateEstadoReserva = (id: number, estado: number) =>
    run(() => api.put(`/api/reservas/${id}/estado`, { Estado_idEstado: estado }), () => {
      setData(d => ({ ...d, reservas: d.reservas.map(r => (r.idReserva === id ? { ...r, Estado_idEstado: estado } : r)) }));
      return ok('Estado de la reserva actualizado (modo local)');
    }, 'Estado de la reserva actualizado');

  // ---------------------------------------------------------------- Pagos
  const registrarPago = (p: Omit<Pago, 'idPago' | 'fechaPago'> & { nuevoEstadoOrden?: number }) =>
    run(() => api.post('/api/pagos', p), () => {
      const id = nextId(data.pagos, 'idPago');
      const { nuevoEstadoOrden, ...pago } = p;
      setData(d => ({
        ...d,
        pagos: [...d.pagos, { ...pago, idPago: id, fechaPago: nowDateTime(), metodoPagoId: pago.metodosPagoIds?.[0] }],
        ordenes: nuevoEstadoOrden
          ? d.ordenes.map(o => (o.idOrden === p.Orden_idOrden ? { ...o, Estado_idEstado: nuevoEstadoOrden } : o))
          : d.ordenes,
      }));
      return ok(`Pago #${id} registrado (modo local)`, id);
    }, 'Pago registrado');

  // ---------------------------------------------------------------- Cuentas y sesión
  const localAccounts = (): (UserSession & { clave: string })[] => {
    const raw = safeGet(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const registrarCuenta = async (c: Cliente, usuario: string, clave: string): Promise<OpResult> => {
    const nombre = `${c.Nombre} ${c.apellido}`;
    if (isOracle) {
      try {
        const r = await api.registro({ cliente: c, usuario, clave });
        await refreshFromOracle();
        if (!r.credencialEnOracle) {
          safeSet(ACCOUNTS_KEY, JSON.stringify([...localAccounts(), { usuario, clave, rol: 'Turista', nombre, clienteDocumento: c.numeroDocumento }]));
        }
        return ok('Cuenta creada: Cliente insertado en Oracle' + (r.credencialEnOracle ? ' y credencial en UsuarioSistema' : ''));
      } catch (err) {
        return fail((err as Error).message);
      }
    }
    if (data.clientes.some(x => x.numeroDocumento === c.numeroDocumento)) return fail('Ya existe un cliente con ese documento.');
    if ([...DEMO_USERS, ...localAccounts()].some(u => u.usuario === usuario)) return fail('El nombre de usuario ya está en uso.');
    setData(d => ({ ...d, clientes: [c, ...d.clientes] }));
    safeSet(ACCOUNTS_KEY, JSON.stringify([...localAccounts(), { usuario, clave, rol: 'Turista', nombre, clienteDocumento: c.numeroDocumento }]));
    return ok('Cuenta creada (modo local)');
  };

  const autenticar = async (usuario: string, clave: string): Promise<OpResult> => {
    const u = usuario.trim().toLowerCase();
    const local = [...DEMO_USERS, ...localAccounts()].find(x => x.usuario === u && x.clave === clave);
    let session: UserSession | null = null;
    try {
      const r = await api.login(u, clave);
      session = { usuario: r.usuario, nombre: r.nombre, rol: r.rol, restauranteId: r.restauranteId, clienteDocumento: r.clienteDocumento };
    } catch (err) {
      const msg = (err as Error).message;
      // Si el backend no responde se valida contra las cuentas locales.
      if (!msg.includes('backend') && !local) return fail(msg);
      if (local) {
        const { clave: _c, ...rest } = local;
        session = rest;
      }
    }
    if (!session) return fail('Usuario o contraseña incorrectos.');
    session.restauranteNombre = restName(session.restauranteId);
    login(session);
    return ok(`Bienvenido, ${session.nombre}`);
  };

  const login = (s: UserSession) => {
    setUser(s);
    setSelectedRestauranteId(s.rol === 'Gerente' && s.restauranteId ? s.restauranteId : null);
  };

  const logout = () => {
    setUser(null);
    setSelectedRestauranteId(null);
  };

  const resetDatabase = () => {
    safeSet(STORAGE_KEY, null);
    if (isOracle) refreshFromOracle();
    else setData(SEED_DATASET);
  };

  // ---------------------------------------------------------------- Notificaciones
  const notificaciones = useMemo<Notificacion[]>(() => {
    const hoy = new Date();
    const enDias = (f: string) => Math.ceil((new Date(`${f}T00:00:00`).getTime() - new Date(hoy.toDateString()).getTime()) / 86400000);
    const scope = (rid?: number) => !selectedRestauranteId || rid === selectedRestauranteId;
    const out: Notificacion[] = [];

    data.reservas
      .filter(r => [1, 2].includes(r.Estado_idEstado) && scope(r.Restaurante_idRestaurante))
      .filter(r => user?.rol !== 'Turista' || r.Cliente_numeroDocumento === user.clienteDocumento)
      .forEach(r => {
        const d = enDias(r.fechaReserva);
        if (d < 0 || d > 30) return;
        const cli = data.clientes.find(c => c.numeroDocumento === r.Cliente_numeroDocumento);
        out.push({
          id: `res-${r.idReserva}`,
          tipo: r.Estado_idEstado === 1 ? 'pendiente' : 'recordatorio',
          titulo: `${r.Estado_idEstado === 1 ? 'Reserva por confirmar' : 'Recordatorio de reserva'} #${r.idReserva}`,
          detalle: `${restName(r.Restaurante_idRestaurante)} · ${r.fechaReserva} ${r.horaReserva} · ${r.cantidadPersonas} pers. · ${cli ? `${cli.Nombre} ${cli.apellido}` : r.Cliente_numeroDocumento}${d === 0 ? ' · ¡HOY!' : ` · en ${d} día(s)`}`,
          fecha: r.fechaReserva,
        });
      });

    if (user?.rol !== 'Turista') {
      data.ordenes
        .filter(o => [1, 3, 4].includes(o.Estado_idEstado) && scope(o.restauranteId))
        .forEach(o =>
          out.push({
            id: `ord-${o.idOrden}`,
            tipo: 'alerta',
            titulo: `Orden #${o.idOrden} en curso`,
            detalle: `${data.estados.find(e => e.idEstado === o.Estado_idEstado)?.nombre} · ${o.tipo || ''} · ${restName(o.restauranteId) || ''}`,
            fecha: o.fecha.slice(0, 10),
          })
        );
      const pagadas = new Set(data.pagos.map(p => p.Orden_idOrden));
      data.ordenes
        .filter(o => [5, 6].includes(o.Estado_idEstado) && !pagadas.has(o.idOrden) && scope(o.restauranteId))
        .forEach(o =>
          out.push({
            id: `pago-${o.idOrden}`,
            tipo: 'pendiente',
            titulo: `Orden #${o.idOrden} sin pago registrado`,
            detalle: `Total $${o.total.toLocaleString('es-CO')} COP · registre el pago en Facturación`,
            fecha: o.fecha.slice(0, 10),
          })
        );
    }
    return out.sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [data, selectedRestauranteId, user]);

  return (
    <DatabaseContext.Provider
      value={{
        ...data,
        user,
        selectedRestauranteId,
        setSelectedRestauranteId,
        connectionMode,
        isOracleConnected: isOracle,
        health,
        lastSync,
        refreshFromOracle,
        addRestaurante,
        updateRestaurante,
        deleteRestaurante,
        addCliente,
        updateCliente,
        deleteCliente,
        addExperiencia,
        updateExperiencia,
        deleteExperiencia,
        addOrden,
        updateOrden,
        deleteOrden,
        addReserva,
        updateEstadoReserva,
        registrarPago,
        registrarCuenta,
        autenticar,
        notificaciones,
        login,
        logout,
        resetDatabase,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase debe ser usado dentro de un DatabaseProvider');
  return context;
};
