// Transforma las filas crudas de las 30 tablas ({ Tabla: [fila] }) en el
// dataset que consume la aplicación React. Lo usan:
//   - scripts/generar-seed.mjs  (filas leídas del DML -> src/data/seedData.ts)
//   - server/index.js           (filas leídas en vivo desde Oracle -> /api/dataset)
// Así, el modo sin conexión y el modo Oracle muestran exactamente la misma estructura.

const num = v => (v === null || v === undefined || v === '' ? null : Number(v));
const str = v => (v === null || v === undefined ? '' : String(v));
const datePart = v => str(v).slice(0, 10);
const timePart = v => {
  const s = str(v);
  return s.length > 10 ? s.slice(11, 16) : s.length === 5 ? s : '';
};

export function buildDataset(raw) {
  const t = name => raw[name] || [];

  const roles = {};
  t('Administrador').forEach(r => (roles[r.Personal_numeroDocumento] = 'Administrador'));
  t('Chef').forEach(r => (roles[r.Personal_numeroDocumento] = 'Chef'));
  t('Mesero').forEach(r => (roles[r.Personal_numeroDocumento] = 'Mesero'));
  t('Repartidor').forEach(r => (roles[r.Personal_numeroDocumento] = 'Repartidor'));

  const personal = t('Personal').map(p => ({
    numeroDocumento: str(p.numeroDocumento),
    Nombre: str(p.Nombre),
    apellido: str(p.apellido),
    telefono: str(p.telefono),
    direccion: str(p.direccion),
    email: str(p.email),
    fechaContratacion: datePart(p.fechaContratacion),
    Restaurante_idRestaurante: num(p.Restaurante_idRestaurante),
    TipoDocumento_idTipoDocumento: num(p.TipoDocumento_idTipoDocumento),
    rol: roles[p.numeroDocumento],
  }));
  const restOfPersonal = Object.fromEntries(personal.map(p => [p.numeroDocumento, p.Restaurante_idRestaurante]));

  const mesas = t('Mesa').map(m => ({
    idMesa: num(m.idMesa),
    numeroMesa: num(m.numeroMesa),
    capacidad: num(m.capacidad),
    Restaurante_idRestaurante: num(m.Restaurante_idRestaurante),
    disponibilidad: str(m.disponibilidad),
  }));
  const restOfMesa = Object.fromEntries(mesas.map(m => [m.idMesa, m.Restaurante_idRestaurante]));

  const salon = Object.fromEntries(t('OrdenRestaurante').map(r => [num(r.Orden_idOrden), r]));
  const domicilio = Object.fromEntries(t('OrdenDomicilio').map(r => [num(r.Orden_idOrden), r]));

  const ordenes = t('Orden')
    .map(o => {
      const id = num(o.idOrden);
      const s = salon[id];
      const d = domicilio[id];
      const base = {
        idOrden: id,
        Cliente_numeroDocumento: str(o.Cliente_numeroDocumento),
        total: num(o.total) ?? 0,
        fecha: str(o.fecha),
        Estado_idEstado: num(o.Estado_idEstado),
        detallesMenu: t('DetalleOrden')
          .filter(x => num(x.Orden_idOrden) === id)
          .map(x => ({
            ItemMenu_idItem: num(x.ItemMenu_idItem),
            Orden_idOrden: id,
            cantidad: num(x.cantidad),
            subTotal: num(x.subTotal),
          })),
        detallesExperiencia: t('DetalleExperienciaOrden')
          .filter(x => num(x.Orden_idOrden) === id)
          .map(x => ({
            ExperienciaTuristica_idExperiencia: num(x.ExperienciaTuristica_idExperiencia),
            Orden_idOrden: id,
            subtotal: num(x.subtotal),
            asistentes: num(x.asistentes),
            fechaProgramada: str(x.fechaProgramada),
          })),
      };
      if (s) {
        return {
          ...base,
          tipo: 'Restaurante',
          mesaId: num(s.Mesa_idMesa),
          meseroId: str(s.Mesero_Personal_numeroDocumento),
          restauranteId: restOfMesa[num(s.Mesa_idMesa)],
        };
      }
      if (d) {
        return {
          ...base,
          tipo: 'Domicilio',
          direccionEntrega: str(d.direccionEntrega),
          costoDomicilio: num(d.costoDomicilio) ?? 0,
          repartidorId: str(d.Repartidor_Personal_numeroDocumento),
          restauranteId: restOfPersonal[str(d.Repartidor_Personal_numeroDocumento)],
        };
      }
      return base;
    })
    .sort((a, b) => b.idOrden - a.idOrden);

  const peticiones = Object.fromEntries(t('PeticionEspecial').map(p => [num(p.idPeticion), str(p.nombre)]));
  const reservas = t('Reserva')
    .map(r => {
      const id = num(r.idReserva);
      const ids = t('ReservaPeticionesEsp')
        .filter(x => num(x.Reserva_idReserva) === id)
        .map(x => num(x.PeticionEspecial_idPeticion))
        .sort((a, b) => a - b);
      return {
        idReserva: id,
        fechaReserva: datePart(r.fechaReserva),
        horaReserva: timePart(r.fechaReserva),
        cantidadPersonas: num(r.cantidadPersonas),
        Cliente_numeroDocumento: str(r.Cliente_numeroDocumento),
        Restaurante_idRestaurante: num(r.Restaurante_idRestaurante),
        Estado_idEstado: num(r.Estado_idEstado),
        peticionesIds: ids,
        peticionesEspeciales: ids.map(i => peticiones[i]).filter(Boolean),
      };
    })
    .sort((a, b) => b.idReserva - a.idReserva);

  const metodosPorPago = {};
  // (se ordenan abajo para que Oracle y el DML den el mismo orden)
  t('PagoMetodoPago').forEach(x => {
    (metodosPorPago[num(x.Pago_idPago)] ||= []).push(num(x.MetodoPago_idMetodoPago));
  });

  return {
    paises: t('Pais').map(p => ({ idPais: str(p.idPais), nombre: str(p.nombre) })),
    departamentos: t('Departamento').map(d => ({
      idDepartamento: str(d.idDepartamento),
      nombre: str(d.nombre),
      Pais_idPais: str(d.Pais_idPais),
    })),
    ciudades: t('Ciudad').map(c => ({
      idCiudad: str(c.idCiudad),
      nombre: str(c.nombre),
      Departamento_idDepartamento: str(c.Departamento_idDepartamento),
    })),
    tiposDocumento: t('TipoDocumento').map(x => ({ idTipoDocumento: num(x.idTipoDocumento), nombre: str(x.nombre) })),
    estados: t('Estado').map(x => ({ idEstado: num(x.idEstado), nombre: str(x.nombre), descripcion: str(x.descripcion) })),
    idiomas: t('Idioma').map(x => ({ idIdioma: num(x.idIdioma), nombreIdioma: str(x.nombreIdioma) })),
    metodosPago: t('MetodoPago').map(x => ({ idMetodoPago: num(x.idMetodoPago), nombre: str(x.nombre) })),
    peticionesEspeciales: t('PeticionEspecial').map(x => ({
      idPeticion: num(x.idPeticion),
      nombre: str(x.nombre),
      descripcion: str(x.descripcion),
    })),
    restaurantes: t('Restaurante')
      .map(r => ({
        idRestaurante: num(r.idRestaurante),
        nit: str(r.nit),
        nombre: str(r.nombre),
        direccion: str(r.direccion),
        categoriaCocina: str(r.categoriaCocina),
        horaApertura: timePart(r.horaApertura),
        horaCierre: timePart(r.horaCierre),
        Ciudad_idCiudad: str(r.Ciudad_idCiudad),
      }))
      .sort((a, b) => a.idRestaurante - b.idRestaurante),
    clientes: t('Cliente').map(c => ({
      numeroDocumento: str(c.numeroDocumento),
      Nombre: str(c.Nombre),
      apellido: str(c.apellido),
      email: str(c.email),
      telefono: str(c.telefono),
      paisOrigen: str(c.paisOrigen),
      TipoDocumento_idTipoDocumento: num(c.TipoDocumento_idTipoDocumento),
    })),
    experiencias: t('ExperienciaTuristica')
      .map(e => ({
        idExperiencia: num(e.idExperiencia),
        nombreExperiencia: str(e.nombreExperiencia),
        descripcion: str(e.descripcion),
        precioPorPersona: num(e.precioPorPersona) ?? 0,
        duracion: num(e.duracion) ?? 0,
        Restaurante_idRestaurante: num(e.Restaurante_idRestaurante),
      }))
      .sort((a, b) => a.idExperiencia - b.idExperiencia),
    cartasMenu: t('CartaMenu').map(c => ({
      idCategoria: num(c.idCategoria),
      nombrecategoria: str(c.nombrecategoria),
      Restaurante_idRestaurante: num(c.Restaurante_idRestaurante),
    })),
    itemsMenu: t('ItemMenu').map(i => ({
      idItem: num(i.idItem),
      nombrItem: str(i.nombrItem),
      descripcionItem: str(i.descripcionItem),
      vegetariano: str(i.vegetariano),
      CategoriaMenu_idCategoria: num(i.CategoriaMenu_idCategoria),
      precio: num(i.precio) ?? 0,
    })),
    mesas,
    personal,
    meseros: t('Mesero').map(m => ({ Personal_numeroDocumento: str(m.Personal_numeroDocumento), turno: str(m.turno) })),
    chefs: t('Chef').map(c => ({ Personal_numeroDocumento: str(c.Personal_numeroDocumento), especialidad: str(c.especialidad) })),
    administradores: t('Administrador').map(a => ({
      Personal_numeroDocumento: str(a.Personal_numeroDocumento),
      aniosExperiencia: num(a.aniosExperiencia),
    })),
    repartidores: t('Repartidor').map(r => ({
      Personal_numeroDocumento: str(r.Personal_numeroDocumento),
      medioTransporte: str(r.medioTransporte),
    })),
    meseroIdiomas: t('MeseroIdioma').map(m => ({
      Mesero_Personal_numeroDocumento: str(m.Mesero_Personal_numeroDocumento),
      Idioma_idIdioma: num(m.Idioma_idIdioma),
    })),
    ordenes,
    reservas,
    resenas: t('Resena')
      .map(r => ({
        idResena: num(r.idResena),
        puntuacionComida: num(r.puntuacionComida),
        puntuacionServicio: num(r.puntuacionServicio),
        comentario: str(r.comentario),
        fechaPublicacion: datePart(r.fechaPublicacion),
        Restaurante_idRestaurante: num(r.Restaurante_idRestaurante),
        Cliente_numeroDocumento: str(r.Cliente_numeroDocumento),
      }))
      .sort((a, b) => a.idResena - b.idResena),
    pagos: t('Pago')
      .map(p => {
        const metodos = (metodosPorPago[num(p.idPago)] || []).sort((a, b) => a - b);
        return {
          idPago: num(p.idPago),
          monedaPago: str(p.monedaPago),
          totalPagado: num(p.totalPagado) ?? 0,
          propina: num(p.propina) ?? 0,
          fechaPago: str(p.fechaPago),
          Orden_idOrden: num(p.Orden_idOrden),
          metodoPagoId: metodos[0],
          metodosPagoIds: metodos,
        };
      })
      .sort((a, b) => a.idPago - b.idPago),
    conteos: Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v.length])),
  };
}
