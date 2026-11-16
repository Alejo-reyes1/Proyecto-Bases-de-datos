import {
  Pais,
  Ciudad,
  TipoDocumento,
  Estado,
  Restaurante,
  Cliente,
  ExperienciaTuristica,
  CartaMenu,
  ItemMenu,
  Mesa,
  Personal,
  Orden,
  Pago,
  Resena,
  PeticionEspecial,
  Reserva
} from '../types';

export const INITIAL_PAISES: Pais[] = [
  { idPais: 'CO', nombre: 'Colombia' },
  { idPais: 'AR', nombre: 'Argentina' },
  { idPais: 'ES', nombre: 'España' },
  { idPais: 'MX', nombre: 'México' },
  { idPais: 'PE', nombre: 'Perú' },
  { idPais: 'US', nombre: 'Estados Unidos' },
  { idPais: 'FR', nombre: 'Francia' },
  { idPais: 'BR', nombre: 'Brasil' },
];

export const INITIAL_CIUDADES: Ciudad[] = [
  { idCiudad: 'CO-QUI-SAL', nombre: 'Salento', Departamento_idDepartamento: 'CO-QUI' },
  { idCiudad: 'CO-QUI-ARM', nombre: 'Armenia', Departamento_idDepartamento: 'CO-QUI' },
  { idCiudad: 'CO-QUI-FIL', nombre: 'Filandia', Departamento_idDepartamento: 'CO-QUI' },
  { idCiudad: 'CO-ANT-MED', nombre: 'Medellín', Departamento_idDepartamento: 'CO-ANT' },
  { idCiudad: 'CO-DC-BOG', nombre: 'Bogotá', Departamento_idDepartamento: 'CO-DC' },
  { idCiudad: 'CO-BOL-CTG', nombre: 'Cartagena', Departamento_idDepartamento: 'CO-BOL' },
  { idCiudad: 'CO-VAC-CAL', nombre: 'Cali', Departamento_idDepartamento: 'CO-VAC' },
  { idCiudad: 'CO-ANT-RNG', nombre: 'Rionegro', Departamento_idDepartamento: 'CO-ANT' },
];

export const INITIAL_TIPOS_DOCUMENTO: TipoDocumento[] = [
  { idTipoDocumento: 1, nombre: 'Cédula de Ciudadanía' },
  { idTipoDocumento: 2, nombre: 'Pasaporte' },
  { idTipoDocumento: 3, nombre: 'Cédula de Extranjería' },
  { idTipoDocumento: 4, nombre: 'NIT' },
  { idTipoDocumento: 5, nombre: 'Tarjeta de Identidad' },
];

export const INITIAL_ESTADOS: Estado[] = [
  { idEstado: 1, nombre: 'Pendiente', descripcion: 'Recibida en el sistema, en espera de confirmación' },
  { idEstado: 2, nombre: 'Confirmada', descripcion: 'Confirmada por el restaurante' },
  { idEstado: 3, nombre: 'En Preparación', descripcion: 'Comanda en cocina / tour preparándose' },
  { idEstado: 4, nombre: 'Listo', descripcion: 'Listo para servir o despacho' },
  { idEstado: 5, nombre: 'Entregada', descripcion: 'Servida en mesa o entregada a domicilio' },
  { idEstado: 6, nombre: 'Cancelada', descripcion: 'Cancelada por el cliente o restaurante' },
  { idEstado: 7, nombre: 'Pagada', descripcion: 'Pago registrado satisfactoriamente' },
  { idEstado: 8, nombre: 'Finalizada', descripcion: 'Servicio completado y cerrado' },
];

export const INITIAL_PETICIONES_ESPECIALES: PeticionEspecial[] = [
  { idPeticion: 1, nombre: 'Silla para bebé', descripcion: 'Silla alta para niños pequeños y familias' },
  { idPeticion: 2, nombre: 'Decoración de cumpleaños', descripcion: 'Globos y postre con vela artesanal para el homenajeado' },
  { idPeticion: 3, nombre: 'Mesa con vista panorámica', descripcion: 'Ubicación en terraza o balcón con vista a cafetales o murallas' },
  { idPeticion: 4, nombre: 'Menú sin gluten / celíacos', descripcion: 'Preparaciones e insumos 100% libres de gluten' },
  { idPeticion: 5, nombre: 'Acceso para movilidad reducida', descripcion: 'Mesa en planta baja sin escalones' },
  { idPeticion: 6, nombre: 'Celebración de aniversario', descripcion: 'Ambientación romántica con velas y brindis de bienvenida' },
];

export const INITIAL_RESTAURANTES: Restaurante[] = [
  {
    idRestaurante: 1,
    nit: '900123451-1',
    nombre: 'El Fogón Cafetero',
    direccion: 'Calle Real # 6-15',
    categoriaCocina: 'Típica cafetera',
    horaApertura: '07:00',
    horaCierre: '21:00',
    Ciudad_idCiudad: 'CO-QUI-SAL'
  },
  {
    idRestaurante: 2,
    nit: '900123452-2',
    nombre: 'Mar y Murallas',
    direccion: 'Calle del Arsenal # 9-40',
    categoriaCocina: 'Caribeña y mariscos',
    horaApertura: '12:00',
    horaCierre: '23:00',
    Ciudad_idCiudad: 'CO-BOL-CTG'
  },
  {
    idRestaurante: 3,
    nit: '900123453-3',
    nombre: 'Sabores de la Montaña',
    direccion: 'Carrera 70 # 44-21',
    categoriaCocina: 'Antioqueña tradicional',
    horaApertura: '11:00',
    horaCierre: '22:00',
    Ciudad_idCiudad: 'CO-ANT-MED'
  },
  {
    idRestaurante: 4,
    nit: '900123454-4',
    nombre: 'La Cosecha Andina',
    direccion: 'Carrera 4 # 12-35',
    categoriaCocina: 'Contemporánea colombiana',
    horaApertura: '12:00',
    horaCierre: '23:00',
    Ciudad_idCiudad: 'CO-DC-BOG'
  },
  {
    idRestaurante: 5,
    nit: '900123455-5',
    nombre: 'Raíces del Pacífico',
    direccion: 'Calle 3 Oeste # 2-60',
    categoriaCocina: 'Pacífica colombiana',
    horaApertura: '12:00',
    horaCierre: '22:00',
    Ciudad_idCiudad: 'CO-VAC-CAL'
  },
  {
    idRestaurante: 6,
    nit: '900123456-6',
    nombre: 'Mirador del Café',
    direccion: 'Carrera 6 # 7-30',
    categoriaCocina: 'Cafés de especialidad y postres',
    horaApertura: '08:00',
    horaCierre: '20:00',
    Ciudad_idCiudad: 'CO-QUI-FIL'
  }
];

export const INITIAL_CLIENTES: Cliente[] = [
  { numeroDocumento: '1094900101', Nombre: 'Carlos', apellido: 'Gómez', email: 'carlos.gomez@gmail.com', telefono: '3104501122', paisOrigen: 'CO', TipoDocumento_idTipoDocumento: 1 },
  { numeroDocumento: '1094900102', Nombre: 'María', apellido: 'Rodríguez', email: 'maria.rodriguez@hotmail.com', telefono: '3117894561', paisOrigen: 'CO', TipoDocumento_idTipoDocumento: 1 },
  { numeroDocumento: '1094900103', Nombre: 'Juan David', apellido: 'Ospina', email: 'jd.ospina@gmail.com', telefono: '3156678901', paisOrigen: 'CO', TipoDocumento_idTipoDocumento: 1 },
  { numeroDocumento: '1094900104', Nombre: 'Laura', apellido: 'Restrepo', email: 'laura.restrepo@outlook.com', telefono: '3001234567', paisOrigen: 'CO', TipoDocumento_idTipoDocumento: 1 },
  { numeroDocumento: '1094900105', Nombre: 'Andrés', apellido: 'Jaramillo', email: 'andres.jaramillo@gmail.com', telefono: '3123456789', paisOrigen: 'CO', TipoDocumento_idTipoDocumento: 1 },
  { numeroDocumento: '1094900106', Nombre: 'Valentina', apellido: 'Morales', email: 'valen.morales@yahoo.es', telefono: '3189991122', paisOrigen: 'CO', TipoDocumento_idTipoDocumento: 1 },
  { numeroDocumento: '1094900107', Nombre: 'Santiago', apellido: 'Henao', email: 'santiago.henao@gmail.com', telefono: '3205556677', paisOrigen: 'CO', TipoDocumento_idTipoDocumento: 1 },
  { numeroDocumento: '1094900108', Nombre: 'Camila', apellido: 'Vargas', email: 'camila.vargas@hotmail.com', telefono: '3138887766', paisOrigen: 'CO', TipoDocumento_idTipoDocumento: 1 },
  { numeroDocumento: 'PAS-US-55412', Nombre: 'John', apellido: 'Smith', email: 'john.smith@gmail.com', telefono: '+14155550190', paisOrigen: 'US', TipoDocumento_idTipoDocumento: 2 },
  { numeroDocumento: 'PAS-US-77821', Nombre: 'Emily', apellido: 'Johnson', email: 'emily.j@yahoo.com', telefono: '+12125550143', paisOrigen: 'US', TipoDocumento_idTipoDocumento: 2 },
  { numeroDocumento: 'PAS-ES-33190', Nombre: 'Alejandro', apellido: 'García', email: 'alejandro.garcia@gmail.com', telefono: '+34612345678', paisOrigen: 'ES', TipoDocumento_idTipoDocumento: 2 },
  { numeroDocumento: 'PAS-FR-88204', Nombre: 'Sophie', apellido: 'Dubois', email: 'sophie.dubois@free.fr', telefono: '+33612345678', paisOrigen: 'FR', TipoDocumento_idTipoDocumento: 2 },
  { numeroDocumento: 'PAS-MX-12903', Nombre: 'Diego', apellido: 'Hernández', email: 'diego.hdz@gmail.com', telefono: '+525555551234', paisOrigen: 'MX', TipoDocumento_idTipoDocumento: 2 },
  { numeroDocumento: 'PAS-AR-44910', Nombre: 'Mateo', apellido: 'Fernández', email: 'mateo.fer@gmail.com', telefono: '+5491144556677', paisOrigen: 'AR', TipoDocumento_idTipoDocumento: 2 },
  { numeroDocumento: 'PAS-BR-99012', Nombre: 'Camila', apellido: 'Silva', email: 'camila.silva@uol.com.br', telefono: '+5511987654321', paisOrigen: 'BR', TipoDocumento_idTipoDocumento: 2 },
];

export const INITIAL_EXPERIENCIAS: ExperienciaTuristica[] = [
  {
    idExperiencia: 1,
    nombreExperiencia: 'Tour de café y cata de origen',
    descripcion: 'Recorrido interactivo por finca cafetera tradicional con cata de tres variedades especiales',
    precioPorPersona: 85000,
    duracion: 3,
    Restaurante_idRestaurante: 1
  },
  {
    idExperiencia: 2,
    nombreExperiencia: 'Clase de cocina campesina cafetera',
    descripcion: 'Aprende a preparar trucha al ajillo y patacón gigante con el chef ejecutivo',
    precioPorPersona: 120000,
    duracion: 2.5,
    Restaurante_idRestaurante: 1
  },
  {
    idExperiencia: 3,
    nombreExperiencia: 'Taller de cocina caribeña y ceviches',
    descripcion: 'Masterclass de preparación de ceviche cartagenero y arroz de coco con maridaje',
    precioPorPersona: 150000,
    duracion: 3,
    Restaurante_idRestaurante: 2
  },
  {
    idExperiencia: 4,
    nombreExperiencia: 'Ruta gastronómica amurallada',
    descripcion: 'Caminata nocturna por el centro histórico probando aperitivos y cócteles locales',
    precioPorPersona: 110000,
    duracion: 2,
    Restaurante_idRestaurante: 2
  },
  {
    idExperiencia: 5,
    nombreExperiencia: 'Cata de cervezas artesanales antioqueñas',
    descripcion: 'Degustación guiada de cinco variedades de cervezas con picada montañera',
    precioPorPersona: 70000,
    duracion: 1.5,
    Restaurante_idRestaurante: 3
  },
  {
    idExperiencia: 6,
    nombreExperiencia: 'Mercado de Paloquemao y cocina bogotana',
    descripcion: 'Visita guiada a la plaza de mercado y preparación de ajiaco santafereño',
    precioPorPersona: 130000,
    duracion: 4,
    Restaurante_idRestaurante: 4
  },
  {
    idExperiencia: 7,
    nombreExperiencia: 'Noche de sabores y marimba del Pacífico',
    descripcion: 'Cena maridada de 4 tiempos con ensamble de música tradicional de marimba en vivo',
    precioPorPersona: 95000,
    duracion: 2,
    Restaurante_idRestaurante: 5
  },
  {
    idExperiencia: 8,
    nombreExperiencia: 'Barismo para turistas y arte latte',
    descripcion: 'Taller práctico de métodos de filtrado (Chemex, Aeropress, V60) y arte latte',
    precioPorPersona: 90000,
    duracion: 2,
    Restaurante_idRestaurante: 6
  }
];

export const INITIAL_CARTAS_MENU: CartaMenu[] = [
  { idCategoria: 1, nombrecategoria: 'Desayunos cafeteros', Restaurante_idRestaurante: 1 },
  { idCategoria: 2, nombrecategoria: 'Platos fuertes', Restaurante_idRestaurante: 1 },
  { idCategoria: 3, nombrecategoria: 'Bebidas de café', Restaurante_idRestaurante: 1 },
  { idCategoria: 4, nombrecategoria: 'Entradas de mar', Restaurante_idRestaurante: 2 },
  { idCategoria: 5, nombrecategoria: 'Pescados y mariscos', Restaurante_idRestaurante: 2 },
  { idCategoria: 6, nombrecategoria: 'Cócteles caribeños', Restaurante_idRestaurante: 2 },
  { idCategoria: 7, nombrecategoria: 'Típicos de montaña', Restaurante_idRestaurante: 3 },
  { idCategoria: 8, nombrecategoria: 'Parrilla y carnes', Restaurante_idRestaurante: 3 },
  { idCategoria: 9, nombrecategoria: 'Entradas autor', Restaurante_idRestaurante: 4 },
  { idCategoria: 10, nombrecategoria: 'Fuertes autor', Restaurante_idRestaurante: 4 },
  { idCategoria: 11, nombrecategoria: 'Postres andinos', Restaurante_idRestaurante: 4 },
  { idCategoria: 12, nombrecategoria: 'Entradas del mar', Restaurante_idRestaurante: 5 },
  { idCategoria: 13, nombrecategoria: 'Cazuelas y arroces', Restaurante_idRestaurante: 5 },
  { idCategoria: 14, nombrecategoria: 'Bebidas ancestrales', Restaurante_idRestaurante: 5 },
  { idCategoria: 15, nombrecategoria: 'Métodos filtrados', Restaurante_idRestaurante: 6 },
  { idCategoria: 16, nombrecategoria: 'Repostería artesanal', Restaurante_idRestaurante: 6 }
];

export const INITIAL_ITEMS_MENU: ItemMenu[] = [
  { idItem: 1, nombrItem: 'Calentao paisa montañero', descripcionItem: 'Frijoles con arroz, huevo frito, arepa con quesito y carne en polvo', vegetariano: '0', CategoriaMenu_idCategoria: 1, precio: 18000 },
  { idItem: 2, nombrItem: 'Arepa de chócolo con quesito', descripcionItem: 'Arepa dulce recién asada con quesito de Salento', vegetariano: '1', CategoriaMenu_idCategoria: 1, precio: 12000 },
  { idItem: 3, nombrItem: 'Trucha al ajillo de Salento', descripcionItem: 'Trucha arcoíris fresca con salsa de ajo sobre patacón gigante', vegetariano: '0', CategoriaMenu_idCategoria: 2, precio: 38000 },
  { idItem: 4, nombrItem: 'Trucha gratinada con champiñones', descripcionItem: 'Filete de trucha con salsa blanca gratinada al horno', vegetariano: '0', CategoriaMenu_idCategoria: 2, precio: 42000 },
  { idItem: 5, nombrItem: 'Sancocho de gallina campesina', descripcionItem: 'Sopa tradicional cocinada a fuego de leña con plátano y yuca', vegetariano: '0', CategoriaMenu_idCategoria: 2, precio: 32000 },
  { idItem: 6, nombrItem: 'Café de origen filtrado Chemex', descripcionItem: 'Café variedad Geisha cultivado a 1.800 msnm', vegetariano: '1', CategoriaMenu_idCategoria: 3, precio: 9000 },
  { idItem: 7, nombrItem: 'Café latte con miel de caña', descripcionItem: 'Espresso doble con leche texturizada y miel de panela orgánica', vegetariano: '1', CategoriaMenu_idCategoria: 3, precio: 11000 },
  { idItem: 8, nombrItem: 'Ceviche cartagenero de corvina', descripcionItem: 'Corvina curada en limón criollo con cebolla morada y maíz crocante', vegetariano: '0', CategoriaMenu_idCategoria: 4, precio: 36000 },
  { idItem: 9, nombrItem: 'Encocado de langostinos', descripcionItem: 'Langostinos salteados en salsa criolla de coco y hierbas de azotea', vegetariano: '0', CategoriaMenu_idCategoria: 5, precio: 58000 },
  { idItem: 10, nombrItem: 'Pargo rojo frito con patacones', descripcionItem: 'Pargo entero crujiente servido con arroz con coco y ensalada fresca', vegetariano: '0', CategoriaMenu_idCategoria: 5, precio: 62000 },
  { idItem: 11, nombrItem: 'Bandeja paisa tradicional', descripcionItem: 'Plato insignia antioqueño con chicharrón crocante, aguacate y morcilla', vegetariano: '0', CategoriaMenu_idCategoria: 7, precio: 42000 },
  { idItem: 12, nombrItem: 'Chicharrón montañero de 12 cortes', descripcionItem: 'Panceta de cerdo confitada a baja temperatura y crocante', vegetariano: '0', CategoriaMenu_idCategoria: 7, precio: 28000 },
  { idItem: 13, nombrItem: 'Ajiaco santafereño de autor', descripcionItem: 'Tres tipos de papa, guascas, pollo desmechado, alcaparras y crema de leche', vegetariano: '0', CategoriaMenu_idCategoria: 10, precio: 39000 },
  { idItem: 14, nombrItem: 'Cazuela de mariscos del Pacífico', descripcionItem: 'Camarones, calamares, piangua y pescado en reducción espesa de coco', vegetariano: '0', CategoriaMenu_idCategoria: 13, precio: 54000 },
  { idItem: 15, nombrItem: 'Torta artesanal de café y nueces', descripcionItem: 'Bizcocho húmedo infusionado con espresso y crema de queso', vegetariano: '1', CategoriaMenu_idCategoria: 16, precio: 14000 }
];

export const INITIAL_MESAS: Mesa[] = [
  { idMesa: 1, numeroMesa: 1, capacidad: 2, Restaurante_idRestaurante: 1, disponibilidad: '1' },
  { idMesa: 2, numeroMesa: 2, capacidad: 4, Restaurante_idRestaurante: 1, disponibilidad: '1' },
  { idMesa: 3, numeroMesa: 3, capacidad: 6, Restaurante_idRestaurante: 1, disponibilidad: '0' },
  { idMesa: 4, numeroMesa: 4, capacidad: 4, Restaurante_idRestaurante: 2, disponibilidad: '1' },
  { idMesa: 5, numeroMesa: 5, capacidad: 8, Restaurante_idRestaurante: 2, disponibilidad: '1' },
  { idMesa: 6, numeroMesa: 6, capacidad: 4, Restaurante_idRestaurante: 3, disponibilidad: '1' },
  { idMesa: 7, numeroMesa: 7, capacidad: 6, Restaurante_idRestaurante: 4, disponibilidad: '1' },
  { idMesa: 8, numeroMesa: 8, capacidad: 4, Restaurante_idRestaurante: 5, disponibilidad: '1' },
  { idMesa: 9, numeroMesa: 9, capacidad: 2, Restaurante_idRestaurante: 6, disponibilidad: '1' },
];

export const INITIAL_PERSONAL: Personal[] = [
  { numeroDocumento: '75080001', Nombre: 'Luis', apellido: 'Echeverri', telefono: '3101112233', direccion: 'Calle 10 # 5-20', email: 'admin.salento@fogon.com', fechaContratacion: '2022-01-15', Restaurante_idRestaurante: 1, TipoDocumento_idTipoDocumento: 1, rol: 'Administrador' },
  { numeroDocumento: '75080002', Nombre: 'Hernán', apellido: 'Castaño', telefono: '3112223344', direccion: 'Carrera 4 # 8-12', email: 'chef.hernan@fogon.com', fechaContratacion: '2022-03-01', Restaurante_idRestaurante: 1, TipoDocumento_idTipoDocumento: 1, rol: 'Chef' },
  { numeroDocumento: '75080003', Nombre: 'Sebastián', apellido: 'Gutiérrez', telefono: '3123334455', direccion: 'Calle 7 # 3-14', email: 'sebastian.mesero@fogon.com', fechaContratacion: '2023-02-10', Restaurante_idRestaurante: 1, TipoDocumento_idTipoDocumento: 1, rol: 'Mesero' },
  { numeroDocumento: '75080004', Nombre: 'Fabián', apellido: 'Pérez', telefono: '3134445566', direccion: 'Carrera 5 # 11-08', email: 'fabian.domi@fogon.com', fechaContratacion: '2023-06-01', Restaurante_idRestaurante: 1, TipoDocumento_idTipoDocumento: 1, rol: 'Repartidor' },
  { numeroDocumento: '75080005', Nombre: 'Beatriz', apellido: 'Herrera', telefono: '3156667788', direccion: 'Calle del Torno # 38-12', email: 'admin.cartagena@marymurallas.com', fechaContratacion: '2021-08-01', Restaurante_idRestaurante: 2, TipoDocumento_idTipoDocumento: 1, rol: 'Administrador' },
  { numeroDocumento: '75080006', Nombre: 'Manuel', apellido: 'Paternina', telefono: '3167778899', direccion: 'Getsemaní # 25-10', email: 'chef.manuel@marymurallas.com', fechaContratacion: '2021-09-15', Restaurante_idRestaurante: 2, TipoDocumento_idTipoDocumento: 1, rol: 'Chef' },
];

export const INITIAL_ORDENES: Orden[] = [
  {
    idOrden: 1,
    Cliente_numeroDocumento: '1094900101',
    total: 217000,
    fecha: '2024-10-01',
    Estado_idEstado: 7,
    tipo: 'Restaurante',
    restauranteId: 1,
    mesaId: 2,
    detallesMenu: [
      { ItemMenu_idItem: 3, Orden_idOrden: 1, cantidad: 2, subTotal: 76000 },
      { ItemMenu_idItem: 6, Orden_idOrden: 1, cantidad: 2, subTotal: 18000 }
    ],
    detallesExperiencia: [
      { ExperienciaTuristica_idExperiencia: 2, Orden_idOrden: 1, asistentes: 1, subtotal: 120000, fechaProgramada: '2024-10-02' }
    ]
  },
  {
    idOrden: 2,
    Cliente_numeroDocumento: 'PAS-US-55412',
    total: 395000,
    fecha: '2024-10-02',
    Estado_idEstado: 7,
    tipo: 'Restaurante',
    restauranteId: 2,
    mesaId: 4,
    detallesMenu: [
      { ItemMenu_idItem: 8, Orden_idOrden: 2, cantidad: 2, subTotal: 72000 },
      { ItemMenu_idItem: 9, Orden_idOrden: 2, cantidad: 2, subTotal: 116000 }
    ],
    detallesExperiencia: [
      { ExperienciaTuristica_idExperiencia: 4, Orden_idOrden: 2, asistentes: 2, subtotal: 220000, fechaProgramada: '2024-10-03' }
    ]
  },
  {
    idOrden: 3,
    Cliente_numeroDocumento: 'PAS-ES-33190',
    total: 212000,
    fecha: '2024-10-03',
    Estado_idEstado: 7,
    tipo: 'Restaurante',
    restauranteId: 3,
    mesaId: 6,
    detallesMenu: [
      { ItemMenu_idItem: 11, Orden_idOrden: 3, cantidad: 2, subTotal: 84000 },
      { ItemMenu_idItem: 12, Orden_idOrden: 3, cantidad: 2, subTotal: 56000 }
    ],
    detallesExperiencia: [
      { ExperienciaTuristica_idExperiencia: 5, Orden_idOrden: 3, asistentes: 1, subtotal: 70000, fechaProgramada: '2024-10-04' }
    ]
  },
  {
    idOrden: 4,
    Cliente_numeroDocumento: 'PAS-FR-88204',
    total: 338000,
    fecha: '2024-10-04',
    Estado_idEstado: 7,
    tipo: 'Restaurante',
    restauranteId: 4,
    mesaId: 7,
    detallesMenu: [
      { ItemMenu_idItem: 13, Orden_idOrden: 4, cantidad: 2, subTotal: 78000 }
    ],
    detallesExperiencia: [
      { ExperienciaTuristica_idExperiencia: 6, Orden_idOrden: 4, asistentes: 2, subtotal: 260000, fechaProgramada: '2024-10-05' }
    ]
  },
  {
    idOrden: 5,
    Cliente_numeroDocumento: 'PAS-MX-12903',
    total: 203000,
    fecha: '2024-10-05',
    Estado_idEstado: 7,
    tipo: 'Restaurante',
    restauranteId: 5,
    mesaId: 8,
    detallesMenu: [
      { ItemMenu_idItem: 14, Orden_idOrden: 5, cantidad: 2, subTotal: 108000 }
    ],
    detallesExperiencia: [
      { ExperienciaTuristica_idExperiencia: 7, Orden_idOrden: 5, asistentes: 1, subtotal: 95000, fechaProgramada: '2024-10-06' }
    ]
  },
  {
    idOrden: 6,
    Cliente_numeroDocumento: '1094900102',
    total: 226000,
    fecha: '2024-10-06',
    Estado_idEstado: 7,
    tipo: 'Restaurante',
    restauranteId: 6,
    mesaId: 9,
    detallesMenu: [
      { ItemMenu_idItem: 6, Orden_idOrden: 6, cantidad: 2, subTotal: 18000 },
      { ItemMenu_idItem: 15, Orden_idOrden: 6, cantidad: 2, subTotal: 28000 }
    ],
    detallesExperiencia: [
      { ExperienciaTuristica_idExperiencia: 8, Orden_idOrden: 6, asistentes: 2, subtotal: 180000, fechaProgramada: '2024-10-07' }
    ]
  },
  {
    idOrden: 7,
    Cliente_numeroDocumento: '1094900103',
    total: 82000,
    fecha: '2024-10-07',
    Estado_idEstado: 5,
    tipo: 'Domicilio',
    restauranteId: 1,
    direccionEntrega: 'Eco-Hotel Las Palmas, Vereda Boquía, Salento',
    costoDomicilio: 6000,
    detallesMenu: [
      { ItemMenu_idItem: 3, Orden_idOrden: 7, cantidad: 2, subTotal: 76000 }
    ]
  },
  {
    idOrden: 8,
    Cliente_numeroDocumento: 'PAS-US-77821',
    total: 124000,
    fecha: '2024-10-08',
    Estado_idEstado: 5,
    tipo: 'Domicilio',
    restauranteId: 2,
    direccionEntrega: 'Casa Colonial Hotel Boutique, San Diego, Cartagena',
    costoDomicilio: 8000,
    detallesMenu: [
      { ItemMenu_idItem: 9, Orden_idOrden: 8, cantidad: 2, subTotal: 116000 }
    ]
  },
  {
    idOrden: 9,
    Cliente_numeroDocumento: '1094900104',
    total: 89000,
    fecha: '2024-10-09',
    Estado_idEstado: 5,
    tipo: 'Domicilio',
    restauranteId: 3,
    direccionEntrega: 'Cra 43A # 1 Sur-150, El Poblado, Medellín',
    costoDomicilio: 5000,
    detallesMenu: [
      { ItemMenu_idItem: 11, Orden_idOrden: 9, cantidad: 2, subTotal: 84000 }
    ]
  },
  {
    idOrden: 10,
    Cliente_numeroDocumento: 'PAS-AR-44910',
    total: 85000,
    fecha: '2024-10-10',
    Estado_idEstado: 5,
    tipo: 'Domicilio',
    restauranteId: 4,
    direccionEntrega: 'Hotel de la Candelaria, Cl 11 # 3-20, Bogotá',
    costoDomicilio: 7000,
    detallesMenu: [
      { ItemMenu_idItem: 13, Orden_idOrden: 10, cantidad: 2, subTotal: 78000 }
    ]
  },
  {
    idOrden: 11,
    Cliente_numeroDocumento: 'PAS-BR-99012',
    total: 114000,
    fecha: '2024-10-11',
    Estado_idEstado: 5,
    tipo: 'Domicilio',
    restauranteId: 5,
    direccionEntrega: 'Hostal San Antonio, Cra 10 # 2-30, Cali',
    costoDomicilio: 6000,
    detallesMenu: [
      { ItemMenu_idItem: 14, Orden_idOrden: 11, cantidad: 2, subTotal: 108000 }
    ]
  },
  {
    idOrden: 12,
    Cliente_numeroDocumento: '1094900105',
    total: 51000,
    fecha: '2024-10-12',
    Estado_idEstado: 5,
    tipo: 'Domicilio',
    restauranteId: 6,
    direccionEntrega: 'Finca Turística El Edén, Filandia',
    costoDomicilio: 5000,
    detallesMenu: [
      { ItemMenu_idItem: 6, Orden_idOrden: 12, cantidad: 2, subTotal: 18000 },
      { ItemMenu_idItem: 15, Orden_idOrden: 12, cantidad: 2, subTotal: 28000 }
    ]
  }
];

export const INITIAL_RESERVAS: Reserva[] = [
  {
    idReserva: 1,
    fechaReserva: '2026-09-05',
    horaReserva: '13:00',
    cantidadPersonas: 2,
    Cliente_numeroDocumento: '1094900101',
    Restaurante_idRestaurante: 1,
    Estado_idEstado: 2, // Confirmada
    peticionesEspeciales: ['Mesa con vista panorámica', 'Celebración de aniversario']
  },
  {
    idReserva: 2,
    fechaReserva: '2026-09-18',
    horaReserva: '19:30',
    cantidadPersonas: 2,
    Cliente_numeroDocumento: 'PAS-US-55412',
    Restaurante_idRestaurante: 2,
    Estado_idEstado: 2,
    peticionesEspeciales: ['Mesa con vista panorámica']
  },
  {
    idReserva: 3,
    fechaReserva: '2026-10-03',
    horaReserva: '20:00',
    cantidadPersonas: 4,
    Cliente_numeroDocumento: 'PAS-ES-33190',
    Restaurante_idRestaurante: 3,
    Estado_idEstado: 2,
    peticionesEspeciales: ['Decoración de cumpleaños']
  },
  {
    idReserva: 4,
    fechaReserva: '2026-10-10',
    horaReserva: '19:30',
    cantidadPersonas: 1,
    Cliente_numeroDocumento: 'PAS-FR-88204',
    Restaurante_idRestaurante: 4,
    Estado_idEstado: 2,
    peticionesEspeciales: ['Menú sin gluten / celíacos']
  },
  {
    idReserva: 5,
    fechaReserva: '2026-10-20',
    horaReserva: '10:00',
    cantidadPersonas: 2,
    Cliente_numeroDocumento: '1094900102',
    Restaurante_idRestaurante: 6,
    Estado_idEstado: 2,
    peticionesEspeciales: ['Mesa con vista panorámica']
  }
];

export const INITIAL_RESENAS: Resena[] = [
  { idResena: 1, puntuacionComida: 5, puntuacionServicio: 5, comentario: '¡La mejor trucha de Salento! El tour de café con don Hernán fue inolvidable.', fechaPublicacion: '2024-10-02', Restaurante_idRestaurante: 1, Cliente_numeroDocumento: '1094900101' },
  { idResena: 2, puntuacionComida: 4.8, puntuacionServicio: 4.9, comentario: 'Incredible ceviche in Cartagena. The staff spoke fluent English and guided our city walk.', fechaPublicacion: '2024-10-03', Restaurante_idRestaurante: 2, Cliente_numeroDocumento: 'PAS-US-55412' },
  { idResena: 3, puntuacionComida: 4.7, puntuacionServicio: 4.6, comentario: 'Bandeja paisa deliciosa y la cata de cervezas muy amena. Gran ambiente en Medellín.', fechaPublicacion: '2024-10-04', Restaurante_idRestaurante: 3, Cliente_numeroDocumento: 'PAS-ES-33190' },
  { idResena: 4, puntuacionComida: 5, puntuacionServicio: 4.8, comentario: 'Le meilleur ajiaco de Bogotá! Une immersion formidable au marché de Paloquemao.', fechaPublicacion: '2024-10-05', Restaurante_idRestaurante: 4, Cliente_numeroDocumento: 'PAS-FR-88204' },
  { idResena: 5, puntuacionComida: 4.9, puntuacionServicio: 5, comentario: 'La música de marimba en vivo y la cazuela de mariscos tienen un sabor único del Pacífico.', fechaPublicacion: '2024-10-06', Restaurante_idRestaurante: 5, Cliente_numeroDocumento: 'PAS-MX-12903' },
  { idResena: 6, puntuacionComida: 5, puntuacionServicio: 4.9, comentario: 'El café Geisha filtrado en Chemex y la vista panorámica de Filandia son insuperables.', fechaPublicacion: '2024-10-07', Restaurante_idRestaurante: 6, Cliente_numeroDocumento: '1094900102' },
  { idResena: 7, puntuacionComida: 4.5, puntuacionServicio: 4.2, comentario: 'El domicilio llegó caliente hasta nuestro hotel campestre en Salento. Muy buena presentación.', fechaPublicacion: '2024-10-08', Restaurante_idRestaurante: 1, Cliente_numeroDocumento: '1094900103' },
  { idResena: 8, puntuacionComida: 4.8, puntuacionServicio: 4.6, comentario: 'Puntuales con la entrega en el centro amurallado. Los langostinos al coco espectaculares.', fechaPublicacion: '2024-10-09', Restaurante_idRestaurante: 2, Cliente_numeroDocumento: 'PAS-US-77821' },
];

export const INITIAL_PAGOS: Pago[] = [
  { idPago: 1, monedaPago: 'COP', totalPagado: 217000, propina: 20000, fechaPago: '2024-10-01', Orden_idOrden: 1, metodoPagoId: 1 },
  { idPago: 2, monedaPago: 'COP', totalPagado: 395000, propina: 40000, fechaPago: '2024-10-02', Orden_idOrden: 2, metodoPagoId: 2 },
  { idPago: 3, monedaPago: 'COP', totalPagado: 212000, propina: 20000, fechaPago: '2024-10-03', Orden_idOrden: 3, metodoPagoId: 2 },
  { idPago: 4, monedaPago: 'COP', totalPagado: 338000, propina: 35000, fechaPago: '2024-10-04', Orden_idOrden: 4, metodoPagoId: 2 },
  { idPago: 5, monedaPago: 'COP', totalPagado: 203000, propina: 20000, fechaPago: '2024-10-05', Orden_idOrden: 5, metodoPagoId: 1 },
  { idPago: 6, monedaPago: 'COP', totalPagado: 226000, propina: 25000, fechaPago: '2024-10-06', Orden_idOrden: 6, metodoPagoId: 3 },
];
