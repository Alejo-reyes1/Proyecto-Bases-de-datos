-- =====================================================================
-- DATOS DE PRUEBA - Sistema de Gestión de Restaurantes y Turismo Gastronómico
-- Oracle Autonomous Database (OCI) - Instancia ProyectoRestaurante
-- ---------------------------------------------------------------------
-- Cómo ejecutarlo: abrir en SQL Developer y usar 'Ejecutar script' (F5).
-- Los INSERT están en orden de dependencias (padres antes que hijos).
-- Convenciones:
--   * Ids geográficos con códigos ISO 3166: país 'CO', departamento
--     'CO-QUI', ciudad 'CO-QUI-ARM' (país-departamento-ciudad).
--   * Cliente.paisOrigen guarda el mismo código del país ('CO','US'...)
--     para poder hacer JOIN con Pais aunque no exista la FK.
--   * Booleanos (vegetariano, disponibilidad): 1 = sí, 0 = no.
--   * Precios en pesos colombianos (COP). Orden.total = suma de
--     subtotales + experiencias + costo de domicilio.
--   * Pago.totalPagado = Orden.total; la propina va aparte.
-- =====================================================================

SET DEFINE OFF;

-- (Opcional) Limpiar datos antes de volver a cargar. Quitar los comentarios
-- solo si quieren BORRAR todo lo que haya en las tablas:
-- DELETE FROM PagoMetodoPago;
-- DELETE FROM Pago;
-- DELETE FROM DetalleExperienciaOrden;
-- DELETE FROM DetalleOrden;
-- DELETE FROM OrdenRestaurante;
-- DELETE FROM OrdenDomicilio;
-- DELETE FROM Orden;
-- DELETE FROM ReservaPeticionesEsp;
-- DELETE FROM Reserva;
-- DELETE FROM Resena;
-- DELETE FROM MeseroIdioma;
-- DELETE FROM Administrador;
-- DELETE FROM Chef;
-- DELETE FROM Mesero;
-- DELETE FROM Repartidor;
-- DELETE FROM Personal;
-- DELETE FROM Cliente;
-- DELETE FROM ExperienciaTuristica;
-- DELETE FROM ItemMenu;
-- DELETE FROM CartaMenu;
-- DELETE FROM Mesa;
-- DELETE FROM Restaurante;
-- DELETE FROM Ciudad;
-- DELETE FROM Departamento;
-- DELETE FROM Pais;
-- DELETE FROM PeticionEspecial;
-- DELETE FROM MetodoPago;
-- DELETE FROM Idioma;
-- DELETE FROM Estado;
-- DELETE FROM TipoDocumento;
-- COMMIT;

-- ======================================================================
-- 1. PAIS
--    Id = código ISO 3166-1 de dos letras
-- ======================================================================
INSERT INTO Pais (idPais, nombre) VALUES ('CO', 'Colombia');
INSERT INTO Pais (idPais, nombre) VALUES ('AR', 'Argentina');
INSERT INTO Pais (idPais, nombre) VALUES ('ES', 'España');
INSERT INTO Pais (idPais, nombre) VALUES ('MX', 'México');
INSERT INTO Pais (idPais, nombre) VALUES ('PE', 'Perú');
INSERT INTO Pais (idPais, nombre) VALUES ('US', 'Estados Unidos');
INSERT INTO Pais (idPais, nombre) VALUES ('FR', 'Francia');
INSERT INTO Pais (idPais, nombre) VALUES ('BR', 'Brasil');

-- ======================================================================
-- 2. DEPARTAMENTO
--    Id = código ISO 3166-2 (país-subdivisión)
-- ======================================================================
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('CO-ANT', 'Antioquia', 'CO');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('CO-DC', 'Bogotá D.C.', 'CO');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('CO-QUI', 'Quindío', 'CO');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('CO-VAC', 'Valle del Cauca', 'CO');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('CO-BOL', 'Bolívar', 'CO');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('CO-CAL', 'Caldas', 'CO');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('CO-RIS', 'Risaralda', 'CO');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('AR-C', 'Ciudad Autónoma de Buenos Aires', 'AR');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('AR-X', 'Córdoba', 'AR');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('ES-MD', 'Comunidad de Madrid', 'ES');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('ES-CT', 'Cataluña', 'ES');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('MX-CMX', 'Ciudad de México', 'MX');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('MX-JAL', 'Jalisco', 'MX');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('PE-LIM', 'Lima', 'PE');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('US-NY', 'Nueva York', 'US');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('US-FL', 'Florida', 'US');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('FR-IDF', 'Isla de Francia', 'FR');
INSERT INTO Departamento (idDepartamento, nombre, Pais_idPais) VALUES ('BR-RJ', 'Río de Janeiro', 'BR');

-- ======================================================================
-- 3. CIUDAD
--    Id = departamento + abreviatura de la ciudad
-- ======================================================================
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-ANT-MED', 'Medellín', 'CO-ANT');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-ANT-RNG', 'Rionegro', 'CO-ANT');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-ANT-JAR', 'Jardín', 'CO-ANT');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-DC-BOG', 'Bogotá', 'CO-DC');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-QUI-ARM', 'Armenia', 'CO-QUI');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-QUI-SAL', 'Salento', 'CO-QUI');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-QUI-FIL', 'Filandia', 'CO-QUI');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-VAC-CAL', 'Cali', 'CO-VAC');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-VAC-PAL', 'Palmira', 'CO-VAC');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-BOL-CTG', 'Cartagena de Indias', 'CO-BOL');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-CAL-MAN', 'Manizales', 'CO-CAL');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('CO-RIS-PEI', 'Pereira', 'CO-RIS');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('AR-C-BUE', 'Buenos Aires', 'AR-C');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('AR-X-COR', 'Córdoba', 'AR-X');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('ES-MD-MAD', 'Madrid', 'ES-MD');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('ES-CT-BCN', 'Barcelona', 'ES-CT');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('MX-CMX-CDM', 'Ciudad de México', 'MX-CMX');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('MX-JAL-GDL', 'Guadalajara', 'MX-JAL');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('PE-LIM-LIM', 'Lima', 'PE-LIM');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('US-NY-NYC', 'Nueva York', 'US-NY');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('US-FL-MIA', 'Miami', 'US-FL');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('FR-IDF-PAR', 'París', 'FR-IDF');
INSERT INTO Ciudad (idCiudad, nombre, Departamento_idDepartamento) VALUES ('BR-RJ-RIO', 'Río de Janeiro', 'BR-RJ');

-- ======================================================================
-- 4. TIPODOCUMENTO
-- ======================================================================
INSERT INTO TipoDocumento (idTipoDocumento, nombre) VALUES (1, 'Cédula de ciudadanía');
INSERT INTO TipoDocumento (idTipoDocumento, nombre) VALUES (2, 'Cédula de extranjería');
INSERT INTO TipoDocumento (idTipoDocumento, nombre) VALUES (3, 'Pasaporte');
INSERT INTO TipoDocumento (idTipoDocumento, nombre) VALUES (4, 'Tarjeta de identidad');
INSERT INTO TipoDocumento (idTipoDocumento, nombre) VALUES (5, 'Permiso por Protección Temporal');

-- ======================================================================
-- 5. ESTADO
--    Compartido por Orden y Reserva
-- ======================================================================
INSERT INTO Estado (idEstado, nombre, descripcion) VALUES (1, 'Pendiente', 'Registrada, aún no confirmada ni en proceso');
INSERT INTO Estado (idEstado, nombre, descripcion) VALUES (2, 'Confirmada', 'Reserva confirmada por el restaurante');
INSERT INTO Estado (idEstado, nombre, descripcion) VALUES (3, 'En preparación', 'La cocina está preparando la orden');
INSERT INTO Estado (idEstado, nombre, descripcion) VALUES (4, 'En camino', 'El domicilio salió hacia el cliente');
INSERT INTO Estado (idEstado, nombre, descripcion) VALUES (5, 'Entregada', 'Domicilio entregado al cliente');
INSERT INTO Estado (idEstado, nombre, descripcion) VALUES (6, 'Completada', 'Orden servida y pagada, o reserva cumplida');
INSERT INTO Estado (idEstado, nombre, descripcion) VALUES (7, 'Cancelada', 'Cancelada por el cliente o el restaurante');
INSERT INTO Estado (idEstado, nombre, descripcion) VALUES (8, 'No asistió', 'El cliente no se presentó a la reserva');

-- ======================================================================
-- 6. IDIOMA
-- ======================================================================
INSERT INTO Idioma (idIdioma, nombreIdioma) VALUES (1, 'Español');
INSERT INTO Idioma (idIdioma, nombreIdioma) VALUES (2, 'Inglés');
INSERT INTO Idioma (idIdioma, nombreIdioma) VALUES (3, 'Francés');
INSERT INTO Idioma (idIdioma, nombreIdioma) VALUES (4, 'Portugués');
INSERT INTO Idioma (idIdioma, nombreIdioma) VALUES (5, 'Alemán');
INSERT INTO Idioma (idIdioma, nombreIdioma) VALUES (6, 'Italiano');

-- ======================================================================
-- 7. METODOPAGO
-- ======================================================================
INSERT INTO MetodoPago (idMetodoPago, nombre) VALUES (1, 'Efectivo');
INSERT INTO MetodoPago (idMetodoPago, nombre) VALUES (2, 'Tarjeta de crédito');
INSERT INTO MetodoPago (idMetodoPago, nombre) VALUES (3, 'Tarjeta débito');
INSERT INTO MetodoPago (idMetodoPago, nombre) VALUES (4, 'Nequi');
INSERT INTO MetodoPago (idMetodoPago, nombre) VALUES (5, 'Transferencia bancaria');

-- ======================================================================
-- 8. PETICIONESPECIAL
-- ======================================================================
INSERT INTO PeticionEspecial (idPeticion, nombre, descripcion) VALUES (1, 'Silla para bebé', 'Silla alta para niños pequeños');
INSERT INTO PeticionEspecial (idPeticion, nombre, descripcion) VALUES (2, 'Decoración de cumpleaños', 'Globos y postre con vela para el homenajeado');
INSERT INTO PeticionEspecial (idPeticion, nombre, descripcion) VALUES (3, 'Mesa con vista', 'Ubicación en terraza o junto a la ventana');
INSERT INTO PeticionEspecial (idPeticion, nombre, descripcion) VALUES (4, 'Menú sin gluten', 'Preparaciones aptas para celíacos');
INSERT INTO PeticionEspecial (idPeticion, nombre, descripcion) VALUES (5, 'Acceso para silla de ruedas', 'Mesa accesible y sin escalones');
INSERT INTO PeticionEspecial (idPeticion, nombre, descripcion) VALUES (6, 'Celebración de aniversario', 'Ambientación romántica y brindis de cortesía');

-- ======================================================================
-- 9. RESTAURANTE
--    horaApertura / horaCierre: consultar con TO_CHAR(col,'HH24:MI')
-- ======================================================================
INSERT INTO Restaurante (idRestaurante, nit, nombre, direccion, categoriaCocina, horaApertura, horaCierre, Ciudad_idCiudad) VALUES (1, '900123451-1', 'El Fogón Cafetero', 'Calle Real # 6-15', 'Típica cafetera', TO_DATE('07:00','HH24:MI'), TO_DATE('21:00','HH24:MI'), 'CO-QUI-SAL');
INSERT INTO Restaurante (idRestaurante, nit, nombre, direccion, categoriaCocina, horaApertura, horaCierre, Ciudad_idCiudad) VALUES (2, '900123452-2', 'Mar y Murallas', 'Calle del Arsenal # 9-40', 'Caribeña y mariscos', TO_DATE('12:00','HH24:MI'), TO_DATE('23:00','HH24:MI'), 'CO-BOL-CTG');
INSERT INTO Restaurante (idRestaurante, nit, nombre, direccion, categoriaCocina, horaApertura, horaCierre, Ciudad_idCiudad) VALUES (3, '900123453-3', 'Sabores de la Montaña', 'Carrera 70 # 44-21', 'Antioqueña tradicional', TO_DATE('11:00','HH24:MI'), TO_DATE('22:00','HH24:MI'), 'CO-ANT-MED');
INSERT INTO Restaurante (idRestaurante, nit, nombre, direccion, categoriaCocina, horaApertura, horaCierre, Ciudad_idCiudad) VALUES (4, '900123454-4', 'La Cosecha Andina', 'Carrera 4 # 12-35', 'Contemporánea colombiana', TO_DATE('12:00','HH24:MI'), TO_DATE('23:00','HH24:MI'), 'CO-DC-BOG');
INSERT INTO Restaurante (idRestaurante, nit, nombre, direccion, categoriaCocina, horaApertura, horaCierre, Ciudad_idCiudad) VALUES (5, '900123455-5', 'Raíces del Pacífico', 'Calle 3 Oeste # 2-60', 'Pacífica colombiana', TO_DATE('12:00','HH24:MI'), TO_DATE('22:00','HH24:MI'), 'CO-VAC-CAL');
INSERT INTO Restaurante (idRestaurante, nit, nombre, direccion, categoriaCocina, horaApertura, horaCierre, Ciudad_idCiudad) VALUES (6, '900123456-6', 'Mirador del Café', 'Carrera 6 # 7-30', 'Cafés de especialidad y postres', TO_DATE('08:00','HH24:MI'), TO_DATE('20:00','HH24:MI'), 'CO-QUI-FIL');

-- ======================================================================
-- 10. CARTAMENU (categorías de la carta)
-- ======================================================================
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (1, 'Entradas', 1);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (2, 'Platos fuertes', 1);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (3, 'Bebidas', 1);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (4, 'Entradas', 2);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (5, 'Mariscos', 2);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (6, 'Bebidas', 2);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (7, 'Platos típicos', 3);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (8, 'Postres', 3);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (9, 'Bebidas', 3);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (10, 'Entradas', 4);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (11, 'Platos fuertes', 4);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (12, 'Postres', 4);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (13, 'Platos fuertes', 5);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (14, 'Bebidas', 5);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (15, 'Cafés especiales', 6);
INSERT INTO CartaMenu (idCategoria, nombrecategoria, Restaurante_idRestaurante) VALUES (16, 'Postres', 6);

-- ======================================================================
-- 11. ITEMMENU
-- ======================================================================
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (1, 'Patacón con hogao', 'Plátano verde frito con salsa de tomate y cebolla', 1, 1, 12000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (2, 'Empanadas de pipián', 'Empanadas de papa y maní con ají casero', 1, 1, 10000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (3, 'Trucha a la plancha', 'Trucha de Salento con patacón y ensalada', 0, 2, 38000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (4, 'Bandeja cafetera', 'Frijoles, arroz, chicharrón, huevo, arepa y aguacate', 0, 2, 42000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (5, 'Sudado de pollo', 'Pollo en salsa criolla con papa y yuca', 0, 2, 30000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (6, 'Café de origen Quindío', 'Taza de café filtrado de finca local', 1, 3, 6000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (7, 'Aguapanela con limón', 'Bebida fría de panela y limón', 1, 3, 5000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (8, 'Arepa de huevo', 'Arepa frita rellena de huevo y carne molida', 0, 4, 9000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (9, 'Ceviche de camarón', 'Camarón en limón con salsa rosada y galletas', 0, 4, 28000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (10, 'Cazuela de mariscos', 'Mariscos en crema de coco con arroz', 0, 5, 52000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (11, 'Pargo rojo frito', 'Pargo entero con arroz de coco y patacón', 0, 5, 58000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (12, 'Limonada de coco', 'Limonada frappé con crema de coco', 1, 6, 12000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (13, 'Jugo de corozo', 'Jugo de fruta de corozo en agua', 1, 6, 9000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (14, 'Bandeja paisa', 'Plato tradicional antioqueño completo', 0, 7, 45000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (15, 'Mondongo antioqueño', 'Sopa de callo con papa, yuca y chorizo', 0, 7, 32000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (16, 'Frijoles vegetarianos', 'Frijoles rojos con arepa, aguacate y maduro', 1, 7, 26000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (17, 'Postre de natas', 'Postre tradicional de leche y natas', 1, 8, 14000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (18, 'Brevas con arequipe', 'Brevas en almíbar con arequipe y queso', 1, 8, 13000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (19, 'Mazamorra con panela', 'Maíz cocido con leche y panela', 1, 9, 7000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (20, 'Cerveza artesanal', 'Cerveza local tipo ale de 330 ml', 1, 9, 15000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (21, 'Changua', 'Caldo de leche con huevo, cilantro y calado', 1, 10, 16000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (22, 'Almojábanas con queso', 'Pan de queso y cuajada recién horneado', 1, 10, 9000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (23, 'Ajiaco santafereño', 'Sopa de tres papas, pollo, guascas, alcaparras y crema', 0, 11, 38000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (24, 'Lomo al café', 'Lomo de res en salsa de café con puré rústico', 0, 11, 56000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (25, 'Bowl de quinoa andina', 'Quinoa, vegetales asados y aderezo de uchuva', 1, 11, 34000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (26, 'Cuajada con melao', 'Cuajada fresca con melao de panela', 1, 12, 15000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (27, 'Encocado de pescado', 'Pescado en salsa de coco con arroz y patacón', 0, 13, 46000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (28, 'Sancocho de gallina', 'Sancocho valluno con gallina criolla', 0, 13, 35000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (29, 'Arroz atollado', 'Arroz cremoso con cerdo, pollo y chorizo', 0, 13, 33000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (30, 'Lulada', 'Bebida de lulo machacado con limón y hielo', 1, 14, 9000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (31, 'Champús', 'Bebida de maíz, lulo, piña y panela', 1, 14, 8000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (32, 'Café método V60', 'Café de especialidad filtrado en V60', 1, 15, 11000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (33, 'Capuchino de la casa', 'Espresso con leche texturizada', 1, 15, 9000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (34, 'Torta de café', 'Bizcocho húmedo de café con arequipe', 1, 16, 13000);
INSERT INTO ItemMenu (idItem, nombrItem, descripcionItem, vegetariano, CategoriaMenu_idCategoria, precio) VALUES (35, 'Obleas con arequipe', 'Obleas artesanales con arequipe y queso', 1, 16, 8000);

-- ======================================================================
-- 12. MESA
--    3 mesas por restaurante (capacidad 2, 4 y 6)
-- ======================================================================
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (1, 1, 2, 1, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (2, 2, 4, 1, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (3, 3, 6, 1, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (1, 4, 2, 2, 0);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (2, 5, 4, 2, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (3, 6, 6, 2, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (1, 7, 2, 3, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (2, 8, 4, 3, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (3, 9, 6, 3, 0);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (1, 10, 2, 4, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (2, 11, 4, 4, 0);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (3, 12, 6, 4, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (1, 13, 2, 5, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (2, 14, 4, 5, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (3, 15, 6, 5, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (1, 16, 2, 6, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (2, 17, 4, 6, 1);
INSERT INTO Mesa (numeroMesa, idMesa, capacidad, Restaurante_idRestaurante, disponibilidad) VALUES (3, 18, 6, 6, 1);

-- ======================================================================
-- 13. EXPERIENCIATURISTICA
--    duracion en horas
-- ======================================================================
INSERT INTO ExperienciaTuristica (idExperiencia, nombreExperiencia, descripcion, precioPorPersona, duracion, Restaurante_idRestaurante) VALUES (1, 'Tour de café y cata', 'Recorrido por finca cafetera con cata de tres variedades', 85000, 3, 1);
INSERT INTO ExperienciaTuristica (idExperiencia, nombreExperiencia, descripcion, precioPorPersona, duracion, Restaurante_idRestaurante) VALUES (2, 'Clase de cocina cafetera', 'Aprende a preparar trucha y patacón con el chef', 120000, 2.5, 1);
INSERT INTO ExperienciaTuristica (idExperiencia, nombreExperiencia, descripcion, precioPorPersona, duracion, Restaurante_idRestaurante) VALUES (3, 'Taller de cocina caribeña', 'Preparación de ceviche y arroz de coco', 150000, 3, 2);
INSERT INTO ExperienciaTuristica (idExperiencia, nombreExperiencia, descripcion, precioPorPersona, duracion, Restaurante_idRestaurante) VALUES (4, 'Ruta gastronómica amurallada', 'Caminata por el centro histórico probando comida local', 110000, 2, 2);
INSERT INTO ExperienciaTuristica (idExperiencia, nombreExperiencia, descripcion, precioPorPersona, duracion, Restaurante_idRestaurante) VALUES (5, 'Cata de cervezas artesanales', 'Degustación guiada de cinco cervezas antioqueñas', 70000, 1.5, 3);
INSERT INTO ExperienciaTuristica (idExperiencia, nombreExperiencia, descripcion, precioPorPersona, duracion, Restaurante_idRestaurante) VALUES (6, 'Mercado y cocina bogotana', 'Visita a plaza de mercado y clase de ajiaco', 130000, 4, 4);
INSERT INTO ExperienciaTuristica (idExperiencia, nombreExperiencia, descripcion, precioPorPersona, duracion, Restaurante_idRestaurante) VALUES (7, 'Noche de sabores del Pacífico', 'Cena maridada con música de marimba en vivo', 95000, 2, 5);
INSERT INTO ExperienciaTuristica (idExperiencia, nombreExperiencia, descripcion, precioPorPersona, duracion, Restaurante_idRestaurante) VALUES (8, 'Barismo para principiantes', 'Taller de métodos de filtrado y arte latte', 90000, 2, 6);

-- ======================================================================
-- 14. CLIENTE
-- ======================================================================
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('1094950001', 'Santiago', 'Ríos', 'santiago.rios@gmail.com', '+57 3104567801', 'CO', 1);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('1032450002', 'Daniela', 'Torres', 'daniela.torres@hotmail.com', '+57 3157894502', 'CO', 1);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('549871236', 'John', 'Smith', 'john.smith@gmail.com', '+1 2125550103', 'US', 3);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('587412369', 'Emma', 'Johnson', 'emma.johnson@yahoo.com', '+1 3055550104', 'US', 3);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('PAB458712', 'Lucía', 'Fernández', 'lucia.fernandez@gmail.com', '+34 612345105', 'ES', 3);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('AAE987654', 'Martín', 'González', 'martin.gonzalez@gmail.com', '+54 91145670106', 'AR', 3);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('18AB45879', 'Camille', 'Dubois', 'camille.dubois@orange.fr', '+33 612340107', 'FR', 3);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('G45871236', 'Diego', 'Hernández', 'diego.hernandez@gmail.com', '+52 5512340108', 'MX', 3);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('FZ458712', 'Ana', 'Souza', 'ana.souza@gmail.com', '+55 21987650109', 'BR', 3);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('1144880010', 'Andrea', 'Valencia', 'andrea.valencia@gmail.com', '+57 3012345010', 'CO', 1);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('1017880011', 'Felipe', 'Moreno', 'felipe.moreno@outlook.com', '+57 3204567011', 'CO', 1);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('CE987452', 'Sofía', 'Quispe', 'sofia.quispe@gmail.com', '+57 3187654012', 'PE', 2);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('PE4587123', 'Carlos', 'Mendoza', 'carlos.mendoza@gmail.com', '+51 987650113', 'PE', 3);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('1094880014', 'Juliana', 'Cárdenas', 'juliana.cardenas@gmail.com', '+57 3112345014', 'CO', 1);
INSERT INTO Cliente (numeroDocumento, Nombre, apellido, email, telefono, paisOrigen, TipoDocumento_idTipoDocumento) VALUES ('585471239', 'Michael', 'Brown', 'michael.brown@gmail.com', '+1 4155550115', 'US', 3);

-- ======================================================================
-- 15. PERSONAL (supertipo)
--    Cada restaurante tiene administrador, chef, mesero(s) y repartidor
-- ======================================================================
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1094880101', 'Carlos', 'Ramírez', '+57 3101110101', 'Calle 5 # 3-10, Salento', 'carlos.ramirez@fogoncafetero.co', TO_DATE('2019-03-01','YYYY-MM-DD'), 1, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1094880102', 'Luisa', 'Giraldo', '+57 3101110102', 'Carrera 4 # 8-22, Salento', 'luisa.giraldo@fogoncafetero.co', TO_DATE('2019-05-15','YYYY-MM-DD'), 1, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1094880103', 'Andrés', 'Ospina', '+57 3101110103', 'Calle 7 # 2-41, Salento', 'andres.ospina@fogoncafetero.co', TO_DATE('2021-02-10','YYYY-MM-DD'), 1, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1094880104', 'Valentina', 'Arango', '+57 3101110104', 'Carrera 6 # 5-12, Salento', 'valentina.arango@fogoncafetero.co', TO_DATE('2023-07-01','YYYY-MM-DD'), 1, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1094880105', 'Jhon', 'Cardona', '+57 3101110105', 'Barrio Alto, Salento', 'jhon.cardona@fogoncafetero.co', TO_DATE('2022-09-20','YYYY-MM-DD'), 1, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1047400201', 'Mariana', 'Pérez', '+57 3002220201', 'Bocagrande Cra 2 # 8-50, Cartagena', 'mariana.perez@marymurallas.co', TO_DATE('2018-01-15','YYYY-MM-DD'), 2, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1047400202', 'Rafael', 'Barrios', '+57 3002220202', 'Manga Calle 25 # 20-11, Cartagena', 'rafael.barrios@marymurallas.co', TO_DATE('2018-02-01','YYYY-MM-DD'), 2, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1047400203', 'Camila', 'Herrera', '+57 3002220203', 'Getsemaní Calle 30 # 9-15, Cartagena', 'camila.herrera@marymurallas.co', TO_DATE('2020-06-01','YYYY-MM-DD'), 2, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('CE458712', 'Luca', 'Bianchi', '+57 3002220204', 'Centro Calle 36 # 4-20, Cartagena', 'luca.bianchi@marymurallas.co', TO_DATE('2022-11-01','YYYY-MM-DD'), 2, 2);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1047400205', 'Kevin', 'Julio', '+57 3002220205', 'Olaya Herrera, Cartagena', 'kevin.julio@marymurallas.co', TO_DATE('2023-03-15','YYYY-MM-DD'), 2, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1017200301', 'Juan Pablo', 'Restrepo', '+57 3043330301', 'Laureles Cra 76 # 33-10, Medellín', 'juanpablo.restrepo@saboresmontana.co', TO_DATE('2017-08-01','YYYY-MM-DD'), 3, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1017200302', 'Natalia', 'Zapata', '+57 3043330302', 'Belén Calle 30 # 70-15, Medellín', 'natalia.zapata@saboresmontana.co', TO_DATE('2017-09-01','YYYY-MM-DD'), 3, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1017200303', 'Sebastián', 'Gómez', '+57 3043330303', 'Envigado Cra 43 # 38S-20', 'sebastian.gomez@saboresmontana.co', TO_DATE('2020-01-20','YYYY-MM-DD'), 3, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1017200304', 'Laura', 'Montoya', '+57 3043330304', 'Robledo Calle 65 # 80-12, Medellín', 'laura.montoya@saboresmontana.co', TO_DATE('2024-02-01','YYYY-MM-DD'), 3, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1017200305', 'Esteban', 'Muñoz', '+57 3043330305', 'Bello Cra 50 # 45-30', 'esteban.munoz@saboresmontana.co', TO_DATE('2021-05-10','YYYY-MM-DD'), 3, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('52400401', 'Diana', 'Rodríguez', '+57 3114440401', 'Chapinero Calle 60 # 9-40, Bogotá', 'diana.rodriguez@cosechaandina.co', TO_DATE('2016-04-01','YYYY-MM-DD'), 4, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('79400402', 'Felipe', 'Castro', '+57 3114440402', 'Teusaquillo Cra 17 # 39-10, Bogotá', 'felipe.castro@cosechaandina.co', TO_DATE('2016-04-15','YYYY-MM-DD'), 4, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1020400403', 'Sofía', 'Martínez', '+57 3114440403', 'La Candelaria Calle 12 # 3-25, Bogotá', 'sofia.martinez@cosechaandina.co', TO_DATE('2021-10-01','YYYY-MM-DD'), 4, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1020400404', 'Brayan', 'López', '+57 3114440404', 'Kennedy Calle 38S # 78-20, Bogotá', 'brayan.lopez@cosechaandina.co', TO_DATE('2022-01-15','YYYY-MM-DD'), 4, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('31500501', 'Gloria', 'Mosquera', '+57 3165550501', 'San Fernando Calle 5 # 34-10, Cali', 'gloria.mosquera@raicespacifico.co', TO_DATE('2019-07-01','YYYY-MM-DD'), 5, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('16500502', 'Hernán', 'Valencia', '+57 3165550502', 'San Antonio Cra 6 # 2-15, Cali', 'hernan.valencia@raicespacifico.co', TO_DATE('2019-07-15','YYYY-MM-DD'), 5, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1144500503', 'Yuliana', 'Riascos', '+57 3165550503', 'El Peñón Calle 2 # 4-30, Cali', 'yuliana.riascos@raicespacifico.co', TO_DATE('2022-03-01','YYYY-MM-DD'), 5, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1144500504', 'Wilmer', 'Caicedo', '+57 3165550504', 'Siloé, Cali', 'wilmer.caicedo@raicespacifico.co', TO_DATE('2023-01-10','YYYY-MM-DD'), 5, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1094600601', 'Paula', 'Quintero', '+57 3126660601', 'Calle 7 # 5-20, Filandia', 'paula.quintero@miradorcafe.co', TO_DATE('2020-02-01','YYYY-MM-DD'), 6, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1094600602', 'Mateo', 'Londoño', '+57 3126660602', 'Carrera 5 # 9-11, Filandia', 'mateo.londono@miradorcafe.co', TO_DATE('2020-02-15','YYYY-MM-DD'), 6, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1094600603', 'Sara', 'Vélez', '+57 3126660603', 'Calle 8 # 4-05, Filandia', 'sara.velez@miradorcafe.co', TO_DATE('2023-05-01','YYYY-MM-DD'), 6, 1);
INSERT INTO Personal (numeroDocumento, Nombre, apellido, telefono, direccion, email, fechaContratacion, Restaurante_idRestaurante, TipoDocumento_idTipoDocumento) VALUES ('1094600604', 'Miguel', 'Salazar', '+57 3126660604', 'Vereda Cruces, Filandia', 'miguel.salazar@miradorcafe.co', TO_DATE('2024-06-01','YYYY-MM-DD'), 6, 1);

-- ======================================================================
-- 16. ADMINISTRADOR (subtipo de Personal)
-- ======================================================================
INSERT INTO Administrador (Personal_numeroDocumento, aniosExperiencia) VALUES ('1094880101', 12);
INSERT INTO Administrador (Personal_numeroDocumento, aniosExperiencia) VALUES ('1047400201', 15);
INSERT INTO Administrador (Personal_numeroDocumento, aniosExperiencia) VALUES ('1017200301', 18);
INSERT INTO Administrador (Personal_numeroDocumento, aniosExperiencia) VALUES ('52400401', 20);
INSERT INTO Administrador (Personal_numeroDocumento, aniosExperiencia) VALUES ('31500501', 10);
INSERT INTO Administrador (Personal_numeroDocumento, aniosExperiencia) VALUES ('1094600601', 8);

-- ======================================================================
-- 17. CHEF (subtipo de Personal)
-- ======================================================================
INSERT INTO Chef (Personal_numeroDocumento, especialidad) VALUES ('1094880102', 'Cocina cafetera');
INSERT INTO Chef (Personal_numeroDocumento, especialidad) VALUES ('1047400202', 'Mariscos y cocina caribeña');
INSERT INTO Chef (Personal_numeroDocumento, especialidad) VALUES ('1017200302', 'Cocina antioqueña');
INSERT INTO Chef (Personal_numeroDocumento, especialidad) VALUES ('79400402', 'Cocina contemporánea');
INSERT INTO Chef (Personal_numeroDocumento, especialidad) VALUES ('16500502', 'Cocina del Pacífico');
INSERT INTO Chef (Personal_numeroDocumento, especialidad) VALUES ('1094600602', 'Repostería y barismo');

-- ======================================================================
-- 18. MESERO (subtipo de Personal)
-- ======================================================================
INSERT INTO Mesero (Personal_numeroDocumento, turno) VALUES ('1094880103', 'Mañana');
INSERT INTO Mesero (Personal_numeroDocumento, turno) VALUES ('1094880104', 'Tarde');
INSERT INTO Mesero (Personal_numeroDocumento, turno) VALUES ('1047400203', 'Noche');
INSERT INTO Mesero (Personal_numeroDocumento, turno) VALUES ('CE458712', 'Completo');
INSERT INTO Mesero (Personal_numeroDocumento, turno) VALUES ('1017200303', 'Tarde');
INSERT INTO Mesero (Personal_numeroDocumento, turno) VALUES ('1017200304', 'Noche');
INSERT INTO Mesero (Personal_numeroDocumento, turno) VALUES ('1020400403', 'Completo');
INSERT INTO Mesero (Personal_numeroDocumento, turno) VALUES ('1144500503', 'Noche');
INSERT INTO Mesero (Personal_numeroDocumento, turno) VALUES ('1094600603', 'Mañana');

-- ======================================================================
-- 19. REPARTIDOR (subtipo de Personal)
-- ======================================================================
INSERT INTO Repartidor (Personal_numeroDocumento, medioTransporte) VALUES ('1094880105', 'Motocicleta');
INSERT INTO Repartidor (Personal_numeroDocumento, medioTransporte) VALUES ('1047400205', 'Motocicleta');
INSERT INTO Repartidor (Personal_numeroDocumento, medioTransporte) VALUES ('1017200305', 'Bicicleta eléctrica');
INSERT INTO Repartidor (Personal_numeroDocumento, medioTransporte) VALUES ('1020400404', 'Bicicleta');
INSERT INTO Repartidor (Personal_numeroDocumento, medioTransporte) VALUES ('1144500504', 'Motocicleta');
INSERT INTO Repartidor (Personal_numeroDocumento, medioTransporte) VALUES ('1094600604', 'Motocicleta');

-- ======================================================================
-- 20. MESEROIDIOMA
-- ======================================================================
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1094880103', 1);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1094880103', 2);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1094880104', 1);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1094880104', 2);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1094880104', 4);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1047400203', 1);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1047400203', 2);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('CE458712', 1);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('CE458712', 6);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('CE458712', 2);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('CE458712', 3);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1017200303', 1);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1017200303', 2);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1017200304', 1);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1020400403', 1);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1020400403', 2);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1020400403', 3);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1144500503', 1);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1094600603', 1);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1094600603', 2);
INSERT INTO MeseroIdioma (Mesero_Personal_numeroDocumento, Idioma_idIdioma) VALUES ('1094600603', 5);

-- ======================================================================
-- 21. ORDEN (supertipo)
--    Órdenes 1-14 en restaurante, 15-22 a domicilio.
--    Estados: 6 Completada, 5 Entregada, 3 En preparación, 4 En camino, 1 Pendiente, 7 Cancelada
-- ======================================================================
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (1, '549871236', 282000, TO_DATE('2026-09-05 13:20','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (2, '1094950001', 80000, TO_DATE('2026-09-12 19:10','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (3, 'PAB458712', 372000, TO_DATE('2026-09-18 20:00','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (4, '18AB45879', 245000, TO_DATE('2026-09-25 13:30','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (5, '1017880011', 132000, TO_DATE('2026-10-02 12:45','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (6, 'AAE987654', 243000, TO_DATE('2026-10-03 20:15','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (7, '1032450002', 109000, TO_DATE('2026-10-08 13:00','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (8, '585471239', 236000, TO_DATE('2026-10-10 19:40','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (9, '1144880010', 300000, TO_DATE('2026-10-15 13:15','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (10, 'FZ458712', 228000, TO_DATE('2026-10-20 10:30','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (11, '587412369', 332000, TO_DATE('2026-10-24 12:30','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (12, 'PE4587123', 128000, TO_DATE('2026-11-01 21:00','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (13, 'G45871236', 58000, TO_DATE('2026-11-06 13:00','YYYY-MM-DD HH24:MI'), 3);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (14, 'CE987452', 70000, TO_DATE('2026-11-05 19:00','YYYY-MM-DD HH24:MI'), 7);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (15, '1094880014', 99000, TO_DATE('2026-09-14 19:30','YYYY-MM-DD HH24:MI'), 5);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (16, '1017880011', 92000, TO_DATE('2026-10-05 20:00','YYYY-MM-DD HH24:MI'), 5);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (17, '1032450002', 120000, TO_DATE('2026-10-12 13:10','YYYY-MM-DD HH24:MI'), 5);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (18, '1144880010', 101000, TO_DATE('2026-10-18 20:30','YYYY-MM-DD HH24:MI'), 5);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (19, 'PAB458712', 83000, TO_DATE('2026-09-20 21:15','YYYY-MM-DD HH24:MI'), 5);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (20, '1094950001', 46000, TO_DATE('2026-10-28 16:00','YYYY-MM-DD HH24:MI'), 5);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (21, '585471239', 98000, TO_DATE('2026-11-06 12:40','YYYY-MM-DD HH24:MI'), 4);
INSERT INTO Orden (idOrden, Cliente_numeroDocumento, total, fecha, Estado_idEstado) VALUES (22, '1094880014', 47000, TO_DATE('2026-11-06 16:50','YYYY-MM-DD HH24:MI'), 1);

-- ======================================================================
-- 22. ORDENRESTAURANTE (subtipo de Orden)
-- ======================================================================
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (1, '1094880103', 1);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (2, '1094880104', 2);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (3, '1047400203', 4);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (4, 'CE458712', 5);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (5, '1017200303', 7);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (6, '1017200304', 8);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (7, '1020400403', 10);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (8, '1020400403', 11);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (9, '1144500503', 13);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (10, '1094600603', 16);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (11, '1094880103', 3);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (12, 'CE458712', 6);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (13, '1017200303', 9);
INSERT INTO OrdenRestaurante (Orden_idOrden, Mesero_Personal_numeroDocumento, Mesa_idMesa) VALUES (14, '1144500503', 14);

-- ======================================================================
-- 23. ORDENDOMICILIO (subtipo de Orden)
-- ======================================================================
INSERT INTO OrdenDomicilio (direccionEntrega, Orden_idOrden, costoDomicilio, Repartidor_Personal_numeroDocumento) VALUES ('Calle 6 # 4-20, Salento', 15, 5000, '1094880105');
INSERT INTO OrdenDomicilio (direccionEntrega, Orden_idOrden, costoDomicilio, Repartidor_Personal_numeroDocumento) VALUES ('Cra 43A # 1-50, El Poblado, Medellín', 16, 7000, '1017200305');
INSERT INTO OrdenDomicilio (direccionEntrega, Orden_idOrden, costoDomicilio, Repartidor_Personal_numeroDocumento) VALUES ('Calle 85 # 11-53, Bogotá', 17, 8000, '1020400404');
INSERT INTO OrdenDomicilio (direccionEntrega, Orden_idOrden, costoDomicilio, Repartidor_Personal_numeroDocumento) VALUES ('Av. 6N # 23-45, Granada, Cali', 18, 6000, '1144500504');
INSERT INTO OrdenDomicilio (direccionEntrega, Orden_idOrden, costoDomicilio, Repartidor_Personal_numeroDocumento) VALUES ('Calle de la Factoría # 36-57, Centro, Cartagena', 19, 9000, '1047400205');
INSERT INTO OrdenDomicilio (direccionEntrega, Orden_idOrden, costoDomicilio, Repartidor_Personal_numeroDocumento) VALUES ('Cra 5 # 7-12, Filandia', 20, 4000, '1094600604');
INSERT INTO OrdenDomicilio (direccionEntrega, Orden_idOrden, costoDomicilio, Repartidor_Personal_numeroDocumento) VALUES ('Calle 93 # 15-51, Chicó, Bogotá', 21, 8000, '1020400404');
INSERT INTO OrdenDomicilio (direccionEntrega, Orden_idOrden, costoDomicilio, Repartidor_Personal_numeroDocumento) VALUES ('Calle 6 # 4-20, Salento', 22, 5000, '1094880105');

-- ======================================================================
-- 24. DETALLEORDEN
--    subTotal = cantidad * precio del ítem
-- ======================================================================
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (1, 1, 2, 24000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (3, 1, 2, 76000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (6, 1, 2, 12000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (2, 2, 1, 10000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (5, 2, 2, 60000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (7, 2, 2, 10000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (8, 3, 2, 18000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (10, 3, 1, 52000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (11, 3, 1, 58000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (12, 3, 2, 24000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (9, 4, 1, 28000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (11, 4, 1, 58000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (13, 4, 1, 9000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (14, 5, 2, 90000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (17, 5, 2, 28000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (19, 5, 2, 14000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (15, 6, 1, 32000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (16, 6, 1, 26000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (20, 6, 3, 45000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (22, 7, 2, 18000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (23, 7, 2, 76000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (26, 7, 1, 15000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (21, 8, 1, 16000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (24, 8, 1, 56000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (25, 8, 1, 34000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (27, 9, 2, 92000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (30, 9, 2, 18000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (32, 10, 2, 22000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (34, 10, 2, 26000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (4, 11, 1, 42000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (3, 11, 1, 38000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (6, 11, 2, 12000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (10, 12, 2, 104000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (12, 12, 2, 24000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (14, 13, 1, 45000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (18, 13, 1, 13000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (28, 14, 2, 70000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (4, 15, 2, 84000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (7, 15, 2, 10000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (14, 16, 1, 45000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (16, 16, 1, 26000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (17, 16, 1, 14000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (23, 17, 2, 76000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (22, 17, 4, 36000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (27, 18, 1, 46000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (29, 18, 1, 33000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (31, 18, 2, 16000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (9, 19, 2, 56000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (13, 19, 2, 18000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (33, 20, 2, 18000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (35, 20, 3, 24000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (24, 21, 1, 56000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (25, 21, 1, 34000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (1, 22, 1, 12000);
INSERT INTO DetalleOrden (ItemMenu_idItem, Orden_idOrden, cantidad, subTotal) VALUES (5, 22, 1, 30000);

-- ======================================================================
-- 25. DETALLEEXPERIENCIAORDEN
--    subtotal = asistentes * precioPorPersona
-- ======================================================================
INSERT INTO DetalleExperienciaOrden (subtotal, asistentes, ExperienciaTuristica_idExperiencia, Orden_idOrden, fechaProgramada) VALUES (170000, 2, 1, 1, TO_DATE('2026-09-06 09:00','YYYY-MM-DD HH24:MI'));
INSERT INTO DetalleExperienciaOrden (subtotal, asistentes, ExperienciaTuristica_idExperiencia, Orden_idOrden, fechaProgramada) VALUES (220000, 2, 4, 3, TO_DATE('2026-09-19 16:00','YYYY-MM-DD HH24:MI'));
INSERT INTO DetalleExperienciaOrden (subtotal, asistentes, ExperienciaTuristica_idExperiencia, Orden_idOrden, fechaProgramada) VALUES (150000, 1, 3, 4, TO_DATE('2026-09-26 10:00','YYYY-MM-DD HH24:MI'));
INSERT INTO DetalleExperienciaOrden (subtotal, asistentes, ExperienciaTuristica_idExperiencia, Orden_idOrden, fechaProgramada) VALUES (140000, 2, 5, 6, TO_DATE('2026-10-04 18:00','YYYY-MM-DD HH24:MI'));
INSERT INTO DetalleExperienciaOrden (subtotal, asistentes, ExperienciaTuristica_idExperiencia, Orden_idOrden, fechaProgramada) VALUES (130000, 1, 6, 8, TO_DATE('2026-10-11 08:00','YYYY-MM-DD HH24:MI'));
INSERT INTO DetalleExperienciaOrden (subtotal, asistentes, ExperienciaTuristica_idExperiencia, Orden_idOrden, fechaProgramada) VALUES (190000, 2, 7, 9, TO_DATE('2026-10-17 19:00','YYYY-MM-DD HH24:MI'));
INSERT INTO DetalleExperienciaOrden (subtotal, asistentes, ExperienciaTuristica_idExperiencia, Orden_idOrden, fechaProgramada) VALUES (180000, 2, 8, 10, TO_DATE('2026-10-20 15:00','YYYY-MM-DD HH24:MI'));
INSERT INTO DetalleExperienciaOrden (subtotal, asistentes, ExperienciaTuristica_idExperiencia, Orden_idOrden, fechaProgramada) VALUES (240000, 2, 2, 11, TO_DATE('2026-10-25 10:00','YYYY-MM-DD HH24:MI'));

-- ======================================================================
-- 26. PAGO
--    Solo órdenes completadas o entregadas. totalPagado = Orden.total
-- ======================================================================
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (1, 'COP', 282000, 22000, TO_DATE('2026-09-05 13:20','YYYY-MM-DD HH24:MI'), 1);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (2, 'COP', 80000, 0, TO_DATE('2026-09-12 19:10','YYYY-MM-DD HH24:MI'), 2);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (3, 'COP', 372000, 40000, TO_DATE('2026-09-18 20:00','YYYY-MM-DD HH24:MI'), 3);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (4, 'COP', 245000, 25000, TO_DATE('2026-09-25 13:30','YYYY-MM-DD HH24:MI'), 4);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (5, 'COP', 132000, 0, TO_DATE('2026-10-02 12:45','YYYY-MM-DD HH24:MI'), 5);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (6, 'COP', 243000, 20000, TO_DATE('2026-10-03 20:15','YYYY-MM-DD HH24:MI'), 6);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (7, 'COP', 109000, 0, TO_DATE('2026-10-08 13:00','YYYY-MM-DD HH24:MI'), 7);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (8, 'COP', 236000, 30000, TO_DATE('2026-10-10 19:40','YYYY-MM-DD HH24:MI'), 8);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (9, 'COP', 300000, 12000, TO_DATE('2026-10-15 13:15','YYYY-MM-DD HH24:MI'), 9);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (10, 'COP', 228000, 0, TO_DATE('2026-10-20 10:30','YYYY-MM-DD HH24:MI'), 10);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (11, 'COP', 332000, 35000, TO_DATE('2026-10-24 12:30','YYYY-MM-DD HH24:MI'), 11);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (12, 'COP', 128000, 15000, TO_DATE('2026-11-01 21:00','YYYY-MM-DD HH24:MI'), 12);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (13, 'COP', 99000, 0, TO_DATE('2026-09-14 19:30','YYYY-MM-DD HH24:MI'), 15);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (14, 'COP', 92000, 3000, TO_DATE('2026-10-05 20:00','YYYY-MM-DD HH24:MI'), 16);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (15, 'COP', 120000, 5000, TO_DATE('2026-10-12 13:10','YYYY-MM-DD HH24:MI'), 17);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (16, 'COP', 101000, 0, TO_DATE('2026-10-18 20:30','YYYY-MM-DD HH24:MI'), 18);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (17, 'COP', 83000, 4000, TO_DATE('2026-09-20 21:15','YYYY-MM-DD HH24:MI'), 19);
INSERT INTO Pago (idPago, monedaPago, totalPagado, propina, fechaPago, Orden_idOrden) VALUES (18, 'COP', 46000, 2000, TO_DATE('2026-10-28 16:00','YYYY-MM-DD HH24:MI'), 20);

-- ======================================================================
-- 27. PAGOMETODOPAGO
--    Los pagos 3 y 17 se dividieron en dos métodos
-- ======================================================================
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (1, 2);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (2, 1);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (3, 2);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (3, 1);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (4, 2);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (5, 4);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (6, 3);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (7, 1);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (8, 2);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (9, 4);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (10, 3);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (11, 2);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (12, 5);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (13, 1);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (14, 4);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (15, 3);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (15, 4);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (16, 1);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (17, 2);
INSERT INTO PagoMetodoPago (Pago_idPago, MetodoPago_idMetodoPago) VALUES (18, 4);

-- ======================================================================
-- 28. RESERVA
--    Estados: 1 Pendiente, 2 Confirmada, 6 Completada, 7 Cancelada, 8 No asistió
-- ======================================================================
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (1, TO_DATE('2026-09-05 13:00','YYYY-MM-DD HH24:MI'), 2, '549871236', 1, 6);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (2, TO_DATE('2026-09-18 19:30','YYYY-MM-DD HH24:MI'), 2, 'PAB458712', 2, 6);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (3, TO_DATE('2026-10-03 20:00','YYYY-MM-DD HH24:MI'), 4, 'AAE987654', 3, 6);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (4, TO_DATE('2026-10-10 19:30','YYYY-MM-DD HH24:MI'), 1, '585471239', 4, 6);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (5, TO_DATE('2026-10-20 10:00','YYYY-MM-DD HH24:MI'), 2, 'FZ458712', 6, 6);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (6, TO_DATE('2026-10-15 20:00','YYYY-MM-DD HH24:MI'), 6, '1017880011', 3, 8);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (7, TO_DATE('2026-10-30 19:00','YYYY-MM-DD HH24:MI'), 3, 'PE4587123', 2, 7);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (8, TO_DATE('2026-11-14 19:30','YYYY-MM-DD HH24:MI'), 4, '1094950001', 1, 2);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (9, TO_DATE('2026-11-20 20:00','YYYY-MM-DD HH24:MI'), 2, '18AB45879', 2, 2);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (10, TO_DATE('2026-11-28 13:00','YYYY-MM-DD HH24:MI'), 8, '1032450002', 4, 1);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (11, TO_DATE('2026-12-05 12:30','YYYY-MM-DD HH24:MI'), 5, '1094880014', 6, 1);
INSERT INTO Reserva (idReserva, fechaReserva, cantidadPersonas, Cliente_numeroDocumento, Restaurante_idRestaurante, Estado_idEstado) VALUES (12, TO_DATE('2026-12-24 20:00','YYYY-MM-DD HH24:MI'), 6, '1144880010', 5, 2);

-- ======================================================================
-- 29. RESERVAPETICIONESESP
-- ======================================================================
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (1, 3);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (2, 3);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (2, 6);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (3, 2);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (5, 3);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (6, 1);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (8, 2);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (8, 1);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (9, 6);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (10, 4);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (10, 5);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (12, 1);
INSERT INTO ReservaPeticionesEsp (Reserva_idReserva, PeticionEspecial_idPeticion) VALUES (12, 4);

-- ======================================================================
-- 30. RESENA
--    Puntuaciones de 1 a 5
-- ======================================================================
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (1, 5, 5, 'Excelente trucha y el tour de café fue increíble.', TO_DATE('2026-09-07','YYYY-MM-DD'), 1, '549871236');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (2, 4, 3, 'Buena sazón, pero el servicio fue algo demorado.', TO_DATE('2026-09-13','YYYY-MM-DD'), 1, '1094950001');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (3, 5, 4, 'La cazuela de mariscos es espectacular.', TO_DATE('2026-09-19','YYYY-MM-DD'), 2, 'PAB458712');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (4, 4, 5, 'Muy buena atención en francés, gracias Luca.', TO_DATE('2026-09-26','YYYY-MM-DD'), 2, '18AB45879');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (5, 5, 5, 'La mejor bandeja paisa de Medellín.', TO_DATE('2026-10-02','YYYY-MM-DD'), 3, '1017880011');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (6, 4, 3, 'Rica comida, pero el lugar estaba muy lleno.', TO_DATE('2026-10-04','YYYY-MM-DD'), 3, 'AAE987654');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (7, 5, 4, 'El ajiaco sabe como el de la abuela.', TO_DATE('2026-10-09','YYYY-MM-DD'), 4, '1032450002');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (8, 4, 5, 'Great food, the coffee steak was amazing.', TO_DATE('2026-10-11','YYYY-MM-DD'), 4, '585471239');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (9, 5, 5, 'El encocado de pescado es de otro nivel.', TO_DATE('2026-10-16','YYYY-MM-DD'), 5, '1144880010');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (10, 5, 5, 'Café de especialidad y una vista hermosa.', TO_DATE('2026-10-21','YYYY-MM-DD'), 6, 'FZ458712');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (11, 5, 4, 'Me encantó la clase de cocina con la chef.', TO_DATE('2026-10-26','YYYY-MM-DD'), 1, '587412369');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (12, 3, 4, 'Precios algo altos para el tamaño de la porción.', TO_DATE('2026-11-02','YYYY-MM-DD'), 2, 'PE4587123');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (13, 2, 2, 'Cancelaron mi pedido sin dar explicación.', TO_DATE('2026-11-05','YYYY-MM-DD'), 5, 'CE987452');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (14, 3, 3, 'El domicilio llegó frío.', TO_DATE('2026-10-12','YYYY-MM-DD'), 4, '1032450002');
INSERT INTO Resena (idResena, puntuacionComida, puntuacionServicio, comentario, fechaPublicacion, Restaurante_idRestaurante, Cliente_numeroDocumento) VALUES (15, 4, 5, 'Postres deliciosos, volveré pronto.', TO_DATE('2026-10-29','YYYY-MM-DD'), 6, '1094950001');

COMMIT;

-- ======================================================================
-- VERIFICACIÓN: cantidad de registros por tabla
-- ======================================================================
SELECT 'Pais' AS tabla, COUNT(*) AS registros FROM Pais
UNION ALL SELECT 'Departamento' AS tabla, COUNT(*) AS registros FROM Departamento
UNION ALL SELECT 'Ciudad' AS tabla, COUNT(*) AS registros FROM Ciudad
UNION ALL SELECT 'TipoDocumento' AS tabla, COUNT(*) AS registros FROM TipoDocumento
UNION ALL SELECT 'Estado' AS tabla, COUNT(*) AS registros FROM Estado
UNION ALL SELECT 'Idioma' AS tabla, COUNT(*) AS registros FROM Idioma
UNION ALL SELECT 'MetodoPago' AS tabla, COUNT(*) AS registros FROM MetodoPago
UNION ALL SELECT 'PeticionEspecial' AS tabla, COUNT(*) AS registros FROM PeticionEspecial
UNION ALL SELECT 'Restaurante' AS tabla, COUNT(*) AS registros FROM Restaurante
UNION ALL SELECT 'CartaMenu' AS tabla, COUNT(*) AS registros FROM CartaMenu
UNION ALL SELECT 'ItemMenu' AS tabla, COUNT(*) AS registros FROM ItemMenu
UNION ALL SELECT 'Mesa' AS tabla, COUNT(*) AS registros FROM Mesa
UNION ALL SELECT 'ExperienciaTuristica' AS tabla, COUNT(*) AS registros FROM ExperienciaTuristica
UNION ALL SELECT 'Cliente' AS tabla, COUNT(*) AS registros FROM Cliente
UNION ALL SELECT 'Personal' AS tabla, COUNT(*) AS registros FROM Personal
UNION ALL SELECT 'Administrador' AS tabla, COUNT(*) AS registros FROM Administrador
UNION ALL SELECT 'Chef' AS tabla, COUNT(*) AS registros FROM Chef
UNION ALL SELECT 'Mesero' AS tabla, COUNT(*) AS registros FROM Mesero
UNION ALL SELECT 'Repartidor' AS tabla, COUNT(*) AS registros FROM Repartidor
UNION ALL SELECT 'MeseroIdioma' AS tabla, COUNT(*) AS registros FROM MeseroIdioma
UNION ALL SELECT 'Orden' AS tabla, COUNT(*) AS registros FROM Orden
UNION ALL SELECT 'OrdenRestaurante' AS tabla, COUNT(*) AS registros FROM OrdenRestaurante
UNION ALL SELECT 'OrdenDomicilio' AS tabla, COUNT(*) AS registros FROM OrdenDomicilio
UNION ALL SELECT 'DetalleOrden' AS tabla, COUNT(*) AS registros FROM DetalleOrden
UNION ALL SELECT 'DetalleExperienciaOrden' AS tabla, COUNT(*) AS registros FROM DetalleExperienciaOrden
UNION ALL SELECT 'Pago' AS tabla, COUNT(*) AS registros FROM Pago
UNION ALL SELECT 'PagoMetodoPago' AS tabla, COUNT(*) AS registros FROM PagoMetodoPago
UNION ALL SELECT 'Reserva' AS tabla, COUNT(*) AS registros FROM Reserva
UNION ALL SELECT 'ReservaPeticionesEsp' AS tabla, COUNT(*) AS registros FROM ReservaPeticionesEsp
UNION ALL SELECT 'Resena' AS tabla, COUNT(*) AS registros FROM Resena;
