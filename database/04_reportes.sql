-- =====================================================================
-- SABOR & RUTA - 12 reportes (3 simples, 5 intermedios, 4 avanzados)
-- Mismo SQL que ejecuta la aplicación (shared/reportQueries.js).
-- En SQL Developer: al ejecutar (F5) pedirá :idRestaurante -> dejar en
-- blanco (NULL) para todas las sedes o escribir 1..6 para una sede.
-- =====================================================================

-- REPORTE SIMPLE 1: Catálogo de restaurantes (tabla Restaurante)
SELECT idRestaurante,
       nit,
       nombre,
       direccion,
       categoriaCocina,
       TO_CHAR(horaApertura, 'HH24:MI') AS apertura,
       TO_CHAR(horaCierre, 'HH24:MI')   AS cierre,
       Ciudad_idCiudad                  AS codigo_ciudad
FROM Restaurante
WHERE (:idRestaurante IS NULL OR idRestaurante = :idRestaurante)
ORDER BY nombre ASC;

-- REPORTE SIMPLE 2: Directorio de clientes por país de origen (tabla Cliente)
SELECT numeroDocumento,
       Nombre,
       apellido,
       email,
       telefono,
       paisOrigen
FROM Cliente
ORDER BY paisOrigen ASC, apellido ASC;

-- REPORTE SIMPLE 3: Portafolio de experiencias y tarifas (tabla ExperienciaTuristica)
SELECT idExperiencia,
       nombreExperiencia,
       descripcion,
       duracion                  AS duracion_horas,
       precioPorPersona,
       Restaurante_idRestaurante AS id_restaurante
FROM ExperienciaTuristica
WHERE (:idRestaurante IS NULL OR Restaurante_idRestaurante = :idRestaurante)
ORDER BY precioPorPersona DESC;

-- REPORTE INTERMEDIO 1: Ventas en salón por sede (JOIN + LEFT JOIN + GROUP BY + SUM)
SELECT r.idRestaurante,
       r.nombre                AS restaurante,
       c.nombre                AS ciudad,
       COUNT(o.idOrden)        AS total_pedidos,
       NVL(SUM(o.total), 0)    AS total_facturado
FROM Restaurante r
JOIN Ciudad c                 ON r.Ciudad_idCiudad = c.idCiudad
LEFT JOIN Mesa m              ON m.Restaurante_idRestaurante = r.idRestaurante
LEFT JOIN OrdenRestaurante ore ON ore.Mesa_idMesa = m.idMesa
LEFT JOIN Orden o             ON o.idOrden = ore.Orden_idOrden
                             AND o.Estado_idEstado <> 7
WHERE (:idRestaurante IS NULL OR r.idRestaurante = :idRestaurante)
GROUP BY r.idRestaurante, r.nombre, c.nombre
ORDER BY total_facturado DESC, r.idRestaurante;

-- REPORTE INTERMEDIO 2: Experiencias turísticas más demandadas (JOIN + GROUP BY + HAVING)
SELECT e.idExperiencia,
       e.nombreExperiencia,
       r.nombre                          AS restaurante_anfitrion,
       COUNT(DISTINCT deo.Orden_idOrden) AS ordenes,
       SUM(deo.asistentes)               AS total_turistas,
       SUM(deo.subtotal)                 AS ingreso_acumulado
FROM ExperienciaTuristica e
JOIN Restaurante r              ON e.Restaurante_idRestaurante = r.idRestaurante
JOIN DetalleExperienciaOrden deo ON deo.ExperienciaTuristica_idExperiencia = e.idExperiencia
WHERE (:idRestaurante IS NULL OR r.idRestaurante = :idRestaurante)
GROUP BY e.idExperiencia, e.nombreExperiencia, r.nombre
HAVING SUM(deo.asistentes) >= 1
ORDER BY total_turistas DESC, ingreso_acumulado DESC, e.idExperiencia;

-- REPORTE INTERMEDIO 3: Calificación de clientes por restaurante (JOIN + AVG + COUNT + HAVING)
SELECT r.nombre                                                   AS restaurante,
       r.categoriaCocina,
       ROUND(AVG(res.puntuacionComida), 2)                         AS prom_comida,
       ROUND(AVG(res.puntuacionServicio), 2)                       AS prom_servicio,
       ROUND(AVG((res.puntuacionComida + res.puntuacionServicio) / 2), 2) AS calificacion_global,
       COUNT(res.idResena)                                         AS total_opiniones
FROM Restaurante r
JOIN Resena res ON res.Restaurante_idRestaurante = r.idRestaurante
WHERE (:idRestaurante IS NULL OR r.idRestaurante = :idRestaurante)
GROUP BY r.nombre, r.categoriaCocina
HAVING COUNT(res.idResena) >= 1
ORDER BY calificacion_global DESC, r.nombre;

-- REPORTE INTERMEDIO 4: Gasto turístico por país de origen (JOIN + WHERE + GROUP BY + HAVING)
SELECT p.nombre                          AS pais,
       COUNT(DISTINCT c.numeroDocumento) AS total_turistas,
       COUNT(o.idOrden)                  AS total_pedidos,
       ROUND(AVG(o.total), 0)            AS ticket_promedio,
       SUM(o.total)                      AS gasto_acumulado
FROM Cliente c
JOIN Pais p  ON c.paisOrigen = p.idPais
JOIN Orden o ON o.Cliente_numeroDocumento = c.numeroDocumento
WHERE o.Estado_idEstado <> 7
GROUP BY p.nombre
HAVING SUM(o.total) >= 50000
ORDER BY gasto_acumulado DESC, p.nombre;

-- REPORTE INTERMEDIO 5: Ventas mes a mes por canal (JOIN + LEFT JOIN + CASE + GROUP BY)
SELECT TO_CHAR(o.fecha, 'YYYY-MM')                              AS mes,
       COUNT(o.idOrden)                                         AS total_ordenes,
       SUM(CASE WHEN od.Orden_idOrden IS NULL THEN 1 ELSE 0 END) AS ordenes_salon,
       SUM(CASE WHEN od.Orden_idOrden IS NOT NULL THEN 1 ELSE 0 END) AS ordenes_domicilio,
       ROUND(AVG(o.total), 0)                                   AS ticket_promedio,
       SUM(o.total)                                             AS ventas_mes
FROM Orden o
JOIN Estado e              ON e.idEstado = o.Estado_idEstado
LEFT JOIN OrdenDomicilio od ON od.Orden_idOrden = o.idOrden
WHERE e.nombre <> 'Cancelada'
GROUP BY TO_CHAR(o.fecha, 'YYYY-MM')
ORDER BY mes;

-- REPORTE AVANZADO 1: Sedes con ventas superiores al promedio por sede
-- Subconsulta escalar con agregado anidado AVG(SUM(...)) en SELECT y en HAVING
SELECT r.idRestaurante,
       r.nombre          AS restaurante,
       r.categoriaCocina,
       c.nombre          AS ciudad,
       COUNT(o.idOrden)  AS total_pedidos,
       SUM(o.total)      AS ventas_totales,
       (SELECT ROUND(AVG(SUM(o2.total)), 0)
          FROM Mesa m2
          JOIN OrdenRestaurante ore2 ON ore2.Mesa_idMesa = m2.idMesa
          JOIN Orden o2              ON o2.idOrden = ore2.Orden_idOrden
         WHERE o2.Estado_idEstado <> 7
         GROUP BY m2.Restaurante_idRestaurante) AS promedio_por_sede
FROM Restaurante r
JOIN Ciudad c              ON r.Ciudad_idCiudad = c.idCiudad
JOIN Mesa m                ON m.Restaurante_idRestaurante = r.idRestaurante
JOIN OrdenRestaurante ore  ON ore.Mesa_idMesa = m.idMesa
JOIN Orden o               ON o.idOrden = ore.Orden_idOrden
WHERE o.Estado_idEstado <> 7
GROUP BY r.idRestaurante, r.nombre, r.categoriaCocina, c.nombre
HAVING SUM(o.total) > (
       -- Promedio de ventas en salón por sede (toda la plataforma)
       SELECT AVG(SUM(o3.total))
         FROM Mesa m3
         JOIN OrdenRestaurante ore3 ON ore3.Mesa_idMesa = m3.idMesa
         JOIN Orden o3              ON o3.idOrden = ore3.Orden_idOrden
        WHERE o3.Estado_idEstado <> 7
        GROUP BY m3.Restaurante_idRestaurante)
ORDER BY ventas_totales DESC, r.idRestaurante;

-- REPORTE AVANZADO 2: Clientes VIP (gasto superior al promedio por cliente)
-- Subconsulta correlacionada en SELECT + subconsulta en FROM dentro de HAVING
SELECT c.numeroDocumento,
       c.Nombre || ' ' || c.apellido AS cliente,
       c.email,
       c.paisOrigen,
       COUNT(o.idOrden)              AS total_ordenes,
       SUM(o.total)                  AS total_gastado,
       (SELECT NVL(SUM(deo.asistentes), 0)
          FROM DetalleExperienciaOrden deo
          JOIN Orden o2 ON o2.idOrden = deo.Orden_idOrden
         WHERE o2.Cliente_numeroDocumento = c.numeroDocumento) AS cupos_experiencias
FROM Cliente c
JOIN Orden o ON o.Cliente_numeroDocumento = c.numeroDocumento
WHERE o.Estado_idEstado <> 7
GROUP BY c.numeroDocumento, c.Nombre, c.apellido, c.email, c.paisOrigen
HAVING SUM(o.total) > (
       SELECT AVG(gasto_cliente)
         FROM (SELECT SUM(total) AS gasto_cliente
                 FROM Orden
                WHERE Estado_idEstado <> 7
                GROUP BY Cliente_numeroDocumento))
ORDER BY total_gastado DESC, c.numeroDocumento;

-- REPORTE AVANZADO 3: Platos con precio superior al promedio de su categoría
-- Subconsulta correlacionada en WHERE y en SELECT
SELECT im.idItem,
       im.nombrItem       AS plato_bebida,
       cm.nombrecategoria AS categoria,
       r.nombre           AS restaurante,
       im.precio,
       (SELECT ROUND(AVG(sub.precio), 0)
          FROM ItemMenu sub
         WHERE sub.CategoriaMenu_idCategoria = im.CategoriaMenu_idCategoria) AS precio_promedio_categoria,
       im.precio - (SELECT ROUND(AVG(sub2.precio), 0)
                      FROM ItemMenu sub2
                     WHERE sub2.CategoriaMenu_idCategoria = im.CategoriaMenu_idCategoria) AS sobreprecio_premium
FROM ItemMenu im
JOIN CartaMenu cm  ON im.CategoriaMenu_idCategoria = cm.idCategoria
JOIN Restaurante r ON cm.Restaurante_idRestaurante = r.idRestaurante
WHERE im.precio > (SELECT AVG(im_sub.precio)
                     FROM ItemMenu im_sub
                    WHERE im_sub.CategoriaMenu_idCategoria = im.CategoriaMenu_idCategoria)
  AND (:idRestaurante IS NULL OR r.idRestaurante = :idRestaurante)
ORDER BY sobreprecio_premium DESC, im.idItem;

-- REPORTE AVANZADO 4: Meseros bilingües con ventas >= al promedio de su sede
-- Subconsulta en SELECT + dos subconsultas correlacionadas en HAVING
SELECT p.numeroDocumento,
       p.Nombre || ' ' || p.apellido AS mesero,
       r.nombre                      AS restaurante_sede,
       m.turno,
       (SELECT COUNT(*)
          FROM MeseroIdioma mi
         WHERE mi.Mesero_Personal_numeroDocumento = p.numeroDocumento) AS idiomas_hablados,
       COUNT(ore.Orden_idOrden) AS ordenes_atendidas,
       SUM(o.total)             AS total_recaudado
FROM Personal p
JOIN Mesero m             ON m.Personal_numeroDocumento = p.numeroDocumento
JOIN Restaurante r        ON r.idRestaurante = p.Restaurante_idRestaurante
JOIN OrdenRestaurante ore ON ore.Mesero_Personal_numeroDocumento = m.Personal_numeroDocumento
JOIN Orden o              ON o.idOrden = ore.Orden_idOrden
WHERE o.Estado_idEstado <> 7
  AND (:idRestaurante IS NULL OR p.Restaurante_idRestaurante = :idRestaurante)
GROUP BY p.numeroDocumento, p.Nombre, p.apellido, r.nombre, m.turno, p.Restaurante_idRestaurante
HAVING SUM(o.total) >= (
       -- Promedio de recaudo por mesero dentro de la MISMA sede (correlacionada)
       SELECT AVG(SUM(o2.total))
         FROM Personal p2
         JOIN OrdenRestaurante ore2 ON ore2.Mesero_Personal_numeroDocumento = p2.numeroDocumento
         JOIN Orden o2              ON o2.idOrden = ore2.Orden_idOrden
        WHERE p2.Restaurante_idRestaurante = p.Restaurante_idRestaurante
          AND o2.Estado_idEstado <> 7
        GROUP BY p2.numeroDocumento)
   AND (SELECT COUNT(*)
          FROM MeseroIdioma mi2
         WHERE mi2.Mesero_Personal_numeroDocumento = p.numeroDocumento) >= 2
ORDER BY total_recaudado DESC, p.numeroDocumento;
