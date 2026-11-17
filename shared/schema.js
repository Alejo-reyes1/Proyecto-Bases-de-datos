// ARCHIVO GENERADO por scripts/generar-schema.mjs a partir del DDL. No editar a mano.
// Las 30 tablas del modelo relacional con columnas, PK y FK.
export const SCHEMA = {
  "Administrador": {
    "name": "Administrador",
    "columns": [
      {
        "name": "Personal_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "aniosExperiencia",
        "type": "INTEGER",
        "length": null,
        "notNull": false
      }
    ],
    "pk": [
      "Personal_numeroDocumento"
    ],
    "fks": [
      {
        "name": "Administrador_Personal_FK",
        "column": "Personal_numeroDocumento",
        "refTable": "Personal",
        "refColumn": "numeroDocumento"
      }
    ],
    "pkName": "Administrador_PK"
  },
  "CartaMenu": {
    "name": "CartaMenu",
    "columns": [
      {
        "name": "idCategoria",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "nombrecategoria",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      },
      {
        "name": "Restaurante_idRestaurante",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "idCategoria"
    ],
    "fks": [
      {
        "name": "CategoriaMenu_Restaurante_FK",
        "column": "Restaurante_idRestaurante",
        "refTable": "Restaurante",
        "refColumn": "idRestaurante"
      }
    ],
    "pkName": "CategoriaMenu_PK"
  },
  "Chef": {
    "name": "Chef",
    "columns": [
      {
        "name": "Personal_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "especialidad",
        "type": "VARCHAR2",
        "length": 50,
        "notNull": false
      }
    ],
    "pk": [
      "Personal_numeroDocumento"
    ],
    "fks": [
      {
        "name": "Chef_Personal_FK",
        "column": "Personal_numeroDocumento",
        "refTable": "Personal",
        "refColumn": "numeroDocumento"
      }
    ],
    "pkName": "Chef_PK"
  },
  "Ciudad": {
    "name": "Ciudad",
    "columns": [
      {
        "name": "idCiudad",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": true,
        "corrected": true
      },
      {
        "name": "nombre",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      },
      {
        "name": "Departamento_idDepartamento",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": true,
        "corrected": true
      }
    ],
    "pk": [
      "idCiudad"
    ],
    "fks": [
      {
        "name": "Ciudad_Departamento_FK",
        "column": "Departamento_idDepartamento",
        "refTable": "Departamento",
        "refColumn": "idDepartamento"
      }
    ],
    "pkName": "Ciudad_PK"
  },
  "Cliente": {
    "name": "Cliente",
    "columns": [
      {
        "name": "numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "Nombre",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      },
      {
        "name": "apellido",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      },
      {
        "name": "email",
        "type": "VARCHAR2",
        "length": 50,
        "notNull": false
      },
      {
        "name": "telefono",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      },
      {
        "name": "paisOrigen",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      },
      {
        "name": "TipoDocumento_idTipoDocumento",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "numeroDocumento"
    ],
    "fks": [
      {
        "name": "Cliente_TipoDocumento_FK",
        "column": "TipoDocumento_idTipoDocumento",
        "refTable": "TipoDocumento",
        "refColumn": "idTipoDocumento"
      }
    ],
    "pkName": "Cliente_PK"
  },
  "Departamento": {
    "name": "Departamento",
    "columns": [
      {
        "name": "idDepartamento",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": true,
        "corrected": true
      },
      {
        "name": "nombre",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      },
      {
        "name": "Pais_idPais",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": true,
        "corrected": true
      }
    ],
    "pk": [
      "idDepartamento"
    ],
    "fks": [
      {
        "name": "Departamento_Pais_FK",
        "column": "Pais_idPais",
        "refTable": "Pais",
        "refColumn": "idPais"
      }
    ],
    "pkName": "Departamento_PK"
  },
  "DetalleExperienciaOrden": {
    "name": "DetalleExperienciaOrden",
    "columns": [
      {
        "name": "subtotal",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "asistentes",
        "type": "INTEGER",
        "length": null,
        "notNull": false
      },
      {
        "name": "ExperienciaTuristica_idExperiencia",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "Orden_idOrden",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "fechaProgramada",
        "type": "DATE",
        "length": null,
        "notNull": false,
        "format": "YYYY-MM-DD HH24:MI"
      }
    ],
    "pk": [
      "Orden_idOrden",
      "ExperienciaTuristica_idExperiencia"
    ],
    "fks": [
      {
        "name": "DetalleExperienciaOrden_ExperienciaTuristica_FK",
        "column": "ExperienciaTuristica_idExperiencia",
        "refTable": "ExperienciaTuristica",
        "refColumn": "idExperiencia"
      },
      {
        "name": "DetalleExperienciaOrden_Orden_FK",
        "column": "Orden_idOrden",
        "refTable": "Orden",
        "refColumn": "idOrden"
      }
    ],
    "pkName": "DetalleExperienciaOrden_PK"
  },
  "DetalleOrden": {
    "name": "DetalleOrden",
    "columns": [
      {
        "name": "ItemMenu_idItem",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "Orden_idOrden",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "cantidad",
        "type": "INTEGER",
        "length": null,
        "notNull": false
      },
      {
        "name": "subTotal",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      }
    ],
    "pk": [
      "ItemMenu_idItem",
      "Orden_idOrden"
    ],
    "fks": [
      {
        "name": "DetalleOrden_ItemMenu_FK",
        "column": "ItemMenu_idItem",
        "refTable": "ItemMenu",
        "refColumn": "idItem"
      },
      {
        "name": "DetalleOrden_Orden_FK",
        "column": "Orden_idOrden",
        "refTable": "Orden",
        "refColumn": "idOrden"
      }
    ],
    "pkName": "DetalleOrden_PK"
  },
  "Estado": {
    "name": "Estado",
    "columns": [
      {
        "name": "idEstado",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "nombre",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      },
      {
        "name": "descripcion",
        "type": "VARCHAR2",
        "length": 200,
        "notNull": false
      }
    ],
    "pk": [
      "idEstado"
    ],
    "fks": [],
    "pkName": "Estado_PK"
  },
  "ExperienciaTuristica": {
    "name": "ExperienciaTuristica",
    "columns": [
      {
        "name": "idExperiencia",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "nombreExperiencia",
        "type": "VARCHAR2",
        "length": 50,
        "notNull": false
      },
      {
        "name": "descripcion",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      },
      {
        "name": "precioPorPersona",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "duracion",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "Restaurante_idRestaurante",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "idExperiencia"
    ],
    "fks": [
      {
        "name": "ExperienciaTuristica_Restaurante_FK",
        "column": "Restaurante_idRestaurante",
        "refTable": "Restaurante",
        "refColumn": "idRestaurante"
      }
    ],
    "pkName": "ExperienciaTuristica_PK"
  },
  "Idioma": {
    "name": "Idioma",
    "columns": [
      {
        "name": "idIdioma",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "nombreIdioma",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      }
    ],
    "pk": [
      "idIdioma"
    ],
    "fks": [],
    "pkName": "Idioma_PK"
  },
  "ItemMenu": {
    "name": "ItemMenu",
    "columns": [
      {
        "name": "idItem",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "nombrItem",
        "type": "VARCHAR2",
        "length": 50,
        "notNull": false
      },
      {
        "name": "descripcionItem",
        "type": "VARCHAR2",
        "length": 200,
        "notNull": false
      },
      {
        "name": "vegetariano",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "CategoriaMenu_idCategoria",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "precio",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      }
    ],
    "pk": [
      "idItem"
    ],
    "fks": [
      {
        "name": "ItemMenu_CategoriaMenu_FK",
        "column": "CategoriaMenu_idCategoria",
        "refTable": "CartaMenu",
        "refColumn": "idCategoria"
      }
    ],
    "pkName": "ItemMenu_PK"
  },
  "Mesa": {
    "name": "Mesa",
    "columns": [
      {
        "name": "numeroMesa",
        "type": "INTEGER",
        "length": null,
        "notNull": false
      },
      {
        "name": "idMesa",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "capacidad",
        "type": "INTEGER",
        "length": null,
        "notNull": false
      },
      {
        "name": "Restaurante_idRestaurante",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "disponibilidad",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      }
    ],
    "pk": [
      "idMesa"
    ],
    "fks": [
      {
        "name": "Mesa_Restaurante_FK",
        "column": "Restaurante_idRestaurante",
        "refTable": "Restaurante",
        "refColumn": "idRestaurante"
      }
    ],
    "pkName": "Mesa_PK"
  },
  "Mesero": {
    "name": "Mesero",
    "columns": [
      {
        "name": "Personal_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "turno",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      }
    ],
    "pk": [
      "Personal_numeroDocumento"
    ],
    "fks": [
      {
        "name": "Mesero_Personal_FK",
        "column": "Personal_numeroDocumento",
        "refTable": "Personal",
        "refColumn": "numeroDocumento"
      }
    ],
    "pkName": "Mesero_PK"
  },
  "MeseroIdioma": {
    "name": "MeseroIdioma",
    "columns": [
      {
        "name": "Mesero_Personal_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "Idioma_idIdioma",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "Mesero_Personal_numeroDocumento",
      "Idioma_idIdioma"
    ],
    "fks": [
      {
        "name": "MeseroIdioma_Idioma_FK",
        "column": "Idioma_idIdioma",
        "refTable": "Idioma",
        "refColumn": "idIdioma"
      },
      {
        "name": "MeseroIdioma_Mesero_FK",
        "column": "Mesero_Personal_numeroDocumento",
        "refTable": "Mesero",
        "refColumn": "Personal_numeroDocumento"
      }
    ],
    "pkName": "MeseroIdioma_PK"
  },
  "MetodoPago": {
    "name": "MetodoPago",
    "columns": [
      {
        "name": "idMetodoPago",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "nombre",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      }
    ],
    "pk": [
      "idMetodoPago"
    ],
    "fks": [],
    "pkName": "MetodoPago_PK"
  },
  "Orden": {
    "name": "Orden",
    "columns": [
      {
        "name": "idOrden",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "Cliente_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "total",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "fecha",
        "type": "DATE",
        "length": null,
        "notNull": false,
        "format": "YYYY-MM-DD HH24:MI"
      },
      {
        "name": "Estado_idEstado",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "idOrden"
    ],
    "fks": [
      {
        "name": "Orden_Cliente_FK",
        "column": "Cliente_numeroDocumento",
        "refTable": "Cliente",
        "refColumn": "numeroDocumento"
      },
      {
        "name": "Orden_Estado_FK",
        "column": "Estado_idEstado",
        "refTable": "Estado",
        "refColumn": "idEstado"
      }
    ],
    "pkName": "Orden_PK"
  },
  "OrdenDomicilio": {
    "name": "OrdenDomicilio",
    "columns": [
      {
        "name": "direccionEntrega",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      },
      {
        "name": "Orden_idOrden",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "costoDomicilio",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "Repartidor_Personal_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      }
    ],
    "pk": [
      "Orden_idOrden"
    ],
    "fks": [
      {
        "name": "OrdenDelivery_Orden_FK",
        "column": "Orden_idOrden",
        "refTable": "Orden",
        "refColumn": "idOrden"
      },
      {
        "name": "OrdenDelivery_Repartidor_FK",
        "column": "Repartidor_Personal_numeroDocumento",
        "refTable": "Repartidor",
        "refColumn": "Personal_numeroDocumento"
      }
    ],
    "pkName": "OrdenDelivery_PK"
  },
  "OrdenRestaurante": {
    "name": "OrdenRestaurante",
    "columns": [
      {
        "name": "Orden_idOrden",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "Mesero_Personal_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "Mesa_idMesa",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "Orden_idOrden"
    ],
    "fks": [
      {
        "name": "OrdenRestaurante_Mesa_FK",
        "column": "Mesa_idMesa",
        "refTable": "Mesa",
        "refColumn": "idMesa"
      },
      {
        "name": "OrdenRestaurante_Mesero_FK",
        "column": "Mesero_Personal_numeroDocumento",
        "refTable": "Mesero",
        "refColumn": "Personal_numeroDocumento"
      },
      {
        "name": "OrdenRestaurante_Orden_FK",
        "column": "Orden_idOrden",
        "refTable": "Orden",
        "refColumn": "idOrden"
      }
    ],
    "pkName": "OrdenRestaurante_PK"
  },
  "Pago": {
    "name": "Pago",
    "columns": [
      {
        "name": "idPago",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "monedaPago",
        "type": "VARCHAR2",
        "length": 10,
        "notNull": false
      },
      {
        "name": "totalPagado",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "propina",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "fechaPago",
        "type": "DATE",
        "length": null,
        "notNull": false,
        "format": "YYYY-MM-DD HH24:MI"
      },
      {
        "name": "Orden_idOrden",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "idPago"
    ],
    "fks": [
      {
        "name": "Pago_Orden_FK",
        "column": "Orden_idOrden",
        "refTable": "Orden",
        "refColumn": "idOrden"
      }
    ],
    "pkName": "Pago_PK"
  },
  "PagoMetodoPago": {
    "name": "PagoMetodoPago",
    "columns": [
      {
        "name": "Pago_idPago",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "MetodoPago_idMetodoPago",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "Pago_idPago",
      "MetodoPago_idMetodoPago"
    ],
    "fks": [
      {
        "name": "PagoMetodoPago_MetodoPago_FK",
        "column": "MetodoPago_idMetodoPago",
        "refTable": "MetodoPago",
        "refColumn": "idMetodoPago"
      },
      {
        "name": "PagoMetodoPago_Pago_FK",
        "column": "Pago_idPago",
        "refTable": "Pago",
        "refColumn": "idPago"
      }
    ],
    "pkName": "PagoMetodoPago_PK"
  },
  "Pais": {
    "name": "Pais",
    "columns": [
      {
        "name": "idPais",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": true,
        "corrected": true
      },
      {
        "name": "nombre",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      }
    ],
    "pk": [
      "idPais"
    ],
    "fks": [],
    "pkName": "Pais_PK"
  },
  "Personal": {
    "name": "Personal",
    "columns": [
      {
        "name": "numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "Nombre",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      },
      {
        "name": "apellido",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      },
      {
        "name": "telefono",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      },
      {
        "name": "direccion",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      },
      {
        "name": "email",
        "type": "VARCHAR2",
        "length": 50,
        "notNull": false
      },
      {
        "name": "fechaContratacion",
        "type": "DATE",
        "length": null,
        "notNull": false,
        "format": "YYYY-MM-DD"
      },
      {
        "name": "Restaurante_idRestaurante",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "TipoDocumento_idTipoDocumento",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "numeroDocumento"
    ],
    "fks": [
      {
        "name": "Personal_Restaurante_FK",
        "column": "Restaurante_idRestaurante",
        "refTable": "Restaurante",
        "refColumn": "idRestaurante"
      },
      {
        "name": "Personal_TipoDocumento_FK",
        "column": "TipoDocumento_idTipoDocumento",
        "refTable": "TipoDocumento",
        "refColumn": "idTipoDocumento"
      }
    ],
    "pkName": "Personal_PK"
  },
  "PeticionEspecial": {
    "name": "PeticionEspecial",
    "columns": [
      {
        "name": "idPeticion",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "nombre",
        "type": "VARCHAR2",
        "length": 50,
        "notNull": false
      },
      {
        "name": "descripcion",
        "type": "VARCHAR2",
        "length": 200,
        "notNull": false
      }
    ],
    "pk": [
      "idPeticion"
    ],
    "fks": [],
    "pkName": "PeticionEspecial_PK"
  },
  "Repartidor": {
    "name": "Repartidor",
    "columns": [
      {
        "name": "Personal_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "medioTransporte",
        "type": "VARCHAR2",
        "length": 50,
        "notNull": false
      }
    ],
    "pk": [
      "Personal_numeroDocumento"
    ],
    "fks": [
      {
        "name": "Repartidor_Personal_FK",
        "column": "Personal_numeroDocumento",
        "refTable": "Personal",
        "refColumn": "numeroDocumento"
      }
    ],
    "pkName": "Repartidor_PK"
  },
  "Resena": {
    "name": "Resena",
    "columns": [
      {
        "name": "idResena",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "puntuacionComida",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "puntuacionServicio",
        "type": "NUMBER",
        "length": null,
        "notNull": false
      },
      {
        "name": "comentario",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      },
      {
        "name": "fechaPublicacion",
        "type": "DATE",
        "length": null,
        "notNull": false,
        "format": "YYYY-MM-DD"
      },
      {
        "name": "Restaurante_idRestaurante",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "Cliente_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      }
    ],
    "pk": [
      "idResena"
    ],
    "fks": [
      {
        "name": "Resena_Cliente_FK",
        "column": "Cliente_numeroDocumento",
        "refTable": "Cliente",
        "refColumn": "numeroDocumento"
      },
      {
        "name": "Resena_Restaurante_FK",
        "column": "Restaurante_idRestaurante",
        "refTable": "Restaurante",
        "refColumn": "idRestaurante"
      }
    ],
    "pkName": "Resena_PK"
  },
  "Reserva": {
    "name": "Reserva",
    "columns": [
      {
        "name": "idReserva",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "fechaReserva",
        "type": "DATE",
        "length": null,
        "notNull": false,
        "format": "YYYY-MM-DD HH24:MI"
      },
      {
        "name": "cantidadPersonas",
        "type": "INTEGER",
        "length": null,
        "notNull": false
      },
      {
        "name": "Cliente_numeroDocumento",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": true
      },
      {
        "name": "Restaurante_idRestaurante",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "Estado_idEstado",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "idReserva"
    ],
    "fks": [
      {
        "name": "Reserva_Cliente_FK",
        "column": "Cliente_numeroDocumento",
        "refTable": "Cliente",
        "refColumn": "numeroDocumento"
      },
      {
        "name": "Reserva_Estado_FK",
        "column": "Estado_idEstado",
        "refTable": "Estado",
        "refColumn": "idEstado"
      },
      {
        "name": "Reserva_Restaurante_FK",
        "column": "Restaurante_idRestaurante",
        "refTable": "Restaurante",
        "refColumn": "idRestaurante"
      }
    ],
    "pkName": "Reserva_PK"
  },
  "ReservaPeticionesEsp": {
    "name": "ReservaPeticionesEsp",
    "columns": [
      {
        "name": "Reserva_idReserva",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "PeticionEspecial_idPeticion",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      }
    ],
    "pk": [
      "Reserva_idReserva",
      "PeticionEspecial_idPeticion"
    ],
    "fks": [
      {
        "name": "ReservaPeticionesEsp_PeticionEspecial_FK",
        "column": "PeticionEspecial_idPeticion",
        "refTable": "PeticionEspecial",
        "refColumn": "idPeticion"
      },
      {
        "name": "ReservaPeticionesEsp_Reserva_FK",
        "column": "Reserva_idReserva",
        "refTable": "Reserva",
        "refColumn": "idReserva"
      }
    ],
    "pkName": "ReservaPeticionesEsp_PK"
  },
  "Restaurante": {
    "name": "Restaurante",
    "columns": [
      {
        "name": "idRestaurante",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "nit",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": false
      },
      {
        "name": "nombre",
        "type": "VARCHAR2",
        "length": 50,
        "notNull": false
      },
      {
        "name": "direccion",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      },
      {
        "name": "categoriaCocina",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      },
      {
        "name": "horaApertura",
        "type": "DATE",
        "length": null,
        "notNull": false,
        "format": "HH24:MI"
      },
      {
        "name": "horaCierre",
        "type": "DATE",
        "length": null,
        "notNull": false,
        "format": "HH24:MI"
      },
      {
        "name": "Ciudad_idCiudad",
        "type": "VARCHAR2",
        "length": 20,
        "notNull": true,
        "corrected": true
      }
    ],
    "pk": [
      "idRestaurante"
    ],
    "fks": [
      {
        "name": "Restaurante_Ciudad_FK",
        "column": "Ciudad_idCiudad",
        "refTable": "Ciudad",
        "refColumn": "idCiudad"
      }
    ],
    "pkName": "Restaurante_PK"
  },
  "TipoDocumento": {
    "name": "TipoDocumento",
    "columns": [
      {
        "name": "idTipoDocumento",
        "type": "INTEGER",
        "length": null,
        "notNull": true
      },
      {
        "name": "nombre",
        "type": "VARCHAR2",
        "length": 100,
        "notNull": false
      }
    ],
    "pk": [
      "idTipoDocumento"
    ],
    "fks": [],
    "pkName": "TipoDocumento_PK"
  }
};

export const TABLE_NAMES = Object.keys(SCHEMA);
