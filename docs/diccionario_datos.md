### 6.1 Pais

**Finalidad:** Catálogo de países (código ISO 3166-1) para ubicar departamentos y el origen de los clientes. PK: idPais.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idPais | Código ISO del país | VARCHAR2(20) | NOT NULL, UNIQUE (PK) | Sí | No |
| nombre | Nombre | VARCHAR2(100) | Nulo permitido | No | No |

### 6.2 Departamento

**Finalidad:** Subdivisiones de cada país (código ISO 3166-2). PK: idDepartamento.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idDepartamento | Código ISO del departamento | VARCHAR2(20) | NOT NULL, UNIQUE (PK) | Sí | No |
| nombre | Nombre | VARCHAR2(100) | Nulo permitido | No | No |
| Pais_idPais | País al que pertenece | VARCHAR2(20) | NOT NULL | No | Sí → Pais |

### 6.3 Ciudad

**Finalidad:** Ciudades y destinos turísticos donde operan las sedes. PK: idCiudad.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idCiudad | Código de la ciudad (departamento + abreviatura) | VARCHAR2(20) | NOT NULL, UNIQUE (PK) | Sí | No |
| nombre | Nombre | VARCHAR2(100) | Nulo permitido | No | No |
| Departamento_idDepartamento | Departamento al que pertenece | VARCHAR2(20) | NOT NULL | No | Sí → Departamento |

### 6.4 TipoDocumento

**Finalidad:** Tipos de identificación de clientes y personal. PK: idTipoDocumento.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idTipoDocumento | Identificador del tipo de documento | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| nombre | Nombre | VARCHAR2(100) | Nulo permitido | No | No |

### 6.5 Estado

**Finalidad:** Estados del ciclo de vida, compartidos por órdenes y reservas. PK: idEstado.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idEstado | Identificador del estado | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| nombre | Nombre | VARCHAR2(100) | Nulo permitido | No | No |
| descripcion | Descripción | VARCHAR2(200) | Nulo permitido | No | No |

### 6.6 Idioma

**Finalidad:** Idiomas que puede hablar el personal de salón. PK: idIdioma.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idIdioma | Identificador del idioma | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| nombreIdioma | Nombre del idioma | VARCHAR2(20) | Nulo permitido | No | No |

### 6.7 MetodoPago

**Finalidad:** Medios de pago aceptados. PK: idMetodoPago.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idMetodoPago | Identificador del medio de pago | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| nombre | Nombre | VARCHAR2(100) | Nulo permitido | No | No |

### 6.8 PeticionEspecial

**Finalidad:** Catálogo de peticiones que un cliente puede pedir al reservar. PK: idPeticion.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idPeticion | Identificador de la petición | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| nombre | Nombre | VARCHAR2(50) | Nulo permitido | No | No |
| descripcion | Descripción | VARCHAR2(200) | Nulo permitido | No | No |

### 6.9 Restaurante

**Finalidad:** Sedes de la cadena con su ubicación y horario. PK: idRestaurante.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idRestaurante | Identificador de la sede | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| nit | NIT tributario | VARCHAR2(20) | Nulo permitido | No | No |
| nombre | Nombre | VARCHAR2(50) | Nulo permitido | No | No |
| direccion | Dirección | VARCHAR2(100) | Nulo permitido | No | No |
| categoriaCocina | Tipo de cocina | VARCHAR2(100) | Nulo permitido | No | No |
| horaApertura | Hora de apertura | DATE | Nulo permitido | No | No |
| horaCierre | Hora de cierre | DATE | Nulo permitido | No | No |
| Ciudad_idCiudad | Ciudad donde está la sede | VARCHAR2(20) | NOT NULL | No | Sí → Ciudad |

### 6.10 Mesa

**Finalidad:** Mesas físicas de cada sede. PK: idMesa.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| numeroMesa | Número visible de la mesa en la sede | INTEGER | Nulo permitido | No | No |
| idMesa | Identificador de la mesa | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| capacidad | Número de puestos | INTEGER | Nulo permitido | No | No |
| Restaurante_idRestaurante | Sede asociada | INTEGER | NOT NULL | No | Sí → Restaurante |
| disponibilidad | Disponible (1) u ocupada (0) | NUMBER | Nulo permitido | No | No |

### 6.11 CartaMenu

**Finalidad:** Categorías de la carta de cada sede. PK: idCategoria.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idCategoria | Identificador de la categoría | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| nombrecategoria | Nombre de la categoría | VARCHAR2(20) | Nulo permitido | No | No |
| Restaurante_idRestaurante | Sede asociada | INTEGER | NOT NULL | No | Sí → Restaurante |

### 6.12 ItemMenu

**Finalidad:** Platos y bebidas de la carta con su precio. PK: idItem.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idItem | Identificador del plato | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| nombrItem | Nombre del plato o bebida | VARCHAR2(50) | Nulo permitido | No | No |
| descripcionItem | Descripción del plato | VARCHAR2(200) | Nulo permitido | No | No |
| vegetariano | Apto vegetariano (1) o no (0) | NUMBER | Nulo permitido | No | No |
| CategoriaMenu_idCategoria | Categoría de la carta | INTEGER | NOT NULL | No | Sí → CartaMenu |
| precio | Precio en COP | NUMBER | Nulo permitido | No | No |

### 6.13 ExperienciaTuristica

**Finalidad:** Tours, catas y talleres que ofrece cada sede, cobrados por persona. PK: idExperiencia.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idExperiencia | Identificador de la experiencia | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| nombreExperiencia | Nombre de la experiencia | VARCHAR2(50) | Nulo permitido | No | No |
| descripcion | Descripción | VARCHAR2(100) | Nulo permitido | No | No |
| precioPorPersona | Tarifa por persona en COP | NUMBER | Nulo permitido | No | No |
| duracion | Duración en horas | NUMBER | Nulo permitido | No | No |
| Restaurante_idRestaurante | Sede asociada | INTEGER | NOT NULL | No | Sí → Restaurante |

### 6.14 Cliente

**Finalidad:** Turistas y comensales nacionales o extranjeros. PK: numeroDocumento.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| numeroDocumento | Número de documento (llave natural) | VARCHAR2(100) | NOT NULL, UNIQUE (PK) | Sí | No |
| Nombre | Nombre(s) | VARCHAR2(20) | Nulo permitido | No | No |
| apellido | Apellido(s) | VARCHAR2(20) | Nulo permitido | No | No |
| email | Correo electrónico | VARCHAR2(50) | Nulo permitido | No | No |
| telefono | Teléfono con indicativo | VARCHAR2(20) | Nulo permitido | No | No |
| paisOrigen | Código ISO del país de origen | VARCHAR2(20) | Nulo permitido | No | No |
| TipoDocumento_idTipoDocumento | Tipo de documento | INTEGER | NOT NULL | No | Sí → TipoDocumento |

### 6.15 Personal

**Finalidad:** Colaboradores de las sedes (supertipo de Administrador, Chef, Mesero y Repartidor). PK: numeroDocumento.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| numeroDocumento | Número de documento (llave natural) | VARCHAR2(100) | NOT NULL, UNIQUE (PK) | Sí | No |
| Nombre | Nombre(s) | VARCHAR2(20) | Nulo permitido | No | No |
| apellido | Apellido(s) | VARCHAR2(20) | Nulo permitido | No | No |
| telefono | Teléfono con indicativo | VARCHAR2(20) | Nulo permitido | No | No |
| direccion | Dirección | VARCHAR2(100) | Nulo permitido | No | No |
| email | Correo electrónico | VARCHAR2(50) | Nulo permitido | No | No |
| fechaContratacion | Fecha de ingreso | DATE | Nulo permitido | No | No |
| Restaurante_idRestaurante | Sede asociada | INTEGER | NOT NULL | No | Sí → Restaurante |
| TipoDocumento_idTipoDocumento | Tipo de documento | INTEGER | NOT NULL | No | Sí → TipoDocumento |

### 6.16 Administrador

**Finalidad:** Subtipo de Personal que administra una sede. PK: Personal_numeroDocumento.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| Personal_numeroDocumento | Documento del colaborador (hereda de Personal) | VARCHAR2(100) | NOT NULL, UNIQUE (PK) | Sí | Sí → Personal |
| aniosExperiencia | Años de experiencia | INTEGER | Nulo permitido | No | No |

### 6.17 Chef

**Finalidad:** Subtipo de Personal a cargo de la cocina. PK: Personal_numeroDocumento.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| Personal_numeroDocumento | Documento del colaborador (hereda de Personal) | VARCHAR2(100) | NOT NULL, UNIQUE (PK) | Sí | Sí → Personal |
| especialidad | Especialidad culinaria | VARCHAR2(50) | Nulo permitido | No | No |

### 6.18 Mesero

**Finalidad:** Subtipo de Personal que atiende las mesas. PK: Personal_numeroDocumento.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| Personal_numeroDocumento | Documento del colaborador (hereda de Personal) | VARCHAR2(100) | NOT NULL, UNIQUE (PK) | Sí | Sí → Personal |
| turno | Turno de trabajo | VARCHAR2(20) | Nulo permitido | No | No |

### 6.19 Repartidor

**Finalidad:** Subtipo de Personal que entrega domicilios. PK: Personal_numeroDocumento.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| Personal_numeroDocumento | Documento del colaborador (hereda de Personal) | VARCHAR2(100) | NOT NULL, UNIQUE (PK) | Sí | Sí → Personal |
| medioTransporte | Vehículo de reparto | VARCHAR2(50) | Nulo permitido | No | No |

### 6.20 MeseroIdioma

**Finalidad:** Relación N:M entre meseros e idiomas que hablan. PK: Mesero_Personal_numeroDocumento + Idioma_idIdioma.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| Mesero_Personal_numeroDocumento | Mesero | VARCHAR2(100) | NOT NULL | Sí | Sí → Mesero |
| Idioma_idIdioma | Idioma | INTEGER | NOT NULL | Sí | Sí → Idioma |

### 6.21 Orden

**Finalidad:** Transacción principal: pedido de un cliente (supertipo de OrdenRestaurante y OrdenDomicilio). PK: idOrden.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idOrden | Identificador de la orden | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| Cliente_numeroDocumento | Cliente | VARCHAR2(100) | NOT NULL | No | Sí → Cliente |
| total | Total de la orden en COP (detalles + domicilio) | NUMBER | Nulo permitido | No | No |
| fecha | Fecha y hora de la orden | DATE | Nulo permitido | No | No |
| Estado_idEstado | Estado actual | INTEGER | NOT NULL | No | Sí → Estado |

### 6.22 OrdenRestaurante

**Finalidad:** Subtipo de Orden consumida en salón, con mesa y mesero. PK: Orden_idOrden.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| Orden_idOrden | Orden asociada | INTEGER | NOT NULL, UNIQUE (PK) | Sí | Sí → Orden |
| Mesero_Personal_numeroDocumento | Mesero | VARCHAR2(100) | NOT NULL | No | Sí → Mesero |
| Mesa_idMesa | Mesa que atendió la orden | INTEGER | NOT NULL | No | Sí → Mesa |

### 6.23 OrdenDomicilio

**Finalidad:** Subtipo de Orden entregada a domicilio. PK: Orden_idOrden.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| direccionEntrega | Dirección de entrega | VARCHAR2(100) | Nulo permitido | No | No |
| Orden_idOrden | Orden asociada | INTEGER | NOT NULL, UNIQUE (PK) | Sí | Sí → Orden |
| costoDomicilio | Costo del envío en COP | NUMBER | Nulo permitido | No | No |
| Repartidor_Personal_numeroDocumento | Repartidor asignado | VARCHAR2(100) | NOT NULL | No | Sí → Repartidor |

### 6.24 DetalleOrden

**Finalidad:** Líneas de platos de cada orden (N:M Orden–ItemMenu). PK: ItemMenu_idItem + Orden_idOrden.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| ItemMenu_idItem | Plato pedido | INTEGER | NOT NULL | Sí | Sí → ItemMenu |
| Orden_idOrden | Orden asociada | INTEGER | NOT NULL | Sí | Sí → Orden |
| cantidad | Unidades pedidas | INTEGER | Nulo permitido | No | No |
| subTotal | precio × cantidad | NUMBER | Nulo permitido | No | No |

### 6.25 DetalleExperienciaOrden

**Finalidad:** Cupos de experiencias comprados en cada orden (N:M Orden–ExperienciaTuristica). PK: Orden_idOrden + ExperienciaTuristica_idExperiencia.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| subtotal | precioPorPersona × asistentes | NUMBER | Nulo permitido | No | No |
| asistentes | Número de personas | INTEGER | Nulo permitido | No | No |
| ExperienciaTuristica_idExperiencia | Experiencia comprada | INTEGER | NOT NULL | Sí | Sí → ExperienciaTuristica |
| Orden_idOrden | Orden asociada | INTEGER | NOT NULL | Sí | Sí → Orden |
| fechaProgramada | Fecha y hora de la experiencia | DATE | Nulo permitido | No | No |

### 6.26 Reserva

**Finalidad:** Reserva de mesa de un cliente en una sede. PK: idReserva.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idReserva | Identificador de la reserva | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| fechaReserva | Fecha y hora reservadas | DATE | Nulo permitido | No | No |
| cantidadPersonas | Número de comensales | INTEGER | Nulo permitido | No | No |
| Cliente_numeroDocumento | Cliente | VARCHAR2(100) | NOT NULL | No | Sí → Cliente |
| Restaurante_idRestaurante | Sede asociada | INTEGER | NOT NULL | No | Sí → Restaurante |
| Estado_idEstado | Estado actual | INTEGER | NOT NULL | No | Sí → Estado |

### 6.27 ReservaPeticionesEsp

**Finalidad:** Peticiones especiales de cada reserva (N:M). PK: Reserva_idReserva + PeticionEspecial_idPeticion.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| Reserva_idReserva | Reserva | INTEGER | NOT NULL | Sí | Sí → Reserva |
| PeticionEspecial_idPeticion | Petición solicitada | INTEGER | NOT NULL | Sí | Sí → PeticionEspecial |

### 6.28 Pago

**Finalidad:** Pago registrado sobre una orden. PK: idPago.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idPago | Identificador del pago | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| monedaPago | Moneda (COP, USD, EUR) | VARCHAR2(10) | Nulo permitido | No | No |
| totalPagado | Valor pagado de la orden | NUMBER | Nulo permitido | No | No |
| propina | Propina voluntaria | NUMBER | Nulo permitido | No | No |
| fechaPago | Fecha y hora del pago | DATE | Nulo permitido | No | No |
| Orden_idOrden | Orden asociada | INTEGER | NOT NULL | No | Sí → Orden |

### 6.29 PagoMetodoPago

**Finalidad:** Medios usados en cada pago (N:M; permite pagos mixtos). PK: Pago_idPago + MetodoPago_idMetodoPago.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| Pago_idPago | Pago | INTEGER | NOT NULL | Sí | Sí → Pago |
| MetodoPago_idMetodoPago | Medio de pago usado | INTEGER | NOT NULL | Sí | Sí → MetodoPago |

### 6.30 Resena

**Finalidad:** Calificación y comentario de un cliente sobre una sede. PK: idResena.

| Atributo | Finalidad | Tipo | Restricciones | PK | FK (referencia) |
| --- | --- | --- | --- | --- | --- |
| idResena | Identificador de la reseña | INTEGER | NOT NULL, UNIQUE (PK) | Sí | No |
| puntuacionComida | Nota de la comida (1 a 5) | NUMBER | Nulo permitido | No | No |
| puntuacionServicio | Nota del servicio (1 a 5) | NUMBER | Nulo permitido | No | No |
| comentario | Comentario del cliente | VARCHAR2(100) | Nulo permitido | No | No |
| fechaPublicacion | Fecha de publicación | DATE | Nulo permitido | No | No |
| Restaurante_idRestaurante | Sede asociada | INTEGER | NOT NULL | No | Sí → Restaurante |
| Cliente_numeroDocumento | Cliente | VARCHAR2(100) | NOT NULL | No | Sí → Cliente |
