export interface Pais {
  idPais: string;
  nombre: string;
}

export interface Departamento {
  idDepartamento: string;
  nombre: string;
  Pais_idPais: string;
}

export interface Ciudad {
  idCiudad: string;
  nombre: string;
  Departamento_idDepartamento: string;
}

export interface TipoDocumento {
  idTipoDocumento: number;
  nombre: string;
}

export interface Estado {
  idEstado: number;
  nombre: string;
  descripcion: string;
}

export interface Restaurante {
  idRestaurante: number;
  nit: string;
  nombre: string;
  direccion: string;
  categoriaCocina: string;
  horaApertura: string;
  horaCierre: string;
  Ciudad_idCiudad: string;
}

export interface Cliente {
  numeroDocumento: string;
  Nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  paisOrigen: string;
  TipoDocumento_idTipoDocumento: number;
}

export interface ExperienciaTuristica {
  idExperiencia: number;
  nombreExperiencia: string;
  descripcion: string;
  precioPorPersona: number;
  duracion: number;
  Restaurante_idRestaurante: number;
}

export interface CartaMenu {
  idCategoria: number;
  nombrecategoria: string;
  Restaurante_idRestaurante: number;
}

export interface ItemMenu {
  idItem: number;
  nombrItem: string;
  descripcionItem: string;
  vegetariano: string; // '1' o '0'
  CategoriaMenu_idCategoria: number;
  precio: number;
}

export interface Mesa {
  idMesa: number;
  numeroMesa: number;
  capacidad: number;
  Restaurante_idRestaurante: number;
  disponibilidad: string; // '1' o '0'
}

export interface Personal {
  numeroDocumento: string;
  Nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  email: string;
  fechaContratacion: string;
  Restaurante_idRestaurante: number;
  TipoDocumento_idTipoDocumento: number;
  rol?: 'Administrador' | 'Chef' | 'Mesero' | 'Repartidor';
}

export interface DetalleOrden {
  ItemMenu_idItem: number;
  Orden_idOrden: number;
  cantidad: number;
  subTotal: number;
}

export interface DetalleExperienciaOrden {
  ExperienciaTuristica_idExperiencia: number;
  Orden_idOrden: number;
  subtotal: number;
  asistentes: number;
  fechaProgramada: string;
}

export interface Orden {
  idOrden: number;
  Cliente_numeroDocumento: string;
  total: number;
  fecha: string;
  Estado_idEstado: number;
  tipo?: 'Restaurante' | 'Domicilio';
  detallesMenu?: DetalleOrden[];
  detallesExperiencia?: DetalleExperienciaOrden[];
  mesaId?: number;
  direccionEntrega?: string;
  costoDomicilio?: number;
  restauranteId?: number;
}

export interface PeticionEspecial {
  idPeticion: number;
  nombre: string;
  descripcion: string;
}

export interface Reserva {
  idReserva: number;
  fechaReserva: string;
  horaReserva: string;
  cantidadPersonas: number;
  Cliente_numeroDocumento: string;
  Restaurante_idRestaurante: number;
  Estado_idEstado: number;
  peticionesEspeciales?: string[];
  experienciaTuristicaId?: number;
}

export interface Pago {
  idPago: number;
  monedaPago: string;
  totalPagado: number;
  propina: number;
  fechaPago: string;
  Orden_idOrden: number;
  metodoPagoId?: number;
}

export interface Resena {
  idResena: number;
  puntuacionComida: number;
  puntuacionServicio: number;
  comentario: string;
  fechaPublicacion: string;
  Restaurante_idRestaurante: number;
  Cliente_numeroDocumento: string;
}

export interface UserSession {
  usuario: string;
  nombre: string;
  rol: 'Administrador' | 'Gerente' | 'Chef' | 'Mesero' | 'Turista';
  restauranteId?: number; // Si es Gerente, Chef o Mesero, pertenece a una sede específica
  restauranteNombre?: string;
  token?: string;
}
