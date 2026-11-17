// ARCHIVO GENERADO por scripts/generar-seed.mjs desde context/datos_prueba_restaurantes_1.sql
// No editar a mano: modifique el DML y ejecute `npm run seed`.
import type { Dataset } from '../types';

export const SEED_DATASET: Dataset = {
  "paises": [
    {
      "idPais": "CO",
      "nombre": "Colombia"
    },
    {
      "idPais": "AR",
      "nombre": "Argentina"
    },
    {
      "idPais": "ES",
      "nombre": "España"
    },
    {
      "idPais": "MX",
      "nombre": "México"
    },
    {
      "idPais": "PE",
      "nombre": "Perú"
    },
    {
      "idPais": "US",
      "nombre": "Estados Unidos"
    },
    {
      "idPais": "FR",
      "nombre": "Francia"
    },
    {
      "idPais": "BR",
      "nombre": "Brasil"
    }
  ],
  "departamentos": [
    {
      "idDepartamento": "CO-ANT",
      "nombre": "Antioquia",
      "Pais_idPais": "CO"
    },
    {
      "idDepartamento": "CO-DC",
      "nombre": "Bogotá D.C.",
      "Pais_idPais": "CO"
    },
    {
      "idDepartamento": "CO-QUI",
      "nombre": "Quindío",
      "Pais_idPais": "CO"
    },
    {
      "idDepartamento": "CO-VAC",
      "nombre": "Valle del Cauca",
      "Pais_idPais": "CO"
    },
    {
      "idDepartamento": "CO-BOL",
      "nombre": "Bolívar",
      "Pais_idPais": "CO"
    },
    {
      "idDepartamento": "CO-CAL",
      "nombre": "Caldas",
      "Pais_idPais": "CO"
    },
    {
      "idDepartamento": "CO-RIS",
      "nombre": "Risaralda",
      "Pais_idPais": "CO"
    },
    {
      "idDepartamento": "AR-C",
      "nombre": "Ciudad Autónoma de Buenos Aires",
      "Pais_idPais": "AR"
    },
    {
      "idDepartamento": "AR-X",
      "nombre": "Córdoba",
      "Pais_idPais": "AR"
    },
    {
      "idDepartamento": "ES-MD",
      "nombre": "Comunidad de Madrid",
      "Pais_idPais": "ES"
    },
    {
      "idDepartamento": "ES-CT",
      "nombre": "Cataluña",
      "Pais_idPais": "ES"
    },
    {
      "idDepartamento": "MX-CMX",
      "nombre": "Ciudad de México",
      "Pais_idPais": "MX"
    },
    {
      "idDepartamento": "MX-JAL",
      "nombre": "Jalisco",
      "Pais_idPais": "MX"
    },
    {
      "idDepartamento": "PE-LIM",
      "nombre": "Lima",
      "Pais_idPais": "PE"
    },
    {
      "idDepartamento": "US-NY",
      "nombre": "Nueva York",
      "Pais_idPais": "US"
    },
    {
      "idDepartamento": "US-FL",
      "nombre": "Florida",
      "Pais_idPais": "US"
    },
    {
      "idDepartamento": "FR-IDF",
      "nombre": "Isla de Francia",
      "Pais_idPais": "FR"
    },
    {
      "idDepartamento": "BR-RJ",
      "nombre": "Río de Janeiro",
      "Pais_idPais": "BR"
    }
  ],
  "ciudades": [
    {
      "idCiudad": "CO-ANT-MED",
      "nombre": "Medellín",
      "Departamento_idDepartamento": "CO-ANT"
    },
    {
      "idCiudad": "CO-ANT-RNG",
      "nombre": "Rionegro",
      "Departamento_idDepartamento": "CO-ANT"
    },
    {
      "idCiudad": "CO-ANT-JAR",
      "nombre": "Jardín",
      "Departamento_idDepartamento": "CO-ANT"
    },
    {
      "idCiudad": "CO-DC-BOG",
      "nombre": "Bogotá",
      "Departamento_idDepartamento": "CO-DC"
    },
    {
      "idCiudad": "CO-QUI-ARM",
      "nombre": "Armenia",
      "Departamento_idDepartamento": "CO-QUI"
    },
    {
      "idCiudad": "CO-QUI-SAL",
      "nombre": "Salento",
      "Departamento_idDepartamento": "CO-QUI"
    },
    {
      "idCiudad": "CO-QUI-FIL",
      "nombre": "Filandia",
      "Departamento_idDepartamento": "CO-QUI"
    },
    {
      "idCiudad": "CO-VAC-CAL",
      "nombre": "Cali",
      "Departamento_idDepartamento": "CO-VAC"
    },
    {
      "idCiudad": "CO-VAC-PAL",
      "nombre": "Palmira",
      "Departamento_idDepartamento": "CO-VAC"
    },
    {
      "idCiudad": "CO-BOL-CTG",
      "nombre": "Cartagena de Indias",
      "Departamento_idDepartamento": "CO-BOL"
    },
    {
      "idCiudad": "CO-CAL-MAN",
      "nombre": "Manizales",
      "Departamento_idDepartamento": "CO-CAL"
    },
    {
      "idCiudad": "CO-RIS-PEI",
      "nombre": "Pereira",
      "Departamento_idDepartamento": "CO-RIS"
    },
    {
      "idCiudad": "AR-C-BUE",
      "nombre": "Buenos Aires",
      "Departamento_idDepartamento": "AR-C"
    },
    {
      "idCiudad": "AR-X-COR",
      "nombre": "Córdoba",
      "Departamento_idDepartamento": "AR-X"
    },
    {
      "idCiudad": "ES-MD-MAD",
      "nombre": "Madrid",
      "Departamento_idDepartamento": "ES-MD"
    },
    {
      "idCiudad": "ES-CT-BCN",
      "nombre": "Barcelona",
      "Departamento_idDepartamento": "ES-CT"
    },
    {
      "idCiudad": "MX-CMX-CDM",
      "nombre": "Ciudad de México",
      "Departamento_idDepartamento": "MX-CMX"
    },
    {
      "idCiudad": "MX-JAL-GDL",
      "nombre": "Guadalajara",
      "Departamento_idDepartamento": "MX-JAL"
    },
    {
      "idCiudad": "PE-LIM-LIM",
      "nombre": "Lima",
      "Departamento_idDepartamento": "PE-LIM"
    },
    {
      "idCiudad": "US-NY-NYC",
      "nombre": "Nueva York",
      "Departamento_idDepartamento": "US-NY"
    },
    {
      "idCiudad": "US-FL-MIA",
      "nombre": "Miami",
      "Departamento_idDepartamento": "US-FL"
    },
    {
      "idCiudad": "FR-IDF-PAR",
      "nombre": "París",
      "Departamento_idDepartamento": "FR-IDF"
    },
    {
      "idCiudad": "BR-RJ-RIO",
      "nombre": "Río de Janeiro",
      "Departamento_idDepartamento": "BR-RJ"
    }
  ],
  "tiposDocumento": [
    {
      "idTipoDocumento": 1,
      "nombre": "Cédula de ciudadanía"
    },
    {
      "idTipoDocumento": 2,
      "nombre": "Cédula de extranjería"
    },
    {
      "idTipoDocumento": 3,
      "nombre": "Pasaporte"
    },
    {
      "idTipoDocumento": 4,
      "nombre": "Tarjeta de identidad"
    },
    {
      "idTipoDocumento": 5,
      "nombre": "Permiso por Protección Temporal"
    }
  ],
  "estados": [
    {
      "idEstado": 1,
      "nombre": "Pendiente",
      "descripcion": "Registrada, aún no confirmada ni en proceso"
    },
    {
      "idEstado": 2,
      "nombre": "Confirmada",
      "descripcion": "Reserva confirmada por el restaurante"
    },
    {
      "idEstado": 3,
      "nombre": "En preparación",
      "descripcion": "La cocina está preparando la orden"
    },
    {
      "idEstado": 4,
      "nombre": "En camino",
      "descripcion": "El domicilio salió hacia el cliente"
    },
    {
      "idEstado": 5,
      "nombre": "Entregada",
      "descripcion": "Domicilio entregado al cliente"
    },
    {
      "idEstado": 6,
      "nombre": "Completada",
      "descripcion": "Orden servida y pagada, o reserva cumplida"
    },
    {
      "idEstado": 7,
      "nombre": "Cancelada",
      "descripcion": "Cancelada por el cliente o el restaurante"
    },
    {
      "idEstado": 8,
      "nombre": "No asistió",
      "descripcion": "El cliente no se presentó a la reserva"
    }
  ],
  "idiomas": [
    {
      "idIdioma": 1,
      "nombreIdioma": "Español"
    },
    {
      "idIdioma": 2,
      "nombreIdioma": "Inglés"
    },
    {
      "idIdioma": 3,
      "nombreIdioma": "Francés"
    },
    {
      "idIdioma": 4,
      "nombreIdioma": "Portugués"
    },
    {
      "idIdioma": 5,
      "nombreIdioma": "Alemán"
    },
    {
      "idIdioma": 6,
      "nombreIdioma": "Italiano"
    }
  ],
  "metodosPago": [
    {
      "idMetodoPago": 1,
      "nombre": "Efectivo"
    },
    {
      "idMetodoPago": 2,
      "nombre": "Tarjeta de crédito"
    },
    {
      "idMetodoPago": 3,
      "nombre": "Tarjeta débito"
    },
    {
      "idMetodoPago": 4,
      "nombre": "Nequi"
    },
    {
      "idMetodoPago": 5,
      "nombre": "Transferencia bancaria"
    }
  ],
  "peticionesEspeciales": [
    {
      "idPeticion": 1,
      "nombre": "Silla para bebé",
      "descripcion": "Silla alta para niños pequeños"
    },
    {
      "idPeticion": 2,
      "nombre": "Decoración de cumpleaños",
      "descripcion": "Globos y postre con vela para el homenajeado"
    },
    {
      "idPeticion": 3,
      "nombre": "Mesa con vista",
      "descripcion": "Ubicación en terraza o junto a la ventana"
    },
    {
      "idPeticion": 4,
      "nombre": "Menú sin gluten",
      "descripcion": "Preparaciones aptas para celíacos"
    },
    {
      "idPeticion": 5,
      "nombre": "Acceso para silla de ruedas",
      "descripcion": "Mesa accesible y sin escalones"
    },
    {
      "idPeticion": 6,
      "nombre": "Celebración de aniversario",
      "descripcion": "Ambientación romántica y brindis de cortesía"
    }
  ],
  "restaurantes": [
    {
      "idRestaurante": 1,
      "nit": "900123451-1",
      "nombre": "El Fogón Cafetero",
      "direccion": "Calle Real # 6-15",
      "categoriaCocina": "Típica cafetera",
      "horaApertura": "07:00",
      "horaCierre": "21:00",
      "Ciudad_idCiudad": "CO-QUI-SAL"
    },
    {
      "idRestaurante": 2,
      "nit": "900123452-2",
      "nombre": "Mar y Murallas",
      "direccion": "Calle del Arsenal # 9-40",
      "categoriaCocina": "Caribeña y mariscos",
      "horaApertura": "12:00",
      "horaCierre": "23:00",
      "Ciudad_idCiudad": "CO-BOL-CTG"
    },
    {
      "idRestaurante": 3,
      "nit": "900123453-3",
      "nombre": "Sabores de la Montaña",
      "direccion": "Carrera 70 # 44-21",
      "categoriaCocina": "Antioqueña tradicional",
      "horaApertura": "11:00",
      "horaCierre": "22:00",
      "Ciudad_idCiudad": "CO-ANT-MED"
    },
    {
      "idRestaurante": 4,
      "nit": "900123454-4",
      "nombre": "La Cosecha Andina",
      "direccion": "Carrera 4 # 12-35",
      "categoriaCocina": "Contemporánea colombiana",
      "horaApertura": "12:00",
      "horaCierre": "23:00",
      "Ciudad_idCiudad": "CO-DC-BOG"
    },
    {
      "idRestaurante": 5,
      "nit": "900123455-5",
      "nombre": "Raíces del Pacífico",
      "direccion": "Calle 3 Oeste # 2-60",
      "categoriaCocina": "Pacífica colombiana",
      "horaApertura": "12:00",
      "horaCierre": "22:00",
      "Ciudad_idCiudad": "CO-VAC-CAL"
    },
    {
      "idRestaurante": 6,
      "nit": "900123456-6",
      "nombre": "Mirador del Café",
      "direccion": "Carrera 6 # 7-30",
      "categoriaCocina": "Cafés de especialidad y postres",
      "horaApertura": "08:00",
      "horaCierre": "20:00",
      "Ciudad_idCiudad": "CO-QUI-FIL"
    }
  ],
  "clientes": [
    {
      "numeroDocumento": "1094950001",
      "Nombre": "Santiago",
      "apellido": "Ríos",
      "email": "santiago.rios@gmail.com",
      "telefono": "+57 3104567801",
      "paisOrigen": "CO",
      "TipoDocumento_idTipoDocumento": 1
    },
    {
      "numeroDocumento": "1032450002",
      "Nombre": "Daniela",
      "apellido": "Torres",
      "email": "daniela.torres@hotmail.com",
      "telefono": "+57 3157894502",
      "paisOrigen": "CO",
      "TipoDocumento_idTipoDocumento": 1
    },
    {
      "numeroDocumento": "549871236",
      "Nombre": "John",
      "apellido": "Smith",
      "email": "john.smith@gmail.com",
      "telefono": "+1 2125550103",
      "paisOrigen": "US",
      "TipoDocumento_idTipoDocumento": 3
    },
    {
      "numeroDocumento": "587412369",
      "Nombre": "Emma",
      "apellido": "Johnson",
      "email": "emma.johnson@yahoo.com",
      "telefono": "+1 3055550104",
      "paisOrigen": "US",
      "TipoDocumento_idTipoDocumento": 3
    },
    {
      "numeroDocumento": "PAB458712",
      "Nombre": "Lucía",
      "apellido": "Fernández",
      "email": "lucia.fernandez@gmail.com",
      "telefono": "+34 612345105",
      "paisOrigen": "ES",
      "TipoDocumento_idTipoDocumento": 3
    },
    {
      "numeroDocumento": "AAE987654",
      "Nombre": "Martín",
      "apellido": "González",
      "email": "martin.gonzalez@gmail.com",
      "telefono": "+54 91145670106",
      "paisOrigen": "AR",
      "TipoDocumento_idTipoDocumento": 3
    },
    {
      "numeroDocumento": "18AB45879",
      "Nombre": "Camille",
      "apellido": "Dubois",
      "email": "camille.dubois@orange.fr",
      "telefono": "+33 612340107",
      "paisOrigen": "FR",
      "TipoDocumento_idTipoDocumento": 3
    },
    {
      "numeroDocumento": "G45871236",
      "Nombre": "Diego",
      "apellido": "Hernández",
      "email": "diego.hernandez@gmail.com",
      "telefono": "+52 5512340108",
      "paisOrigen": "MX",
      "TipoDocumento_idTipoDocumento": 3
    },
    {
      "numeroDocumento": "FZ458712",
      "Nombre": "Ana",
      "apellido": "Souza",
      "email": "ana.souza@gmail.com",
      "telefono": "+55 21987650109",
      "paisOrigen": "BR",
      "TipoDocumento_idTipoDocumento": 3
    },
    {
      "numeroDocumento": "1144880010",
      "Nombre": "Andrea",
      "apellido": "Valencia",
      "email": "andrea.valencia@gmail.com",
      "telefono": "+57 3012345010",
      "paisOrigen": "CO",
      "TipoDocumento_idTipoDocumento": 1
    },
    {
      "numeroDocumento": "1017880011",
      "Nombre": "Felipe",
      "apellido": "Moreno",
      "email": "felipe.moreno@outlook.com",
      "telefono": "+57 3204567011",
      "paisOrigen": "CO",
      "TipoDocumento_idTipoDocumento": 1
    },
    {
      "numeroDocumento": "CE987452",
      "Nombre": "Sofía",
      "apellido": "Quispe",
      "email": "sofia.quispe@gmail.com",
      "telefono": "+57 3187654012",
      "paisOrigen": "PE",
      "TipoDocumento_idTipoDocumento": 2
    },
    {
      "numeroDocumento": "PE4587123",
      "Nombre": "Carlos",
      "apellido": "Mendoza",
      "email": "carlos.mendoza@gmail.com",
      "telefono": "+51 987650113",
      "paisOrigen": "PE",
      "TipoDocumento_idTipoDocumento": 3
    },
    {
      "numeroDocumento": "1094880014",
      "Nombre": "Juliana",
      "apellido": "Cárdenas",
      "email": "juliana.cardenas@gmail.com",
      "telefono": "+57 3112345014",
      "paisOrigen": "CO",
      "TipoDocumento_idTipoDocumento": 1
    },
    {
      "numeroDocumento": "585471239",
      "Nombre": "Michael",
      "apellido": "Brown",
      "email": "michael.brown@gmail.com",
      "telefono": "+1 4155550115",
      "paisOrigen": "US",
      "TipoDocumento_idTipoDocumento": 3
    }
  ],
  "experiencias": [
    {
      "idExperiencia": 1,
      "nombreExperiencia": "Tour de café y cata",
      "descripcion": "Recorrido por finca cafetera con cata de tres variedades",
      "precioPorPersona": 85000,
      "duracion": 3,
      "Restaurante_idRestaurante": 1
    },
    {
      "idExperiencia": 2,
      "nombreExperiencia": "Clase de cocina cafetera",
      "descripcion": "Aprende a preparar trucha y patacón con el chef",
      "precioPorPersona": 120000,
      "duracion": 2.5,
      "Restaurante_idRestaurante": 1
    },
    {
      "idExperiencia": 3,
      "nombreExperiencia": "Taller de cocina caribeña",
      "descripcion": "Preparación de ceviche y arroz de coco",
      "precioPorPersona": 150000,
      "duracion": 3,
      "Restaurante_idRestaurante": 2
    },
    {
      "idExperiencia": 4,
      "nombreExperiencia": "Ruta gastronómica amurallada",
      "descripcion": "Caminata por el centro histórico probando comida local",
      "precioPorPersona": 110000,
      "duracion": 2,
      "Restaurante_idRestaurante": 2
    },
    {
      "idExperiencia": 5,
      "nombreExperiencia": "Cata de cervezas artesanales",
      "descripcion": "Degustación guiada de cinco cervezas antioqueñas",
      "precioPorPersona": 70000,
      "duracion": 1.5,
      "Restaurante_idRestaurante": 3
    },
    {
      "idExperiencia": 6,
      "nombreExperiencia": "Mercado y cocina bogotana",
      "descripcion": "Visita a plaza de mercado y clase de ajiaco",
      "precioPorPersona": 130000,
      "duracion": 4,
      "Restaurante_idRestaurante": 4
    },
    {
      "idExperiencia": 7,
      "nombreExperiencia": "Noche de sabores del Pacífico",
      "descripcion": "Cena maridada con música de marimba en vivo",
      "precioPorPersona": 95000,
      "duracion": 2,
      "Restaurante_idRestaurante": 5
    },
    {
      "idExperiencia": 8,
      "nombreExperiencia": "Barismo para principiantes",
      "descripcion": "Taller de métodos de filtrado y arte latte",
      "precioPorPersona": 90000,
      "duracion": 2,
      "Restaurante_idRestaurante": 6
    }
  ],
  "cartasMenu": [
    {
      "idCategoria": 1,
      "nombrecategoria": "Entradas",
      "Restaurante_idRestaurante": 1
    },
    {
      "idCategoria": 2,
      "nombrecategoria": "Platos fuertes",
      "Restaurante_idRestaurante": 1
    },
    {
      "idCategoria": 3,
      "nombrecategoria": "Bebidas",
      "Restaurante_idRestaurante": 1
    },
    {
      "idCategoria": 4,
      "nombrecategoria": "Entradas",
      "Restaurante_idRestaurante": 2
    },
    {
      "idCategoria": 5,
      "nombrecategoria": "Mariscos",
      "Restaurante_idRestaurante": 2
    },
    {
      "idCategoria": 6,
      "nombrecategoria": "Bebidas",
      "Restaurante_idRestaurante": 2
    },
    {
      "idCategoria": 7,
      "nombrecategoria": "Platos típicos",
      "Restaurante_idRestaurante": 3
    },
    {
      "idCategoria": 8,
      "nombrecategoria": "Postres",
      "Restaurante_idRestaurante": 3
    },
    {
      "idCategoria": 9,
      "nombrecategoria": "Bebidas",
      "Restaurante_idRestaurante": 3
    },
    {
      "idCategoria": 10,
      "nombrecategoria": "Entradas",
      "Restaurante_idRestaurante": 4
    },
    {
      "idCategoria": 11,
      "nombrecategoria": "Platos fuertes",
      "Restaurante_idRestaurante": 4
    },
    {
      "idCategoria": 12,
      "nombrecategoria": "Postres",
      "Restaurante_idRestaurante": 4
    },
    {
      "idCategoria": 13,
      "nombrecategoria": "Platos fuertes",
      "Restaurante_idRestaurante": 5
    },
    {
      "idCategoria": 14,
      "nombrecategoria": "Bebidas",
      "Restaurante_idRestaurante": 5
    },
    {
      "idCategoria": 15,
      "nombrecategoria": "Cafés especiales",
      "Restaurante_idRestaurante": 6
    },
    {
      "idCategoria": 16,
      "nombrecategoria": "Postres",
      "Restaurante_idRestaurante": 6
    }
  ],
  "itemsMenu": [
    {
      "idItem": 1,
      "nombrItem": "Patacón con hogao",
      "descripcionItem": "Plátano verde frito con salsa de tomate y cebolla",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 1,
      "precio": 12000
    },
    {
      "idItem": 2,
      "nombrItem": "Empanadas de pipián",
      "descripcionItem": "Empanadas de papa y maní con ají casero",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 1,
      "precio": 10000
    },
    {
      "idItem": 3,
      "nombrItem": "Trucha a la plancha",
      "descripcionItem": "Trucha de Salento con patacón y ensalada",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 2,
      "precio": 38000
    },
    {
      "idItem": 4,
      "nombrItem": "Bandeja cafetera",
      "descripcionItem": "Frijoles, arroz, chicharrón, huevo, arepa y aguacate",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 2,
      "precio": 42000
    },
    {
      "idItem": 5,
      "nombrItem": "Sudado de pollo",
      "descripcionItem": "Pollo en salsa criolla con papa y yuca",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 2,
      "precio": 30000
    },
    {
      "idItem": 6,
      "nombrItem": "Café de origen Quindío",
      "descripcionItem": "Taza de café filtrado de finca local",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 3,
      "precio": 6000
    },
    {
      "idItem": 7,
      "nombrItem": "Aguapanela con limón",
      "descripcionItem": "Bebida fría de panela y limón",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 3,
      "precio": 5000
    },
    {
      "idItem": 8,
      "nombrItem": "Arepa de huevo",
      "descripcionItem": "Arepa frita rellena de huevo y carne molida",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 4,
      "precio": 9000
    },
    {
      "idItem": 9,
      "nombrItem": "Ceviche de camarón",
      "descripcionItem": "Camarón en limón con salsa rosada y galletas",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 4,
      "precio": 28000
    },
    {
      "idItem": 10,
      "nombrItem": "Cazuela de mariscos",
      "descripcionItem": "Mariscos en crema de coco con arroz",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 5,
      "precio": 52000
    },
    {
      "idItem": 11,
      "nombrItem": "Pargo rojo frito",
      "descripcionItem": "Pargo entero con arroz de coco y patacón",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 5,
      "precio": 58000
    },
    {
      "idItem": 12,
      "nombrItem": "Limonada de coco",
      "descripcionItem": "Limonada frappé con crema de coco",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 6,
      "precio": 12000
    },
    {
      "idItem": 13,
      "nombrItem": "Jugo de corozo",
      "descripcionItem": "Jugo de fruta de corozo en agua",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 6,
      "precio": 9000
    },
    {
      "idItem": 14,
      "nombrItem": "Bandeja paisa",
      "descripcionItem": "Plato tradicional antioqueño completo",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 7,
      "precio": 45000
    },
    {
      "idItem": 15,
      "nombrItem": "Mondongo antioqueño",
      "descripcionItem": "Sopa de callo con papa, yuca y chorizo",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 7,
      "precio": 32000
    },
    {
      "idItem": 16,
      "nombrItem": "Frijoles vegetarianos",
      "descripcionItem": "Frijoles rojos con arepa, aguacate y maduro",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 7,
      "precio": 26000
    },
    {
      "idItem": 17,
      "nombrItem": "Postre de natas",
      "descripcionItem": "Postre tradicional de leche y natas",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 8,
      "precio": 14000
    },
    {
      "idItem": 18,
      "nombrItem": "Brevas con arequipe",
      "descripcionItem": "Brevas en almíbar con arequipe y queso",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 8,
      "precio": 13000
    },
    {
      "idItem": 19,
      "nombrItem": "Mazamorra con panela",
      "descripcionItem": "Maíz cocido con leche y panela",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 9,
      "precio": 7000
    },
    {
      "idItem": 20,
      "nombrItem": "Cerveza artesanal",
      "descripcionItem": "Cerveza local tipo ale de 330 ml",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 9,
      "precio": 15000
    },
    {
      "idItem": 21,
      "nombrItem": "Changua",
      "descripcionItem": "Caldo de leche con huevo, cilantro y calado",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 10,
      "precio": 16000
    },
    {
      "idItem": 22,
      "nombrItem": "Almojábanas con queso",
      "descripcionItem": "Pan de queso y cuajada recién horneado",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 10,
      "precio": 9000
    },
    {
      "idItem": 23,
      "nombrItem": "Ajiaco santafereño",
      "descripcionItem": "Sopa de tres papas, pollo, guascas, alcaparras y crema",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 11,
      "precio": 38000
    },
    {
      "idItem": 24,
      "nombrItem": "Lomo al café",
      "descripcionItem": "Lomo de res en salsa de café con puré rústico",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 11,
      "precio": 56000
    },
    {
      "idItem": 25,
      "nombrItem": "Bowl de quinoa andina",
      "descripcionItem": "Quinoa, vegetales asados y aderezo de uchuva",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 11,
      "precio": 34000
    },
    {
      "idItem": 26,
      "nombrItem": "Cuajada con melao",
      "descripcionItem": "Cuajada fresca con melao de panela",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 12,
      "precio": 15000
    },
    {
      "idItem": 27,
      "nombrItem": "Encocado de pescado",
      "descripcionItem": "Pescado en salsa de coco con arroz y patacón",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 13,
      "precio": 46000
    },
    {
      "idItem": 28,
      "nombrItem": "Sancocho de gallina",
      "descripcionItem": "Sancocho valluno con gallina criolla",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 13,
      "precio": 35000
    },
    {
      "idItem": 29,
      "nombrItem": "Arroz atollado",
      "descripcionItem": "Arroz cremoso con cerdo, pollo y chorizo",
      "vegetariano": "0",
      "CategoriaMenu_idCategoria": 13,
      "precio": 33000
    },
    {
      "idItem": 30,
      "nombrItem": "Lulada",
      "descripcionItem": "Bebida de lulo machacado con limón y hielo",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 14,
      "precio": 9000
    },
    {
      "idItem": 31,
      "nombrItem": "Champús",
      "descripcionItem": "Bebida de maíz, lulo, piña y panela",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 14,
      "precio": 8000
    },
    {
      "idItem": 32,
      "nombrItem": "Café método V60",
      "descripcionItem": "Café de especialidad filtrado en V60",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 15,
      "precio": 11000
    },
    {
      "idItem": 33,
      "nombrItem": "Capuchino de la casa",
      "descripcionItem": "Espresso con leche texturizada",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 15,
      "precio": 9000
    },
    {
      "idItem": 34,
      "nombrItem": "Torta de café",
      "descripcionItem": "Bizcocho húmedo de café con arequipe",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 16,
      "precio": 13000
    },
    {
      "idItem": 35,
      "nombrItem": "Obleas con arequipe",
      "descripcionItem": "Obleas artesanales con arequipe y queso",
      "vegetariano": "1",
      "CategoriaMenu_idCategoria": 16,
      "precio": 8000
    }
  ],
  "mesas": [
    {
      "idMesa": 1,
      "numeroMesa": 1,
      "capacidad": 2,
      "Restaurante_idRestaurante": 1,
      "disponibilidad": "1"
    },
    {
      "idMesa": 2,
      "numeroMesa": 2,
      "capacidad": 4,
      "Restaurante_idRestaurante": 1,
      "disponibilidad": "1"
    },
    {
      "idMesa": 3,
      "numeroMesa": 3,
      "capacidad": 6,
      "Restaurante_idRestaurante": 1,
      "disponibilidad": "1"
    },
    {
      "idMesa": 4,
      "numeroMesa": 1,
      "capacidad": 2,
      "Restaurante_idRestaurante": 2,
      "disponibilidad": "0"
    },
    {
      "idMesa": 5,
      "numeroMesa": 2,
      "capacidad": 4,
      "Restaurante_idRestaurante": 2,
      "disponibilidad": "1"
    },
    {
      "idMesa": 6,
      "numeroMesa": 3,
      "capacidad": 6,
      "Restaurante_idRestaurante": 2,
      "disponibilidad": "1"
    },
    {
      "idMesa": 7,
      "numeroMesa": 1,
      "capacidad": 2,
      "Restaurante_idRestaurante": 3,
      "disponibilidad": "1"
    },
    {
      "idMesa": 8,
      "numeroMesa": 2,
      "capacidad": 4,
      "Restaurante_idRestaurante": 3,
      "disponibilidad": "1"
    },
    {
      "idMesa": 9,
      "numeroMesa": 3,
      "capacidad": 6,
      "Restaurante_idRestaurante": 3,
      "disponibilidad": "0"
    },
    {
      "idMesa": 10,
      "numeroMesa": 1,
      "capacidad": 2,
      "Restaurante_idRestaurante": 4,
      "disponibilidad": "1"
    },
    {
      "idMesa": 11,
      "numeroMesa": 2,
      "capacidad": 4,
      "Restaurante_idRestaurante": 4,
      "disponibilidad": "0"
    },
    {
      "idMesa": 12,
      "numeroMesa": 3,
      "capacidad": 6,
      "Restaurante_idRestaurante": 4,
      "disponibilidad": "1"
    },
    {
      "idMesa": 13,
      "numeroMesa": 1,
      "capacidad": 2,
      "Restaurante_idRestaurante": 5,
      "disponibilidad": "1"
    },
    {
      "idMesa": 14,
      "numeroMesa": 2,
      "capacidad": 4,
      "Restaurante_idRestaurante": 5,
      "disponibilidad": "1"
    },
    {
      "idMesa": 15,
      "numeroMesa": 3,
      "capacidad": 6,
      "Restaurante_idRestaurante": 5,
      "disponibilidad": "1"
    },
    {
      "idMesa": 16,
      "numeroMesa": 1,
      "capacidad": 2,
      "Restaurante_idRestaurante": 6,
      "disponibilidad": "1"
    },
    {
      "idMesa": 17,
      "numeroMesa": 2,
      "capacidad": 4,
      "Restaurante_idRestaurante": 6,
      "disponibilidad": "1"
    },
    {
      "idMesa": 18,
      "numeroMesa": 3,
      "capacidad": 6,
      "Restaurante_idRestaurante": 6,
      "disponibilidad": "1"
    }
  ],
  "personal": [
    {
      "numeroDocumento": "1094880101",
      "Nombre": "Carlos",
      "apellido": "Ramírez",
      "telefono": "+57 3101110101",
      "direccion": "Calle 5 # 3-10, Salento",
      "email": "carlos.ramirez@fogoncafetero.co",
      "fechaContratacion": "2019-03-01",
      "Restaurante_idRestaurante": 1,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Administrador"
    },
    {
      "numeroDocumento": "1094880102",
      "Nombre": "Luisa",
      "apellido": "Giraldo",
      "telefono": "+57 3101110102",
      "direccion": "Carrera 4 # 8-22, Salento",
      "email": "luisa.giraldo@fogoncafetero.co",
      "fechaContratacion": "2019-05-15",
      "Restaurante_idRestaurante": 1,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Chef"
    },
    {
      "numeroDocumento": "1094880103",
      "Nombre": "Andrés",
      "apellido": "Ospina",
      "telefono": "+57 3101110103",
      "direccion": "Calle 7 # 2-41, Salento",
      "email": "andres.ospina@fogoncafetero.co",
      "fechaContratacion": "2021-02-10",
      "Restaurante_idRestaurante": 1,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Mesero"
    },
    {
      "numeroDocumento": "1094880104",
      "Nombre": "Valentina",
      "apellido": "Arango",
      "telefono": "+57 3101110104",
      "direccion": "Carrera 6 # 5-12, Salento",
      "email": "valentina.arango@fogoncafetero.co",
      "fechaContratacion": "2023-07-01",
      "Restaurante_idRestaurante": 1,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Mesero"
    },
    {
      "numeroDocumento": "1094880105",
      "Nombre": "Jhon",
      "apellido": "Cardona",
      "telefono": "+57 3101110105",
      "direccion": "Barrio Alto, Salento",
      "email": "jhon.cardona@fogoncafetero.co",
      "fechaContratacion": "2022-09-20",
      "Restaurante_idRestaurante": 1,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Repartidor"
    },
    {
      "numeroDocumento": "1047400201",
      "Nombre": "Mariana",
      "apellido": "Pérez",
      "telefono": "+57 3002220201",
      "direccion": "Bocagrande Cra 2 # 8-50, Cartagena",
      "email": "mariana.perez@marymurallas.co",
      "fechaContratacion": "2018-01-15",
      "Restaurante_idRestaurante": 2,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Administrador"
    },
    {
      "numeroDocumento": "1047400202",
      "Nombre": "Rafael",
      "apellido": "Barrios",
      "telefono": "+57 3002220202",
      "direccion": "Manga Calle 25 # 20-11, Cartagena",
      "email": "rafael.barrios@marymurallas.co",
      "fechaContratacion": "2018-02-01",
      "Restaurante_idRestaurante": 2,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Chef"
    },
    {
      "numeroDocumento": "1047400203",
      "Nombre": "Camila",
      "apellido": "Herrera",
      "telefono": "+57 3002220203",
      "direccion": "Getsemaní Calle 30 # 9-15, Cartagena",
      "email": "camila.herrera@marymurallas.co",
      "fechaContratacion": "2020-06-01",
      "Restaurante_idRestaurante": 2,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Mesero"
    },
    {
      "numeroDocumento": "CE458712",
      "Nombre": "Luca",
      "apellido": "Bianchi",
      "telefono": "+57 3002220204",
      "direccion": "Centro Calle 36 # 4-20, Cartagena",
      "email": "luca.bianchi@marymurallas.co",
      "fechaContratacion": "2022-11-01",
      "Restaurante_idRestaurante": 2,
      "TipoDocumento_idTipoDocumento": 2,
      "rol": "Mesero"
    },
    {
      "numeroDocumento": "1047400205",
      "Nombre": "Kevin",
      "apellido": "Julio",
      "telefono": "+57 3002220205",
      "direccion": "Olaya Herrera, Cartagena",
      "email": "kevin.julio@marymurallas.co",
      "fechaContratacion": "2023-03-15",
      "Restaurante_idRestaurante": 2,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Repartidor"
    },
    {
      "numeroDocumento": "1017200301",
      "Nombre": "Juan Pablo",
      "apellido": "Restrepo",
      "telefono": "+57 3043330301",
      "direccion": "Laureles Cra 76 # 33-10, Medellín",
      "email": "juanpablo.restrepo@saboresmontana.co",
      "fechaContratacion": "2017-08-01",
      "Restaurante_idRestaurante": 3,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Administrador"
    },
    {
      "numeroDocumento": "1017200302",
      "Nombre": "Natalia",
      "apellido": "Zapata",
      "telefono": "+57 3043330302",
      "direccion": "Belén Calle 30 # 70-15, Medellín",
      "email": "natalia.zapata@saboresmontana.co",
      "fechaContratacion": "2017-09-01",
      "Restaurante_idRestaurante": 3,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Chef"
    },
    {
      "numeroDocumento": "1017200303",
      "Nombre": "Sebastián",
      "apellido": "Gómez",
      "telefono": "+57 3043330303",
      "direccion": "Envigado Cra 43 # 38S-20",
      "email": "sebastian.gomez@saboresmontana.co",
      "fechaContratacion": "2020-01-20",
      "Restaurante_idRestaurante": 3,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Mesero"
    },
    {
      "numeroDocumento": "1017200304",
      "Nombre": "Laura",
      "apellido": "Montoya",
      "telefono": "+57 3043330304",
      "direccion": "Robledo Calle 65 # 80-12, Medellín",
      "email": "laura.montoya@saboresmontana.co",
      "fechaContratacion": "2024-02-01",
      "Restaurante_idRestaurante": 3,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Mesero"
    },
    {
      "numeroDocumento": "1017200305",
      "Nombre": "Esteban",
      "apellido": "Muñoz",
      "telefono": "+57 3043330305",
      "direccion": "Bello Cra 50 # 45-30",
      "email": "esteban.munoz@saboresmontana.co",
      "fechaContratacion": "2021-05-10",
      "Restaurante_idRestaurante": 3,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Repartidor"
    },
    {
      "numeroDocumento": "52400401",
      "Nombre": "Diana",
      "apellido": "Rodríguez",
      "telefono": "+57 3114440401",
      "direccion": "Chapinero Calle 60 # 9-40, Bogotá",
      "email": "diana.rodriguez@cosechaandina.co",
      "fechaContratacion": "2016-04-01",
      "Restaurante_idRestaurante": 4,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Administrador"
    },
    {
      "numeroDocumento": "79400402",
      "Nombre": "Felipe",
      "apellido": "Castro",
      "telefono": "+57 3114440402",
      "direccion": "Teusaquillo Cra 17 # 39-10, Bogotá",
      "email": "felipe.castro@cosechaandina.co",
      "fechaContratacion": "2016-04-15",
      "Restaurante_idRestaurante": 4,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Chef"
    },
    {
      "numeroDocumento": "1020400403",
      "Nombre": "Sofía",
      "apellido": "Martínez",
      "telefono": "+57 3114440403",
      "direccion": "La Candelaria Calle 12 # 3-25, Bogotá",
      "email": "sofia.martinez@cosechaandina.co",
      "fechaContratacion": "2021-10-01",
      "Restaurante_idRestaurante": 4,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Mesero"
    },
    {
      "numeroDocumento": "1020400404",
      "Nombre": "Brayan",
      "apellido": "López",
      "telefono": "+57 3114440404",
      "direccion": "Kennedy Calle 38S # 78-20, Bogotá",
      "email": "brayan.lopez@cosechaandina.co",
      "fechaContratacion": "2022-01-15",
      "Restaurante_idRestaurante": 4,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Repartidor"
    },
    {
      "numeroDocumento": "31500501",
      "Nombre": "Gloria",
      "apellido": "Mosquera",
      "telefono": "+57 3165550501",
      "direccion": "San Fernando Calle 5 # 34-10, Cali",
      "email": "gloria.mosquera@raicespacifico.co",
      "fechaContratacion": "2019-07-01",
      "Restaurante_idRestaurante": 5,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Administrador"
    },
    {
      "numeroDocumento": "16500502",
      "Nombre": "Hernán",
      "apellido": "Valencia",
      "telefono": "+57 3165550502",
      "direccion": "San Antonio Cra 6 # 2-15, Cali",
      "email": "hernan.valencia@raicespacifico.co",
      "fechaContratacion": "2019-07-15",
      "Restaurante_idRestaurante": 5,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Chef"
    },
    {
      "numeroDocumento": "1144500503",
      "Nombre": "Yuliana",
      "apellido": "Riascos",
      "telefono": "+57 3165550503",
      "direccion": "El Peñón Calle 2 # 4-30, Cali",
      "email": "yuliana.riascos@raicespacifico.co",
      "fechaContratacion": "2022-03-01",
      "Restaurante_idRestaurante": 5,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Mesero"
    },
    {
      "numeroDocumento": "1144500504",
      "Nombre": "Wilmer",
      "apellido": "Caicedo",
      "telefono": "+57 3165550504",
      "direccion": "Siloé, Cali",
      "email": "wilmer.caicedo@raicespacifico.co",
      "fechaContratacion": "2023-01-10",
      "Restaurante_idRestaurante": 5,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Repartidor"
    },
    {
      "numeroDocumento": "1094600601",
      "Nombre": "Paula",
      "apellido": "Quintero",
      "telefono": "+57 3126660601",
      "direccion": "Calle 7 # 5-20, Filandia",
      "email": "paula.quintero@miradorcafe.co",
      "fechaContratacion": "2020-02-01",
      "Restaurante_idRestaurante": 6,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Administrador"
    },
    {
      "numeroDocumento": "1094600602",
      "Nombre": "Mateo",
      "apellido": "Londoño",
      "telefono": "+57 3126660602",
      "direccion": "Carrera 5 # 9-11, Filandia",
      "email": "mateo.londono@miradorcafe.co",
      "fechaContratacion": "2020-02-15",
      "Restaurante_idRestaurante": 6,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Chef"
    },
    {
      "numeroDocumento": "1094600603",
      "Nombre": "Sara",
      "apellido": "Vélez",
      "telefono": "+57 3126660603",
      "direccion": "Calle 8 # 4-05, Filandia",
      "email": "sara.velez@miradorcafe.co",
      "fechaContratacion": "2023-05-01",
      "Restaurante_idRestaurante": 6,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Mesero"
    },
    {
      "numeroDocumento": "1094600604",
      "Nombre": "Miguel",
      "apellido": "Salazar",
      "telefono": "+57 3126660604",
      "direccion": "Vereda Cruces, Filandia",
      "email": "miguel.salazar@miradorcafe.co",
      "fechaContratacion": "2024-06-01",
      "Restaurante_idRestaurante": 6,
      "TipoDocumento_idTipoDocumento": 1,
      "rol": "Repartidor"
    }
  ],
  "meseros": [
    {
      "Personal_numeroDocumento": "1094880103",
      "turno": "Mañana"
    },
    {
      "Personal_numeroDocumento": "1094880104",
      "turno": "Tarde"
    },
    {
      "Personal_numeroDocumento": "1047400203",
      "turno": "Noche"
    },
    {
      "Personal_numeroDocumento": "CE458712",
      "turno": "Completo"
    },
    {
      "Personal_numeroDocumento": "1017200303",
      "turno": "Tarde"
    },
    {
      "Personal_numeroDocumento": "1017200304",
      "turno": "Noche"
    },
    {
      "Personal_numeroDocumento": "1020400403",
      "turno": "Completo"
    },
    {
      "Personal_numeroDocumento": "1144500503",
      "turno": "Noche"
    },
    {
      "Personal_numeroDocumento": "1094600603",
      "turno": "Mañana"
    }
  ],
  "chefs": [
    {
      "Personal_numeroDocumento": "1094880102",
      "especialidad": "Cocina cafetera"
    },
    {
      "Personal_numeroDocumento": "1047400202",
      "especialidad": "Mariscos y cocina caribeña"
    },
    {
      "Personal_numeroDocumento": "1017200302",
      "especialidad": "Cocina antioqueña"
    },
    {
      "Personal_numeroDocumento": "79400402",
      "especialidad": "Cocina contemporánea"
    },
    {
      "Personal_numeroDocumento": "16500502",
      "especialidad": "Cocina del Pacífico"
    },
    {
      "Personal_numeroDocumento": "1094600602",
      "especialidad": "Repostería y barismo"
    }
  ],
  "administradores": [
    {
      "Personal_numeroDocumento": "1094880101",
      "aniosExperiencia": 12
    },
    {
      "Personal_numeroDocumento": "1047400201",
      "aniosExperiencia": 15
    },
    {
      "Personal_numeroDocumento": "1017200301",
      "aniosExperiencia": 18
    },
    {
      "Personal_numeroDocumento": "52400401",
      "aniosExperiencia": 20
    },
    {
      "Personal_numeroDocumento": "31500501",
      "aniosExperiencia": 10
    },
    {
      "Personal_numeroDocumento": "1094600601",
      "aniosExperiencia": 8
    }
  ],
  "repartidores": [
    {
      "Personal_numeroDocumento": "1094880105",
      "medioTransporte": "Motocicleta"
    },
    {
      "Personal_numeroDocumento": "1047400205",
      "medioTransporte": "Motocicleta"
    },
    {
      "Personal_numeroDocumento": "1017200305",
      "medioTransporte": "Bicicleta eléctrica"
    },
    {
      "Personal_numeroDocumento": "1020400404",
      "medioTransporte": "Bicicleta"
    },
    {
      "Personal_numeroDocumento": "1144500504",
      "medioTransporte": "Motocicleta"
    },
    {
      "Personal_numeroDocumento": "1094600604",
      "medioTransporte": "Motocicleta"
    }
  ],
  "meseroIdiomas": [
    {
      "Mesero_Personal_numeroDocumento": "1094880103",
      "Idioma_idIdioma": 1
    },
    {
      "Mesero_Personal_numeroDocumento": "1094880103",
      "Idioma_idIdioma": 2
    },
    {
      "Mesero_Personal_numeroDocumento": "1094880104",
      "Idioma_idIdioma": 1
    },
    {
      "Mesero_Personal_numeroDocumento": "1094880104",
      "Idioma_idIdioma": 2
    },
    {
      "Mesero_Personal_numeroDocumento": "1094880104",
      "Idioma_idIdioma": 4
    },
    {
      "Mesero_Personal_numeroDocumento": "1047400203",
      "Idioma_idIdioma": 1
    },
    {
      "Mesero_Personal_numeroDocumento": "1047400203",
      "Idioma_idIdioma": 2
    },
    {
      "Mesero_Personal_numeroDocumento": "CE458712",
      "Idioma_idIdioma": 1
    },
    {
      "Mesero_Personal_numeroDocumento": "CE458712",
      "Idioma_idIdioma": 6
    },
    {
      "Mesero_Personal_numeroDocumento": "CE458712",
      "Idioma_idIdioma": 2
    },
    {
      "Mesero_Personal_numeroDocumento": "CE458712",
      "Idioma_idIdioma": 3
    },
    {
      "Mesero_Personal_numeroDocumento": "1017200303",
      "Idioma_idIdioma": 1
    },
    {
      "Mesero_Personal_numeroDocumento": "1017200303",
      "Idioma_idIdioma": 2
    },
    {
      "Mesero_Personal_numeroDocumento": "1017200304",
      "Idioma_idIdioma": 1
    },
    {
      "Mesero_Personal_numeroDocumento": "1020400403",
      "Idioma_idIdioma": 1
    },
    {
      "Mesero_Personal_numeroDocumento": "1020400403",
      "Idioma_idIdioma": 2
    },
    {
      "Mesero_Personal_numeroDocumento": "1020400403",
      "Idioma_idIdioma": 3
    },
    {
      "Mesero_Personal_numeroDocumento": "1144500503",
      "Idioma_idIdioma": 1
    },
    {
      "Mesero_Personal_numeroDocumento": "1094600603",
      "Idioma_idIdioma": 1
    },
    {
      "Mesero_Personal_numeroDocumento": "1094600603",
      "Idioma_idIdioma": 2
    },
    {
      "Mesero_Personal_numeroDocumento": "1094600603",
      "Idioma_idIdioma": 5
    }
  ],
  "ordenes": [
    {
      "idOrden": 22,
      "Cliente_numeroDocumento": "1094880014",
      "total": 47000,
      "fecha": "2026-11-06 16:50",
      "Estado_idEstado": 1,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 1,
          "Orden_idOrden": 22,
          "cantidad": 1,
          "subTotal": 12000
        },
        {
          "ItemMenu_idItem": 5,
          "Orden_idOrden": 22,
          "cantidad": 1,
          "subTotal": 30000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Domicilio",
      "direccionEntrega": "Calle 6 # 4-20, Salento",
      "costoDomicilio": 5000,
      "repartidorId": "1094880105",
      "restauranteId": 1
    },
    {
      "idOrden": 21,
      "Cliente_numeroDocumento": "585471239",
      "total": 98000,
      "fecha": "2026-11-06 12:40",
      "Estado_idEstado": 4,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 24,
          "Orden_idOrden": 21,
          "cantidad": 1,
          "subTotal": 56000
        },
        {
          "ItemMenu_idItem": 25,
          "Orden_idOrden": 21,
          "cantidad": 1,
          "subTotal": 34000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Domicilio",
      "direccionEntrega": "Calle 93 # 15-51, Chicó, Bogotá",
      "costoDomicilio": 8000,
      "repartidorId": "1020400404",
      "restauranteId": 4
    },
    {
      "idOrden": 20,
      "Cliente_numeroDocumento": "1094950001",
      "total": 46000,
      "fecha": "2026-10-28 16:00",
      "Estado_idEstado": 5,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 33,
          "Orden_idOrden": 20,
          "cantidad": 2,
          "subTotal": 18000
        },
        {
          "ItemMenu_idItem": 35,
          "Orden_idOrden": 20,
          "cantidad": 3,
          "subTotal": 24000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Domicilio",
      "direccionEntrega": "Cra 5 # 7-12, Filandia",
      "costoDomicilio": 4000,
      "repartidorId": "1094600604",
      "restauranteId": 6
    },
    {
      "idOrden": 19,
      "Cliente_numeroDocumento": "PAB458712",
      "total": 83000,
      "fecha": "2026-09-20 21:15",
      "Estado_idEstado": 5,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 9,
          "Orden_idOrden": 19,
          "cantidad": 2,
          "subTotal": 56000
        },
        {
          "ItemMenu_idItem": 13,
          "Orden_idOrden": 19,
          "cantidad": 2,
          "subTotal": 18000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Domicilio",
      "direccionEntrega": "Calle de la Factoría # 36-57, Centro, Cartagena",
      "costoDomicilio": 9000,
      "repartidorId": "1047400205",
      "restauranteId": 2
    },
    {
      "idOrden": 18,
      "Cliente_numeroDocumento": "1144880010",
      "total": 101000,
      "fecha": "2026-10-18 20:30",
      "Estado_idEstado": 5,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 27,
          "Orden_idOrden": 18,
          "cantidad": 1,
          "subTotal": 46000
        },
        {
          "ItemMenu_idItem": 29,
          "Orden_idOrden": 18,
          "cantidad": 1,
          "subTotal": 33000
        },
        {
          "ItemMenu_idItem": 31,
          "Orden_idOrden": 18,
          "cantidad": 2,
          "subTotal": 16000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Domicilio",
      "direccionEntrega": "Av. 6N # 23-45, Granada, Cali",
      "costoDomicilio": 6000,
      "repartidorId": "1144500504",
      "restauranteId": 5
    },
    {
      "idOrden": 17,
      "Cliente_numeroDocumento": "1032450002",
      "total": 120000,
      "fecha": "2026-10-12 13:10",
      "Estado_idEstado": 5,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 23,
          "Orden_idOrden": 17,
          "cantidad": 2,
          "subTotal": 76000
        },
        {
          "ItemMenu_idItem": 22,
          "Orden_idOrden": 17,
          "cantidad": 4,
          "subTotal": 36000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Domicilio",
      "direccionEntrega": "Calle 85 # 11-53, Bogotá",
      "costoDomicilio": 8000,
      "repartidorId": "1020400404",
      "restauranteId": 4
    },
    {
      "idOrden": 16,
      "Cliente_numeroDocumento": "1017880011",
      "total": 92000,
      "fecha": "2026-10-05 20:00",
      "Estado_idEstado": 5,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 14,
          "Orden_idOrden": 16,
          "cantidad": 1,
          "subTotal": 45000
        },
        {
          "ItemMenu_idItem": 16,
          "Orden_idOrden": 16,
          "cantidad": 1,
          "subTotal": 26000
        },
        {
          "ItemMenu_idItem": 17,
          "Orden_idOrden": 16,
          "cantidad": 1,
          "subTotal": 14000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Domicilio",
      "direccionEntrega": "Cra 43A # 1-50, El Poblado, Medellín",
      "costoDomicilio": 7000,
      "repartidorId": "1017200305",
      "restauranteId": 3
    },
    {
      "idOrden": 15,
      "Cliente_numeroDocumento": "1094880014",
      "total": 99000,
      "fecha": "2026-09-14 19:30",
      "Estado_idEstado": 5,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 4,
          "Orden_idOrden": 15,
          "cantidad": 2,
          "subTotal": 84000
        },
        {
          "ItemMenu_idItem": 7,
          "Orden_idOrden": 15,
          "cantidad": 2,
          "subTotal": 10000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Domicilio",
      "direccionEntrega": "Calle 6 # 4-20, Salento",
      "costoDomicilio": 5000,
      "repartidorId": "1094880105",
      "restauranteId": 1
    },
    {
      "idOrden": 14,
      "Cliente_numeroDocumento": "CE987452",
      "total": 70000,
      "fecha": "2026-11-05 19:00",
      "Estado_idEstado": 7,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 28,
          "Orden_idOrden": 14,
          "cantidad": 2,
          "subTotal": 70000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Restaurante",
      "mesaId": 14,
      "meseroId": "1144500503",
      "restauranteId": 5
    },
    {
      "idOrden": 13,
      "Cliente_numeroDocumento": "G45871236",
      "total": 58000,
      "fecha": "2026-11-06 13:00",
      "Estado_idEstado": 3,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 14,
          "Orden_idOrden": 13,
          "cantidad": 1,
          "subTotal": 45000
        },
        {
          "ItemMenu_idItem": 18,
          "Orden_idOrden": 13,
          "cantidad": 1,
          "subTotal": 13000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Restaurante",
      "mesaId": 9,
      "meseroId": "1017200303",
      "restauranteId": 3
    },
    {
      "idOrden": 12,
      "Cliente_numeroDocumento": "PE4587123",
      "total": 128000,
      "fecha": "2026-11-01 21:00",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 10,
          "Orden_idOrden": 12,
          "cantidad": 2,
          "subTotal": 104000
        },
        {
          "ItemMenu_idItem": 12,
          "Orden_idOrden": 12,
          "cantidad": 2,
          "subTotal": 24000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Restaurante",
      "mesaId": 6,
      "meseroId": "CE458712",
      "restauranteId": 2
    },
    {
      "idOrden": 11,
      "Cliente_numeroDocumento": "587412369",
      "total": 332000,
      "fecha": "2026-10-24 12:30",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 4,
          "Orden_idOrden": 11,
          "cantidad": 1,
          "subTotal": 42000
        },
        {
          "ItemMenu_idItem": 3,
          "Orden_idOrden": 11,
          "cantidad": 1,
          "subTotal": 38000
        },
        {
          "ItemMenu_idItem": 6,
          "Orden_idOrden": 11,
          "cantidad": 2,
          "subTotal": 12000
        }
      ],
      "detallesExperiencia": [
        {
          "ExperienciaTuristica_idExperiencia": 2,
          "Orden_idOrden": 11,
          "subtotal": 240000,
          "asistentes": 2,
          "fechaProgramada": "2026-10-25 10:00"
        }
      ],
      "tipo": "Restaurante",
      "mesaId": 3,
      "meseroId": "1094880103",
      "restauranteId": 1
    },
    {
      "idOrden": 10,
      "Cliente_numeroDocumento": "FZ458712",
      "total": 228000,
      "fecha": "2026-10-20 10:30",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 32,
          "Orden_idOrden": 10,
          "cantidad": 2,
          "subTotal": 22000
        },
        {
          "ItemMenu_idItem": 34,
          "Orden_idOrden": 10,
          "cantidad": 2,
          "subTotal": 26000
        }
      ],
      "detallesExperiencia": [
        {
          "ExperienciaTuristica_idExperiencia": 8,
          "Orden_idOrden": 10,
          "subtotal": 180000,
          "asistentes": 2,
          "fechaProgramada": "2026-10-20 15:00"
        }
      ],
      "tipo": "Restaurante",
      "mesaId": 16,
      "meseroId": "1094600603",
      "restauranteId": 6
    },
    {
      "idOrden": 9,
      "Cliente_numeroDocumento": "1144880010",
      "total": 300000,
      "fecha": "2026-10-15 13:15",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 27,
          "Orden_idOrden": 9,
          "cantidad": 2,
          "subTotal": 92000
        },
        {
          "ItemMenu_idItem": 30,
          "Orden_idOrden": 9,
          "cantidad": 2,
          "subTotal": 18000
        }
      ],
      "detallesExperiencia": [
        {
          "ExperienciaTuristica_idExperiencia": 7,
          "Orden_idOrden": 9,
          "subtotal": 190000,
          "asistentes": 2,
          "fechaProgramada": "2026-10-17 19:00"
        }
      ],
      "tipo": "Restaurante",
      "mesaId": 13,
      "meseroId": "1144500503",
      "restauranteId": 5
    },
    {
      "idOrden": 8,
      "Cliente_numeroDocumento": "585471239",
      "total": 236000,
      "fecha": "2026-10-10 19:40",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 21,
          "Orden_idOrden": 8,
          "cantidad": 1,
          "subTotal": 16000
        },
        {
          "ItemMenu_idItem": 24,
          "Orden_idOrden": 8,
          "cantidad": 1,
          "subTotal": 56000
        },
        {
          "ItemMenu_idItem": 25,
          "Orden_idOrden": 8,
          "cantidad": 1,
          "subTotal": 34000
        }
      ],
      "detallesExperiencia": [
        {
          "ExperienciaTuristica_idExperiencia": 6,
          "Orden_idOrden": 8,
          "subtotal": 130000,
          "asistentes": 1,
          "fechaProgramada": "2026-10-11 08:00"
        }
      ],
      "tipo": "Restaurante",
      "mesaId": 11,
      "meseroId": "1020400403",
      "restauranteId": 4
    },
    {
      "idOrden": 7,
      "Cliente_numeroDocumento": "1032450002",
      "total": 109000,
      "fecha": "2026-10-08 13:00",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 22,
          "Orden_idOrden": 7,
          "cantidad": 2,
          "subTotal": 18000
        },
        {
          "ItemMenu_idItem": 23,
          "Orden_idOrden": 7,
          "cantidad": 2,
          "subTotal": 76000
        },
        {
          "ItemMenu_idItem": 26,
          "Orden_idOrden": 7,
          "cantidad": 1,
          "subTotal": 15000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Restaurante",
      "mesaId": 10,
      "meseroId": "1020400403",
      "restauranteId": 4
    },
    {
      "idOrden": 6,
      "Cliente_numeroDocumento": "AAE987654",
      "total": 243000,
      "fecha": "2026-10-03 20:15",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 15,
          "Orden_idOrden": 6,
          "cantidad": 1,
          "subTotal": 32000
        },
        {
          "ItemMenu_idItem": 16,
          "Orden_idOrden": 6,
          "cantidad": 1,
          "subTotal": 26000
        },
        {
          "ItemMenu_idItem": 20,
          "Orden_idOrden": 6,
          "cantidad": 3,
          "subTotal": 45000
        }
      ],
      "detallesExperiencia": [
        {
          "ExperienciaTuristica_idExperiencia": 5,
          "Orden_idOrden": 6,
          "subtotal": 140000,
          "asistentes": 2,
          "fechaProgramada": "2026-10-04 18:00"
        }
      ],
      "tipo": "Restaurante",
      "mesaId": 8,
      "meseroId": "1017200304",
      "restauranteId": 3
    },
    {
      "idOrden": 5,
      "Cliente_numeroDocumento": "1017880011",
      "total": 132000,
      "fecha": "2026-10-02 12:45",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 14,
          "Orden_idOrden": 5,
          "cantidad": 2,
          "subTotal": 90000
        },
        {
          "ItemMenu_idItem": 17,
          "Orden_idOrden": 5,
          "cantidad": 2,
          "subTotal": 28000
        },
        {
          "ItemMenu_idItem": 19,
          "Orden_idOrden": 5,
          "cantidad": 2,
          "subTotal": 14000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Restaurante",
      "mesaId": 7,
      "meseroId": "1017200303",
      "restauranteId": 3
    },
    {
      "idOrden": 4,
      "Cliente_numeroDocumento": "18AB45879",
      "total": 245000,
      "fecha": "2026-09-25 13:30",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 9,
          "Orden_idOrden": 4,
          "cantidad": 1,
          "subTotal": 28000
        },
        {
          "ItemMenu_idItem": 11,
          "Orden_idOrden": 4,
          "cantidad": 1,
          "subTotal": 58000
        },
        {
          "ItemMenu_idItem": 13,
          "Orden_idOrden": 4,
          "cantidad": 1,
          "subTotal": 9000
        }
      ],
      "detallesExperiencia": [
        {
          "ExperienciaTuristica_idExperiencia": 3,
          "Orden_idOrden": 4,
          "subtotal": 150000,
          "asistentes": 1,
          "fechaProgramada": "2026-09-26 10:00"
        }
      ],
      "tipo": "Restaurante",
      "mesaId": 5,
      "meseroId": "CE458712",
      "restauranteId": 2
    },
    {
      "idOrden": 3,
      "Cliente_numeroDocumento": "PAB458712",
      "total": 372000,
      "fecha": "2026-09-18 20:00",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 8,
          "Orden_idOrden": 3,
          "cantidad": 2,
          "subTotal": 18000
        },
        {
          "ItemMenu_idItem": 10,
          "Orden_idOrden": 3,
          "cantidad": 1,
          "subTotal": 52000
        },
        {
          "ItemMenu_idItem": 11,
          "Orden_idOrden": 3,
          "cantidad": 1,
          "subTotal": 58000
        },
        {
          "ItemMenu_idItem": 12,
          "Orden_idOrden": 3,
          "cantidad": 2,
          "subTotal": 24000
        }
      ],
      "detallesExperiencia": [
        {
          "ExperienciaTuristica_idExperiencia": 4,
          "Orden_idOrden": 3,
          "subtotal": 220000,
          "asistentes": 2,
          "fechaProgramada": "2026-09-19 16:00"
        }
      ],
      "tipo": "Restaurante",
      "mesaId": 4,
      "meseroId": "1047400203",
      "restauranteId": 2
    },
    {
      "idOrden": 2,
      "Cliente_numeroDocumento": "1094950001",
      "total": 80000,
      "fecha": "2026-09-12 19:10",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 2,
          "Orden_idOrden": 2,
          "cantidad": 1,
          "subTotal": 10000
        },
        {
          "ItemMenu_idItem": 5,
          "Orden_idOrden": 2,
          "cantidad": 2,
          "subTotal": 60000
        },
        {
          "ItemMenu_idItem": 7,
          "Orden_idOrden": 2,
          "cantidad": 2,
          "subTotal": 10000
        }
      ],
      "detallesExperiencia": [],
      "tipo": "Restaurante",
      "mesaId": 2,
      "meseroId": "1094880104",
      "restauranteId": 1
    },
    {
      "idOrden": 1,
      "Cliente_numeroDocumento": "549871236",
      "total": 282000,
      "fecha": "2026-09-05 13:20",
      "Estado_idEstado": 6,
      "detallesMenu": [
        {
          "ItemMenu_idItem": 1,
          "Orden_idOrden": 1,
          "cantidad": 2,
          "subTotal": 24000
        },
        {
          "ItemMenu_idItem": 3,
          "Orden_idOrden": 1,
          "cantidad": 2,
          "subTotal": 76000
        },
        {
          "ItemMenu_idItem": 6,
          "Orden_idOrden": 1,
          "cantidad": 2,
          "subTotal": 12000
        }
      ],
      "detallesExperiencia": [
        {
          "ExperienciaTuristica_idExperiencia": 1,
          "Orden_idOrden": 1,
          "subtotal": 170000,
          "asistentes": 2,
          "fechaProgramada": "2026-09-06 09:00"
        }
      ],
      "tipo": "Restaurante",
      "mesaId": 1,
      "meseroId": "1094880103",
      "restauranteId": 1
    }
  ],
  "reservas": [
    {
      "idReserva": 12,
      "fechaReserva": "2026-12-24",
      "horaReserva": "20:00",
      "cantidadPersonas": 6,
      "Cliente_numeroDocumento": "1144880010",
      "Restaurante_idRestaurante": 5,
      "Estado_idEstado": 2,
      "peticionesIds": [
        1,
        4
      ],
      "peticionesEspeciales": [
        "Silla para bebé",
        "Menú sin gluten"
      ]
    },
    {
      "idReserva": 11,
      "fechaReserva": "2026-12-05",
      "horaReserva": "12:30",
      "cantidadPersonas": 5,
      "Cliente_numeroDocumento": "1094880014",
      "Restaurante_idRestaurante": 6,
      "Estado_idEstado": 1,
      "peticionesIds": [],
      "peticionesEspeciales": []
    },
    {
      "idReserva": 10,
      "fechaReserva": "2026-11-28",
      "horaReserva": "13:00",
      "cantidadPersonas": 8,
      "Cliente_numeroDocumento": "1032450002",
      "Restaurante_idRestaurante": 4,
      "Estado_idEstado": 1,
      "peticionesIds": [
        4,
        5
      ],
      "peticionesEspeciales": [
        "Menú sin gluten",
        "Acceso para silla de ruedas"
      ]
    },
    {
      "idReserva": 9,
      "fechaReserva": "2026-11-20",
      "horaReserva": "20:00",
      "cantidadPersonas": 2,
      "Cliente_numeroDocumento": "18AB45879",
      "Restaurante_idRestaurante": 2,
      "Estado_idEstado": 2,
      "peticionesIds": [
        6
      ],
      "peticionesEspeciales": [
        "Celebración de aniversario"
      ]
    },
    {
      "idReserva": 8,
      "fechaReserva": "2026-11-14",
      "horaReserva": "19:30",
      "cantidadPersonas": 4,
      "Cliente_numeroDocumento": "1094950001",
      "Restaurante_idRestaurante": 1,
      "Estado_idEstado": 2,
      "peticionesIds": [
        1,
        2
      ],
      "peticionesEspeciales": [
        "Silla para bebé",
        "Decoración de cumpleaños"
      ]
    },
    {
      "idReserva": 7,
      "fechaReserva": "2026-10-30",
      "horaReserva": "19:00",
      "cantidadPersonas": 3,
      "Cliente_numeroDocumento": "PE4587123",
      "Restaurante_idRestaurante": 2,
      "Estado_idEstado": 7,
      "peticionesIds": [],
      "peticionesEspeciales": []
    },
    {
      "idReserva": 6,
      "fechaReserva": "2026-10-15",
      "horaReserva": "20:00",
      "cantidadPersonas": 6,
      "Cliente_numeroDocumento": "1017880011",
      "Restaurante_idRestaurante": 3,
      "Estado_idEstado": 8,
      "peticionesIds": [
        1
      ],
      "peticionesEspeciales": [
        "Silla para bebé"
      ]
    },
    {
      "idReserva": 5,
      "fechaReserva": "2026-10-20",
      "horaReserva": "10:00",
      "cantidadPersonas": 2,
      "Cliente_numeroDocumento": "FZ458712",
      "Restaurante_idRestaurante": 6,
      "Estado_idEstado": 6,
      "peticionesIds": [
        3
      ],
      "peticionesEspeciales": [
        "Mesa con vista"
      ]
    },
    {
      "idReserva": 4,
      "fechaReserva": "2026-10-10",
      "horaReserva": "19:30",
      "cantidadPersonas": 1,
      "Cliente_numeroDocumento": "585471239",
      "Restaurante_idRestaurante": 4,
      "Estado_idEstado": 6,
      "peticionesIds": [],
      "peticionesEspeciales": []
    },
    {
      "idReserva": 3,
      "fechaReserva": "2026-10-03",
      "horaReserva": "20:00",
      "cantidadPersonas": 4,
      "Cliente_numeroDocumento": "AAE987654",
      "Restaurante_idRestaurante": 3,
      "Estado_idEstado": 6,
      "peticionesIds": [
        2
      ],
      "peticionesEspeciales": [
        "Decoración de cumpleaños"
      ]
    },
    {
      "idReserva": 2,
      "fechaReserva": "2026-09-18",
      "horaReserva": "19:30",
      "cantidadPersonas": 2,
      "Cliente_numeroDocumento": "PAB458712",
      "Restaurante_idRestaurante": 2,
      "Estado_idEstado": 6,
      "peticionesIds": [
        3,
        6
      ],
      "peticionesEspeciales": [
        "Mesa con vista",
        "Celebración de aniversario"
      ]
    },
    {
      "idReserva": 1,
      "fechaReserva": "2026-09-05",
      "horaReserva": "13:00",
      "cantidadPersonas": 2,
      "Cliente_numeroDocumento": "549871236",
      "Restaurante_idRestaurante": 1,
      "Estado_idEstado": 6,
      "peticionesIds": [
        3
      ],
      "peticionesEspeciales": [
        "Mesa con vista"
      ]
    }
  ],
  "resenas": [
    {
      "idResena": 1,
      "puntuacionComida": 5,
      "puntuacionServicio": 5,
      "comentario": "Excelente trucha y el tour de café fue increíble.",
      "fechaPublicacion": "2026-09-07",
      "Restaurante_idRestaurante": 1,
      "Cliente_numeroDocumento": "549871236"
    },
    {
      "idResena": 2,
      "puntuacionComida": 4,
      "puntuacionServicio": 3,
      "comentario": "Buena sazón, pero el servicio fue algo demorado.",
      "fechaPublicacion": "2026-09-13",
      "Restaurante_idRestaurante": 1,
      "Cliente_numeroDocumento": "1094950001"
    },
    {
      "idResena": 3,
      "puntuacionComida": 5,
      "puntuacionServicio": 4,
      "comentario": "La cazuela de mariscos es espectacular.",
      "fechaPublicacion": "2026-09-19",
      "Restaurante_idRestaurante": 2,
      "Cliente_numeroDocumento": "PAB458712"
    },
    {
      "idResena": 4,
      "puntuacionComida": 4,
      "puntuacionServicio": 5,
      "comentario": "Muy buena atención en francés, gracias Luca.",
      "fechaPublicacion": "2026-09-26",
      "Restaurante_idRestaurante": 2,
      "Cliente_numeroDocumento": "18AB45879"
    },
    {
      "idResena": 5,
      "puntuacionComida": 5,
      "puntuacionServicio": 5,
      "comentario": "La mejor bandeja paisa de Medellín.",
      "fechaPublicacion": "2026-10-02",
      "Restaurante_idRestaurante": 3,
      "Cliente_numeroDocumento": "1017880011"
    },
    {
      "idResena": 6,
      "puntuacionComida": 4,
      "puntuacionServicio": 3,
      "comentario": "Rica comida, pero el lugar estaba muy lleno.",
      "fechaPublicacion": "2026-10-04",
      "Restaurante_idRestaurante": 3,
      "Cliente_numeroDocumento": "AAE987654"
    },
    {
      "idResena": 7,
      "puntuacionComida": 5,
      "puntuacionServicio": 4,
      "comentario": "El ajiaco sabe como el de la abuela.",
      "fechaPublicacion": "2026-10-09",
      "Restaurante_idRestaurante": 4,
      "Cliente_numeroDocumento": "1032450002"
    },
    {
      "idResena": 8,
      "puntuacionComida": 4,
      "puntuacionServicio": 5,
      "comentario": "Great food, the coffee steak was amazing.",
      "fechaPublicacion": "2026-10-11",
      "Restaurante_idRestaurante": 4,
      "Cliente_numeroDocumento": "585471239"
    },
    {
      "idResena": 9,
      "puntuacionComida": 5,
      "puntuacionServicio": 5,
      "comentario": "El encocado de pescado es de otro nivel.",
      "fechaPublicacion": "2026-10-16",
      "Restaurante_idRestaurante": 5,
      "Cliente_numeroDocumento": "1144880010"
    },
    {
      "idResena": 10,
      "puntuacionComida": 5,
      "puntuacionServicio": 5,
      "comentario": "Café de especialidad y una vista hermosa.",
      "fechaPublicacion": "2026-10-21",
      "Restaurante_idRestaurante": 6,
      "Cliente_numeroDocumento": "FZ458712"
    },
    {
      "idResena": 11,
      "puntuacionComida": 5,
      "puntuacionServicio": 4,
      "comentario": "Me encantó la clase de cocina con la chef.",
      "fechaPublicacion": "2026-10-26",
      "Restaurante_idRestaurante": 1,
      "Cliente_numeroDocumento": "587412369"
    },
    {
      "idResena": 12,
      "puntuacionComida": 3,
      "puntuacionServicio": 4,
      "comentario": "Precios algo altos para el tamaño de la porción.",
      "fechaPublicacion": "2026-11-02",
      "Restaurante_idRestaurante": 2,
      "Cliente_numeroDocumento": "PE4587123"
    },
    {
      "idResena": 13,
      "puntuacionComida": 2,
      "puntuacionServicio": 2,
      "comentario": "Cancelaron mi pedido sin dar explicación.",
      "fechaPublicacion": "2026-11-05",
      "Restaurante_idRestaurante": 5,
      "Cliente_numeroDocumento": "CE987452"
    },
    {
      "idResena": 14,
      "puntuacionComida": 3,
      "puntuacionServicio": 3,
      "comentario": "El domicilio llegó frío.",
      "fechaPublicacion": "2026-10-12",
      "Restaurante_idRestaurante": 4,
      "Cliente_numeroDocumento": "1032450002"
    },
    {
      "idResena": 15,
      "puntuacionComida": 4,
      "puntuacionServicio": 5,
      "comentario": "Postres deliciosos, volveré pronto.",
      "fechaPublicacion": "2026-10-29",
      "Restaurante_idRestaurante": 6,
      "Cliente_numeroDocumento": "1094950001"
    }
  ],
  "pagos": [
    {
      "idPago": 1,
      "monedaPago": "COP",
      "totalPagado": 282000,
      "propina": 22000,
      "fechaPago": "2026-09-05 13:20",
      "Orden_idOrden": 1,
      "metodoPagoId": 2,
      "metodosPagoIds": [
        2
      ]
    },
    {
      "idPago": 2,
      "monedaPago": "COP",
      "totalPagado": 80000,
      "propina": 0,
      "fechaPago": "2026-09-12 19:10",
      "Orden_idOrden": 2,
      "metodoPagoId": 1,
      "metodosPagoIds": [
        1
      ]
    },
    {
      "idPago": 3,
      "monedaPago": "COP",
      "totalPagado": 372000,
      "propina": 40000,
      "fechaPago": "2026-09-18 20:00",
      "Orden_idOrden": 3,
      "metodoPagoId": 1,
      "metodosPagoIds": [
        1,
        2
      ]
    },
    {
      "idPago": 4,
      "monedaPago": "COP",
      "totalPagado": 245000,
      "propina": 25000,
      "fechaPago": "2026-09-25 13:30",
      "Orden_idOrden": 4,
      "metodoPagoId": 2,
      "metodosPagoIds": [
        2
      ]
    },
    {
      "idPago": 5,
      "monedaPago": "COP",
      "totalPagado": 132000,
      "propina": 0,
      "fechaPago": "2026-10-02 12:45",
      "Orden_idOrden": 5,
      "metodoPagoId": 4,
      "metodosPagoIds": [
        4
      ]
    },
    {
      "idPago": 6,
      "monedaPago": "COP",
      "totalPagado": 243000,
      "propina": 20000,
      "fechaPago": "2026-10-03 20:15",
      "Orden_idOrden": 6,
      "metodoPagoId": 3,
      "metodosPagoIds": [
        3
      ]
    },
    {
      "idPago": 7,
      "monedaPago": "COP",
      "totalPagado": 109000,
      "propina": 0,
      "fechaPago": "2026-10-08 13:00",
      "Orden_idOrden": 7,
      "metodoPagoId": 1,
      "metodosPagoIds": [
        1
      ]
    },
    {
      "idPago": 8,
      "monedaPago": "COP",
      "totalPagado": 236000,
      "propina": 30000,
      "fechaPago": "2026-10-10 19:40",
      "Orden_idOrden": 8,
      "metodoPagoId": 2,
      "metodosPagoIds": [
        2
      ]
    },
    {
      "idPago": 9,
      "monedaPago": "COP",
      "totalPagado": 300000,
      "propina": 12000,
      "fechaPago": "2026-10-15 13:15",
      "Orden_idOrden": 9,
      "metodoPagoId": 4,
      "metodosPagoIds": [
        4
      ]
    },
    {
      "idPago": 10,
      "monedaPago": "COP",
      "totalPagado": 228000,
      "propina": 0,
      "fechaPago": "2026-10-20 10:30",
      "Orden_idOrden": 10,
      "metodoPagoId": 3,
      "metodosPagoIds": [
        3
      ]
    },
    {
      "idPago": 11,
      "monedaPago": "COP",
      "totalPagado": 332000,
      "propina": 35000,
      "fechaPago": "2026-10-24 12:30",
      "Orden_idOrden": 11,
      "metodoPagoId": 2,
      "metodosPagoIds": [
        2
      ]
    },
    {
      "idPago": 12,
      "monedaPago": "COP",
      "totalPagado": 128000,
      "propina": 15000,
      "fechaPago": "2026-11-01 21:00",
      "Orden_idOrden": 12,
      "metodoPagoId": 5,
      "metodosPagoIds": [
        5
      ]
    },
    {
      "idPago": 13,
      "monedaPago": "COP",
      "totalPagado": 99000,
      "propina": 0,
      "fechaPago": "2026-09-14 19:30",
      "Orden_idOrden": 15,
      "metodoPagoId": 1,
      "metodosPagoIds": [
        1
      ]
    },
    {
      "idPago": 14,
      "monedaPago": "COP",
      "totalPagado": 92000,
      "propina": 3000,
      "fechaPago": "2026-10-05 20:00",
      "Orden_idOrden": 16,
      "metodoPagoId": 4,
      "metodosPagoIds": [
        4
      ]
    },
    {
      "idPago": 15,
      "monedaPago": "COP",
      "totalPagado": 120000,
      "propina": 5000,
      "fechaPago": "2026-10-12 13:10",
      "Orden_idOrden": 17,
      "metodoPagoId": 3,
      "metodosPagoIds": [
        3,
        4
      ]
    },
    {
      "idPago": 16,
      "monedaPago": "COP",
      "totalPagado": 101000,
      "propina": 0,
      "fechaPago": "2026-10-18 20:30",
      "Orden_idOrden": 18,
      "metodoPagoId": 1,
      "metodosPagoIds": [
        1
      ]
    },
    {
      "idPago": 17,
      "monedaPago": "COP",
      "totalPagado": 83000,
      "propina": 4000,
      "fechaPago": "2026-09-20 21:15",
      "Orden_idOrden": 19,
      "metodoPagoId": 2,
      "metodosPagoIds": [
        2
      ]
    },
    {
      "idPago": 18,
      "monedaPago": "COP",
      "totalPagado": 46000,
      "propina": 2000,
      "fechaPago": "2026-10-28 16:00",
      "Orden_idOrden": 20,
      "metodoPagoId": 4,
      "metodosPagoIds": [
        4
      ]
    }
  ],
  "conteos": {
    "Pais": 8,
    "Departamento": 18,
    "Ciudad": 23,
    "TipoDocumento": 5,
    "Estado": 8,
    "Idioma": 6,
    "MetodoPago": 5,
    "PeticionEspecial": 6,
    "Restaurante": 6,
    "CartaMenu": 16,
    "ItemMenu": 35,
    "Mesa": 18,
    "ExperienciaTuristica": 8,
    "Cliente": 15,
    "Personal": 27,
    "Administrador": 6,
    "Chef": 6,
    "Mesero": 9,
    "Repartidor": 6,
    "MeseroIdioma": 21,
    "Orden": 22,
    "OrdenRestaurante": 14,
    "OrdenDomicilio": 8,
    "DetalleOrden": 55,
    "DetalleExperienciaOrden": 8,
    "Pago": 18,
    "PagoMetodoPago": 20,
    "Reserva": 12,
    "ReservaPeticionesEsp": 13,
    "Resena": 15
  }
};

export const INITIAL_PAISES = SEED_DATASET.paises;
export const INITIAL_CIUDADES = SEED_DATASET.ciudades;
export const INITIAL_TIPOS_DOCUMENTO = SEED_DATASET.tiposDocumento;
export const INITIAL_ESTADOS = SEED_DATASET.estados;
export const INITIAL_PETICIONES_ESPECIALES = SEED_DATASET.peticionesEspeciales;
export const INITIAL_RESTAURANTES = SEED_DATASET.restaurantes;
export const INITIAL_CLIENTES = SEED_DATASET.clientes;
export const INITIAL_EXPERIENCIAS = SEED_DATASET.experiencias;
export const INITIAL_CARTAS_MENU = SEED_DATASET.cartasMenu;
export const INITIAL_ITEMS_MENU = SEED_DATASET.itemsMenu;
export const INITIAL_MESAS = SEED_DATASET.mesas;
export const INITIAL_PERSONAL = SEED_DATASET.personal;
export const INITIAL_ORDENES = SEED_DATASET.ordenes;
export const INITIAL_RESERVAS = SEED_DATASET.reservas;
export const INITIAL_RESENAS = SEED_DATASET.resenas;
export const INITIAL_PAGOS = SEED_DATASET.pagos;
