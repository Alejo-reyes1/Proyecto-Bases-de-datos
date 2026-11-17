// Genera el diccionario de datos (markdown) desde database/01_esquema.sql.
//   Uso: node scripts/generar-diccionario.mjs > docs/diccionario_datos.md
import fs from 'fs';
import { parseDDL } from './sqlParse.mjs';

const T = parseDDL(fs.readFileSync('database/01_esquema.sql', 'utf8'));

const PROPOSITO = {
  Pais: 'Catálogo de países (código ISO 3166-1) para ubicar departamentos y el origen de los clientes.',
  Departamento: 'Subdivisiones de cada país (código ISO 3166-2).',
  Ciudad: 'Ciudades y destinos turísticos donde operan las sedes.',
  TipoDocumento: 'Tipos de identificación de clientes y personal.',
  Estado: 'Estados del ciclo de vida, compartidos por órdenes y reservas.',
  Idioma: 'Idiomas que puede hablar el personal de salón.',
  MetodoPago: 'Medios de pago aceptados.',
  PeticionEspecial: 'Catálogo de peticiones que un cliente puede pedir al reservar.',
  Restaurante: 'Sedes de la cadena con su ubicación y horario.',
  Mesa: 'Mesas físicas de cada sede.',
  CartaMenu: 'Categorías de la carta de cada sede.',
  ItemMenu: 'Platos y bebidas de la carta con su precio.',
  ExperienciaTuristica: 'Tours, catas y talleres que ofrece cada sede, cobrados por persona.',
  Cliente: 'Turistas y comensales nacionales o extranjeros.',
  Personal: 'Colaboradores de las sedes (supertipo de Administrador, Chef, Mesero y Repartidor).',
  Administrador: 'Subtipo de Personal que administra una sede.',
  Chef: 'Subtipo de Personal a cargo de la cocina.',
  Mesero: 'Subtipo de Personal que atiende las mesas.',
  Repartidor: 'Subtipo de Personal que entrega domicilios.',
  MeseroIdioma: 'Relación N:M entre meseros e idiomas que hablan.',
  Orden: 'Transacción principal: pedido de un cliente (supertipo de OrdenRestaurante y OrdenDomicilio).',
  OrdenRestaurante: 'Subtipo de Orden consumida en salón, con mesa y mesero.',
  OrdenDomicilio: 'Subtipo de Orden entregada a domicilio.',
  DetalleOrden: 'Líneas de platos de cada orden (N:M Orden–ItemMenu).',
  DetalleExperienciaOrden: 'Cupos de experiencias comprados en cada orden (N:M Orden–ExperienciaTuristica).',
  Reserva: 'Reserva de mesa de un cliente en una sede.',
  ReservaPeticionesEsp: 'Peticiones especiales de cada reserva (N:M).',
  Pago: 'Pago registrado sobre una orden.',
  PagoMetodoPago: 'Medios usados en cada pago (N:M; permite pagos mixtos).',
  Resena: 'Calificación y comentario de un cliente sobre una sede.',
};

const COL = {
  nombre: 'Nombre', descripcion: 'Descripción', idPais: 'Código ISO del país', idDepartamento: 'Código ISO del departamento',
  idCiudad: 'Código de la ciudad (departamento + abreviatura)', Pais_idPais: 'País al que pertenece', Departamento_idDepartamento: 'Departamento al que pertenece',
  idTipoDocumento: 'Identificador del tipo de documento', idEstado: 'Identificador del estado', idIdioma: 'Identificador del idioma', nombreIdioma: 'Nombre del idioma',
  idMetodoPago: 'Identificador del medio de pago', idPeticion: 'Identificador de la petición', idRestaurante: 'Identificador de la sede', nit: 'NIT tributario',
  direccion: 'Dirección', categoriaCocina: 'Tipo de cocina', horaApertura: 'Hora de apertura', horaCierre: 'Hora de cierre', Ciudad_idCiudad: 'Ciudad donde está la sede',
  numeroMesa: 'Número visible de la mesa en la sede', idMesa: 'Identificador de la mesa', capacidad: 'Número de puestos', disponibilidad: 'Disponible (1) u ocupada (0)',
  Restaurante_idRestaurante: 'Sede asociada', idCategoria: 'Identificador de la categoría', nombrecategoria: 'Nombre de la categoría', idItem: 'Identificador del plato',
  nombrItem: 'Nombre del plato o bebida', descripcionItem: 'Descripción del plato', vegetariano: 'Apto vegetariano (1) o no (0)', CategoriaMenu_idCategoria: 'Categoría de la carta',
  precio: 'Precio en COP', idExperiencia: 'Identificador de la experiencia', nombreExperiencia: 'Nombre de la experiencia', precioPorPersona: 'Tarifa por persona en COP',
  duracion: 'Duración en horas', numeroDocumento: 'Número de documento (llave natural)', Nombre: 'Nombre(s)', apellido: 'Apellido(s)', email: 'Correo electrónico',
  telefono: 'Teléfono con indicativo', paisOrigen: 'Código ISO del país de origen', TipoDocumento_idTipoDocumento: 'Tipo de documento', fechaContratacion: 'Fecha de ingreso',
  Personal_numeroDocumento: 'Documento del colaborador (hereda de Personal)', aniosExperiencia: 'Años de experiencia', especialidad: 'Especialidad culinaria',
  turno: 'Turno de trabajo', medioTransporte: 'Vehículo de reparto', Mesero_Personal_numeroDocumento: 'Mesero', Idioma_idIdioma: 'Idioma',
  idOrden: 'Identificador de la orden', Cliente_numeroDocumento: 'Cliente', total: 'Total de la orden en COP (detalles + domicilio)', fecha: 'Fecha y hora de la orden',
  Estado_idEstado: 'Estado actual', Orden_idOrden: 'Orden asociada', Mesa_idMesa: 'Mesa que atendió la orden', direccionEntrega: 'Dirección de entrega',
  costoDomicilio: 'Costo del envío en COP', Repartidor_Personal_numeroDocumento: 'Repartidor asignado', ItemMenu_idItem: 'Plato pedido', cantidad: 'Unidades pedidas',
  subTotal: 'precio × cantidad', subtotal: 'precioPorPersona × asistentes', asistentes: 'Número de personas', ExperienciaTuristica_idExperiencia: 'Experiencia comprada',
  fechaProgramada: 'Fecha y hora de la experiencia', idReserva: 'Identificador de la reserva', fechaReserva: 'Fecha y hora reservadas', cantidadPersonas: 'Número de comensales',
  Reserva_idReserva: 'Reserva', PeticionEspecial_idPeticion: 'Petición solicitada', idPago: 'Identificador del pago', monedaPago: 'Moneda (COP, USD, EUR)',
  totalPagado: 'Valor pagado de la orden', propina: 'Propina voluntaria', fechaPago: 'Fecha y hora del pago', Pago_idPago: 'Pago', MetodoPago_idMetodoPago: 'Medio de pago usado',
  idResena: 'Identificador de la reseña', puntuacionComida: 'Nota de la comida (1 a 5)', puntuacionServicio: 'Nota del servicio (1 a 5)', comentario: 'Comentario del cliente',
  fechaPublicacion: 'Fecha de publicación',
};

const order = ['Pais', 'Departamento', 'Ciudad', 'TipoDocumento', 'Estado', 'Idioma', 'MetodoPago', 'PeticionEspecial', 'Restaurante', 'Mesa', 'CartaMenu', 'ItemMenu',
  'ExperienciaTuristica', 'Cliente', 'Personal', 'Administrador', 'Chef', 'Mesero', 'Repartidor', 'MeseroIdioma', 'Orden', 'OrdenRestaurante', 'OrdenDomicilio',
  'DetalleOrden', 'DetalleExperienciaOrden', 'Reserva', 'ReservaPeticionesEsp', 'Pago', 'PagoMetodoPago', 'Resena'];

const parts = order.map((name, i) => {
  const t = T[name];
  const fk = Object.fromEntries(t.fks.map(f => [f.column, f.refTable]));
  const rows = t.columns.map(c => {
    const tipo = c.type === 'VARCHAR2' ? `VARCHAR2(${c.length})` : c.type;
    const restr = [c.notNull || t.pk.includes(c.name) ? 'NOT NULL' : 'Nulo permitido', t.pk.includes(c.name) && t.pk.length === 1 ? 'UNIQUE (PK)' : ''].filter(Boolean).join(', ');
    return `| ${c.name} | ${COL[c.name] || ''} | ${tipo} | ${restr} | ${t.pk.includes(c.name) ? 'Sí' : 'No'} | ${fk[c.name] ? `Sí → ${fk[c.name]}` : 'No'} |`;
  });
  return `### 6.${i + 1} ${name}\n\n**Finalidad:** ${PROPOSITO[name]} PK: ${t.pk.join(' + ')}.\n\n| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |\n| --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}`;
});
process.stdout.write(parts.join('\n\n') + '\n');
