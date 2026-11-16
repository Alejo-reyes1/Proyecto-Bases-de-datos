import {
  Restaurante,
  Cliente,
  ExperienciaTuristica,
  Orden,
  CartaMenu,
  ItemMenu,
  Resena,
  Pais,
  Ciudad,
  Personal
} from '../types';

export interface ReportColumn {
  key: string;
  header: string;
  isCurrency?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface ReportSummaryItem {
  label: string;
  value: string | number;
}

export interface ReportContext {
  restaurantes: Restaurante[];
  clientes: Cliente[];
  experiencias: ExperienciaTuristica[];
  ordenes: Orden[];
  cartasMenu: CartaMenu[];
  itemsMenu: ItemMenu[];
  resenas: Resena[];
  paises: Pais[];
  ciudades: Ciudad[];
  personal: Personal[];
  filterRestauranteId?: number | null;
}

export interface ReportDefinition {
  id: number;
  category: 'Simple' | 'Intermedio' | 'Avanzado';
  title: string;
  subtitle: string;
  businessGoal: string;
  managementContext: string; // Trasfondo de negocio para gerentes
  sqlQuery: string;
  hasChart: boolean;
  chartType?: 'bar' | 'pie' | 'area';
  chartXKey?: string;
  chartYKey?: string;
  chartName?: string;
  columns: ReportColumn[];
  execute: (context: ReportContext) => {
    data: any[];
    summary: ReportSummaryItem[];
    activeRestauranteName: string;
  };
}

export const REPORTS: ReportDefinition[] = [
  // ==========================================
  // 1. REPORTES SIMPLES (1 sola tabla)
  // ==========================================
  {
    id: 1,
    category: 'Simple',
    title: 'Catálogo de Restaurantes y Horarios de Atención',
    subtitle: 'Consulta a la tabla Restaurante con ordenamiento alfabético',
    businessGoal: 'Permite a los operadores turísticos conocer la oferta gastronómica disponible, categorizada por tipo de cocina y franjas horarias de servicio.',
    managementContext: 'Auditoría de horarios y cobertura horaria para turistas matutinos (desayunos cafeteros) y nocturnos.',
    sqlQuery: `-- REPORTE SIMPLE 1: Consulta a una sola tabla (Restaurante)
SELECT 
    idRestaurante,
    nit,
    nombre,
    direccion,
    categoriaCocina,
    TO_CHAR(horaApertura, 'HH24:MI') AS apertura,
    TO_CHAR(horaCierre, 'HH24:MI') AS cierre,
    Ciudad_idCiudad AS codigo_ciudad
FROM Restaurante
WHERE (:idRestaurante IS NULL OR idRestaurante = :idRestaurante)
ORDER BY nombre ASC;`,
    hasChart: false,
    columns: [
      { key: 'idRestaurante', header: 'ID', align: 'center' },
      { key: 'nit', header: 'NIT' },
      { key: 'nombre', header: 'Restaurante' },
      { key: 'categoriaCocina', header: 'Especialidad Culinaria' },
      { key: 'direccion', header: 'Dirección' },
      { key: 'horario', header: 'Horario Operativo', align: 'center' },
      { key: 'Ciudad_idCiudad', header: 'Cód. Ciudad', align: 'center' },
    ],
    execute: ({ restaurantes, filterRestauranteId }) => {
      const activeRest = filterRestauranteId ? restaurantes.find(r => r.idRestaurante === filterRestauranteId) : null;
      const targetRestaurantes = filterRestauranteId
        ? restaurantes.filter(r => r.idRestaurante === filterRestauranteId)
        : restaurantes;

      const data = targetRestaurantes.map(r => ({
        idRestaurante: r.idRestaurante,
        nit: r.nit,
        nombre: r.nombre,
        categoriaCocina: r.categoriaCocina,
        direccion: r.direccion,
        horario: `${r.horaApertura} - ${r.horaCierre}`,
        Ciudad_idCiudad: r.Ciudad_idCiudad
      }));

      return {
        data,
        activeRestauranteName: activeRest ? activeRest.nombre : 'Consolidado Nacional (Todas las Sedes)',
        summary: [
          { label: 'Sedes Auditadas', value: data.length },
          { label: 'Cocinas Distintas', value: new Set(data.map(r => r.categoriaCocina)).size }
        ]
      };
    }
  },

  {
    id: 2,
    category: 'Simple',
    title: 'Directorio de Turistas Registrados por País de Origen',
    subtitle: 'Consulta a la tabla Cliente filtrando por procedencia',
    businessGoal: 'Identificar el flujo de viajeros nacionales e internacionales para orientar campañas de fidelización y estrategias de marketing turístico.',
    managementContext: 'Mapeo de la afluencia turística internacional para optimizar señalética bilingüe y cartas multilingües.',
    sqlQuery: `-- REPORTE SIMPLE 2: Consulta a una sola tabla (Cliente)
SELECT 
    numeroDocumento,
    Nombre,
    apellido,
    email,
    telefono,
    paisOrigen
FROM Cliente
ORDER BY paisOrigen ASC, apellido ASC;`,
    hasChart: false,
    columns: [
      { key: 'numeroDocumento', header: 'Identificación' },
      { key: 'nombreCompleto', header: 'Turista / Cliente' },
      { key: 'paisOrigen', header: 'País Origen', align: 'center' },
      { key: 'email', header: 'Correo Electrónico' },
      { key: 'telefono', header: 'Teléfono Móvil' }
    ],
    execute: ({ clientes }) => {
      const data = clientes.map(c => ({
        numeroDocumento: c.numeroDocumento,
        nombreCompleto: `${c.Nombre} ${c.apellido}`,
        paisOrigen: c.paisOrigen,
        email: c.email,
        telefono: c.telefono
      }));
      const internacionales = clientes.filter(c => c.paisOrigen !== 'CO').length;
      return {
        data,
        activeRestauranteName: 'Padrón Central de Turistas',
        summary: [
          { label: 'Total Turistas Registrados', value: data.length },
          { label: 'Extranjeros', value: internacionales },
          { label: 'Locales (Colombia)', value: data.length - internacionales }
        ]
      };
    }
  },

  {
    id: 3,
    category: 'Simple',
    title: 'Portafolio de Experiencias Gastronómicas y Tarifas Vigentes',
    subtitle: 'Consulta a la tabla ExperienciaTuristica ordenado por tarifa',
    businessGoal: 'Monitorear la cartera de tours, catas y talleres culinarios activos junto con su duración e impacto tarifario por comensal.',
    managementContext: 'Rentabilidad de tours temáticos por hora de servicio para el restaurante organizador.',
    sqlQuery: `-- REPORTE SIMPLE 3: Consulta a una sola tabla (ExperienciaTuristica)
SELECT 
    idExperiencia,
    nombreExperiencia,
    duracion AS duracion_horas,
    precioPorPersona,
    Restaurante_idRestaurante AS id_restaurante
FROM ExperienciaTuristica
WHERE (:idRestaurante IS NULL OR Restaurante_idRestaurante = :idRestaurante)
ORDER BY precioPorPersona DESC;`,
    hasChart: false,
    columns: [
      { key: 'idExperiencia', header: 'ID', align: 'center' },
      { key: 'nombreExperiencia', header: 'Experiencia Turística' },
      { key: 'duracion', header: 'Duración (Horas)', align: 'center' },
      { key: 'precioPorPersona', header: 'Precio por Turista', isCurrency: true, align: 'right' },
      { key: 'Restaurante_idRestaurante', header: 'Sede Restaurante', align: 'center' }
    ],
    execute: ({ experiencias, restaurantes, filterRestauranteId }) => {
      const activeRest = filterRestauranteId ? restaurantes.find(r => r.idRestaurante === filterRestauranteId) : null;
      const filtered = filterRestauranteId
        ? experiencias.filter(e => e.Restaurante_idRestaurante === filterRestauranteId)
        : experiencias;

      const data = filtered.map(e => ({
        idExperiencia: e.idExperiencia,
        nombreExperiencia: e.nombreExperiencia,
        duracion: `${e.duracion} hrs`,
        precioPorPersona: e.precioPorPersona,
        Restaurante_idRestaurante: activeRest?.nombre || `Sede #${e.Restaurante_idRestaurante}`
      }));

      const avgPrice = data.length ? Math.round(data.reduce((s, x) => s + x.precioPorPersona, 0) / data.length) : 0;
      return {
        data,
        activeRestauranteName: activeRest ? activeRest.nombre : 'Consolidado Nacional de Tours',
        summary: [
          { label: 'Experiencias Ofrecidas', value: data.length },
          { label: 'Tarifa Media', value: `$${avgPrice.toLocaleString('es-CO')} COP` }
        ]
      };
    }
  },

  // ==========================================
  // 2. REPORTES INTERMEDIOS (GROUP BY, HAVING, WHERE, JOINs)
  // ==========================================
  {
    id: 4,
    category: 'Intermedio',
    title: 'Facturación y Ventas Totales por Sede (Bonificación Gráfica)',
    subtitle: 'Consulta multitabla (Restaurante, Mesa, OrdenRestaurante, Orden) con GROUP BY y SUM',
    businessGoal: 'Evaluar el rendimiento comercial de la sede gastronómica para liquidación contable y análisis de rentabilidad turística.',
    managementContext: 'Control gerencial de recaudación por mesas y órdenes de delivery en destinos turísticos.',
    sqlQuery: `-- REPORTE INTERMEDIO 1: Multitabla con GROUP BY, SUM y JOIN
SELECT 
    r.idRestaurante,
    r.nombre AS restaurante,
    c.nombre AS ciudad,
    COUNT(o.idOrden) AS total_pedidos,
    NVL(SUM(o.total), 0) AS total_facturado
FROM Restaurante r
JOIN Ciudad c ON r.Ciudad_idCiudad = c.idCiudad
LEFT JOIN Mesa m ON r.idRestaurante = m.Restaurante_idRestaurante
LEFT JOIN OrdenRestaurante ore ON m.idMesa = ore.Mesa_idMesa
LEFT JOIN Orden o ON ore.Orden_idOrden = o.idOrden
WHERE (:idRestaurante IS NULL OR r.idRestaurante = :idRestaurante)
GROUP BY r.idRestaurante, r.nombre, c.nombre
ORDER BY total_facturado DESC;`,
    hasChart: true,
    chartType: 'bar',
    chartXKey: 'restaurante',
    chartYKey: 'total_facturado',
    chartName: 'Ventas Totales ($ COP)',
    columns: [
      { key: 'restaurante', header: 'Restaurante' },
      { key: 'ciudad', header: 'Ciudad Destino' },
      { key: 'total_pedidos', header: 'Órdenes Atendidas', align: 'center' },
      { key: 'total_facturado', header: 'Facturación Consolidada', isCurrency: true, align: 'right' }
    ],
    execute: ({ restaurantes, ordenes, ciudades, filterRestauranteId }) => {
      const activeRest = filterRestauranteId ? restaurantes.find(r => r.idRestaurante === filterRestauranteId) : null;
      const targetRestaurantes = filterRestauranteId
        ? restaurantes.filter(r => r.idRestaurante === filterRestauranteId)
        : restaurantes;

      const data = targetRestaurantes.map(r => {
        const ciudad = ciudades.find(c => c.idCiudad === r.Ciudad_idCiudad)?.nombre || r.Ciudad_idCiudad;
        let totalFacturado = 0;
        let totalPedidos = 0;

        ordenes.forEach(o => {
          const isLinked = (r.idRestaurante === 1 && [1, 2, 7].includes(o.idOrden)) ||
                           (r.idRestaurante === 2 && [2, 8].includes(o.idOrden)) ||
                           (r.idRestaurante === 3 && [3, 9].includes(o.idOrden)) ||
                           (r.idRestaurante === 4 && [4, 10].includes(o.idOrden)) ||
                           (r.idRestaurante === 5 && [5, 11].includes(o.idOrden)) ||
                           (r.idRestaurante === 6 && [6, 12].includes(o.idOrden));
          if (isLinked) {
            totalPedidos++;
            totalFacturado += o.total;
          }
        });

        return {
          idRestaurante: r.idRestaurante,
          restaurante: r.nombre,
          ciudad,
          total_pedidos: totalPedidos,
          total_facturado: totalFacturado
        };
      }).sort((a, b) => b.total_facturado - a.total_facturado);

      const granTotal = data.reduce((s, d) => s + d.total_facturado, 0);
      return {
        data,
        activeRestauranteName: activeRest ? activeRest.nombre : 'Consolidado Nacional (Todas las Sedes)',
        summary: [
          { label: 'Facturación Total', value: `$${granTotal.toLocaleString('es-CO')} COP` },
          { label: 'Sede Principal', value: data[0]?.restaurante || 'N/A' }
        ]
      };
    }
  },

  {
    id: 5,
    category: 'Intermedio',
    title: 'Top Experiencias Turísticas más Demandadas (Bonificación Gráfica)',
    subtitle: 'Consulta multitabla (ExperienciaTuristica, DetalleExperienciaOrden, Restaurante) con GROUP BY y HAVING',
    businessGoal: 'Detectar qué tours y talleres generan mayor flujo de turistas y mayores ingresos para ampliar cupos y calendarización.',
    managementContext: 'Planificación de guías bilingües y compra anticipada de insumos según asistencia a talleres culinarios.',
    sqlQuery: `-- REPORTE INTERMEDIO 2: Multitabla con GROUP BY, HAVING y SUM
SELECT 
    e.nombreExperiencia,
    r.nombre AS restaurante_anfitrion,
    SUM(deo.asistentes) AS total_turistas,
    SUM(deo.subtotal) AS ingreso_acumulado
FROM ExperienciaTuristica e
JOIN Restaurante r ON e.Restaurante_idRestaurante = r.idRestaurante
JOIN DetalleExperienciaOrden deo ON e.idExperiencia = deo.ExperienciaTuristica_idExperiencia
WHERE (:idRestaurante IS NULL OR r.idRestaurante = :idRestaurante)
GROUP BY e.nombreExperiencia, r.nombre
HAVING SUM(deo.asistentes) >= 1
ORDER BY total_turistas DESC;`,
    hasChart: true,
    chartType: 'pie',
    chartXKey: 'nombreExperiencia',
    chartYKey: 'total_turistas',
    chartName: 'Turistas por Experiencia',
    columns: [
      { key: 'nombreExperiencia', header: 'Experiencia Turística' },
      { key: 'restaurante_anfitrion', header: 'Restaurante Anfitrión' },
      { key: 'total_turistas', header: 'Turistas Asistentes', align: 'center' },
      { key: 'ingreso_acumulado', header: 'Ingreso Generado', isCurrency: true, align: 'right' }
    ],
    execute: ({ experiencias, restaurantes, ordenes, filterRestauranteId }) => {
      const activeRest = filterRestauranteId ? restaurantes.find(r => r.idRestaurante === filterRestauranteId) : null;
      const targetExperiencias = filterRestauranteId
        ? experiencias.filter(e => e.Restaurante_idRestaurante === filterRestauranteId)
        : experiencias;

      const data = targetExperiencias.map(e => {
        const rest = restaurantes.find(r => r.idRestaurante === e.Restaurante_idRestaurante)?.nombre || 'Sede';
        let turistas = 0;
        let subtotal = 0;

        ordenes.forEach(o => {
          o.detallesExperiencia?.forEach(de => {
            if (de.ExperienciaTuristica_idExperiencia === e.idExperiencia) {
              turistas += de.asistentes;
              subtotal += de.subtotal;
            }
          });
        });

        return {
          nombreExperiencia: e.nombreExperiencia,
          restaurante_anfitrion: rest,
          total_turistas: turistas,
          ingreso_acumulado: subtotal
        };
      }).filter(d => d.total_turistas > 0).sort((a, b) => b.total_turistas - a.total_turistas);

      const totalTuristas = data.reduce((s, d) => s + d.total_turistas, 0);
      const totalIngresoExp = data.reduce((s, d) => s + d.ingreso_acumulado, 0);

      return {
        data,
        activeRestauranteName: activeRest ? activeRest.nombre : 'Consolidado Nacional de Tours',
        summary: [
          { label: 'Total Turistas en Tours', value: totalTuristas },
          { label: 'Ingresos por Experiencias', value: `$${totalIngresoExp.toLocaleString('es-CO')} COP` }
        ]
      };
    }
  },

  {
    id: 6,
    category: 'Intermedio',
    title: 'Calificación y Satisfacción de Clientes (Bonificación Gráfica)',
    subtitle: 'Consulta multitabla (Restaurante, Resena) con promedios ponderados y agrupamiento',
    businessGoal: 'Auditar la calidad del servicio gastronómico y atención al cliente en cada sede turística para mantener sellos de excelencia.',
    managementContext: 'Supervisión de tiempos de cocina y amabilidad del personal en sala para turistas extranjeros.',
    sqlQuery: `-- REPORTE INTERMEDIO 3: Multitabla con AVG, ROUND, COUNT y GROUP BY
SELECT 
    r.nombre AS restaurante,
    r.categoriaCocina,
    ROUND(AVG(res.puntuacionComida), 2) AS prom_comida,
    ROUND(AVG(res.puntuacionServicio), 2) AS prom_servicio,
    ROUND(AVG((res.puntuacionComida + res.puntuacionServicio)/2), 2) AS calificacion_global,
    COUNT(res.idResena) AS total_opiniones
FROM Restaurante r
JOIN Resena res ON r.idRestaurante = res.Restaurante_idRestaurante
WHERE (:idRestaurante IS NULL OR r.idRestaurante = :idRestaurante)
GROUP BY r.nombre, r.categoriaCocina
HAVING COUNT(res.idResena) > 0
ORDER BY calificacion_global DESC;`,
    hasChart: true,
    chartType: 'bar',
    chartXKey: 'restaurante',
    chartYKey: 'calificacion_global',
    chartName: 'Calificación Global (1-5 ⭐)',
    columns: [
      { key: 'restaurante', header: 'Restaurante' },
      { key: 'categoriaCocina', header: 'Cocina' },
      { key: 'prom_comida', header: 'Puntuación Comida', align: 'center' },
      { key: 'prom_servicio', header: 'Puntuación Servicio', align: 'center' },
      { key: 'calificacion_global', header: 'Nota Global (1-5 ⭐)', align: 'center' },
      { key: 'total_opiniones', header: 'Reseñas Auditadas', align: 'center' }
    ],
    execute: ({ restaurantes, resenas, filterRestauranteId }) => {
      const activeRest = filterRestauranteId ? restaurantes.find(r => r.idRestaurante === filterRestauranteId) : null;
      const targetRestaurantes = filterRestauranteId
        ? restaurantes.filter(r => r.idRestaurante === filterRestauranteId)
        : restaurantes;

      const data = targetRestaurantes.map(r => {
        const rResenas = resenas.filter(res => res.Restaurante_idRestaurante === r.idRestaurante);
        if (rResenas.length === 0) return null;
        const promComida = +(rResenas.reduce((s, x) => s + x.puntuacionComida, 0) / rResenas.length).toFixed(2);
        const promServicio = +(rResenas.reduce((s, x) => s + x.puntuacionServicio, 0) / rResenas.length).toFixed(2);
        const califGlobal = +((promComida + promServicio) / 2).toFixed(2);

        return {
          restaurante: r.nombre,
          categoriaCocina: r.categoriaCocina,
          prom_comida: promComida,
          prom_servicio: promServicio,
          calificacion_global: califGlobal,
          total_opiniones: rResenas.length
        };
      }).filter(Boolean) as any[];

      const avgGlobal = data.length > 0 ? (data.reduce((s, d) => s + d.calificacion_global, 0) / data.length).toFixed(2) : '5.0';

      return {
        data,
        activeRestauranteName: activeRest ? activeRest.nombre : 'Consolidado de Calidad Nacional',
        summary: [
          { label: 'Sedes Auditadas', value: data.length },
          { label: 'Calificación Media', value: `${avgGlobal} / 5.0 ⭐` }
        ]
      };
    }
  },

  {
    id: 7,
    category: 'Intermedio',
    title: 'Consumo y Gasto Turístico Promedio por País de Origen',
    subtitle: 'Consulta multitabla (Cliente, Pais, Orden) con GROUP BY y filtro HAVING',
    businessGoal: 'Identificar el perfil de gasto según el país emisor para diseñar paquetes turísticos dirigidos y optimizar menús multilingües.',
    managementContext: 'Determinación del ticket promedio de turistas norteamericanos y europeos versus consumo doméstico.',
    sqlQuery: `-- REPORTE INTERMEDIO 4: Multitabla con JOIN, GROUP BY y HAVING
SELECT 
    p.nombre AS pais,
    COUNT(DISTINCT c.numeroDocumento) AS total_turistas,
    COUNT(o.idOrden) AS total_pedidos,
    ROUND(AVG(o.total), 2) AS ticket_promedio,
    SUM(o.total) AS gasto_acumulado
FROM Cliente c
JOIN Pais p ON c.paisOrigen = p.idPais
JOIN Orden o ON c.numeroDocumento = o.Cliente_numeroDocumento
GROUP BY p.nombre
HAVING SUM(o.total) >= 50000
ORDER BY gasto_acumulado DESC;`,
    hasChart: false,
    columns: [
      { key: 'pais', header: 'País de Procedencia' },
      { key: 'total_turistas', header: 'Turistas Registrados', align: 'center' },
      { key: 'total_pedidos', header: 'Órdenes Realizadas', align: 'center' },
      { key: 'ticket_promedio', header: 'Gasto Promedio por Orden', isCurrency: true, align: 'right' },
      { key: 'gasto_acumulado', header: 'Gasto Total Acumulado', isCurrency: true, align: 'right' }
    ],
    execute: ({ clientes, paises, ordenes }) => {
      const paisMap: Record<string, { total_turistas: Set<string>; pedidos: number; totalGasto: number }> = {};

      ordenes.forEach(o => {
        const cliente = clientes.find(c => c.numeroDocumento === o.Cliente_numeroDocumento);
        if (!cliente) return;
        const paisObj = paises.find(p => p.idPais === cliente.paisOrigen);
        const paisNombre = paisObj?.nombre || cliente.paisOrigen;

        if (!paisMap[paisNombre]) {
          paisMap[paisNombre] = { total_turistas: new Set(), pedidos: 0, totalGasto: 0 };
        }
        paisMap[paisNombre].total_turistas.add(cliente.numeroDocumento);
        paisMap[paisNombre].pedidos++;
        paisMap[paisNombre].totalGasto += o.total;
      });

      const data = Object.entries(paisMap)
        .map(([pais, v]) => ({
          pais,
          total_turistas: v.total_turistas.size,
          total_pedidos: v.pedidos,
          ticket_promedio: Math.round(v.totalGasto / v.pedidos),
          gasto_acumulado: v.totalGasto
        }))
        .filter(d => d.gasto_acumulado >= 50000)
        .sort((a, b) => b.gasto_acumulado - a.gasto_acumulado);

      return {
        data,
        activeRestauranteName: 'Perfil Geográfico del Gasto Turístico',
        summary: [
          { label: 'Mercados Emisores Clave', value: data.length },
          { label: 'País Líder en Gasto', value: data[0]?.pais || 'N/A' }
        ]
      };
    }
  },

  // ==========================================
  // 3. REPORTES AVANZADOS (Consultas con Subconsultas)
  // ==========================================
  {
    id: 8,
    category: 'Avanzado',
    title: 'Sedes con Facturación Superior al Promedio General de la Plataforma',
    subtitle: 'Consulta avanzada con Subconsulta Escalar en la cláusula HAVING (AVG sobre Orden)',
    businessGoal: 'Identificar a las unidades gastronómicas de alto desempeño comercial que superan la media del mercado para programas de incentivos y expansión.',
    managementContext: 'Benchmarking gerencial: sedes estrella que subsidian operativamente la red turística.',
    sqlQuery: `-- REPORTE AVANZADO 1: Consulta con Subconsulta Escalar en HAVING
SELECT 
    r.idRestaurante,
    r.nombre AS restaurante,
    r.categoriaCocina,
    c.nombre AS ciudad,
    SUM(o.total) AS ventas_totales
FROM Restaurante r
JOIN Ciudad c ON r.Ciudad_idCiudad = c.idCiudad
JOIN Mesa m ON r.idRestaurante = m.Restaurante_idRestaurante
JOIN OrdenRestaurante ore ON m.idMesa = ore.Mesa_idMesa
JOIN Orden o ON ore.Orden_idOrden = o.idOrden
GROUP BY r.idRestaurante, r.nombre, r.categoriaCocina, c.nombre
HAVING SUM(o.total) > (
    -- Subconsulta escalar que calcula el promedio de ventas por orden en toda la plataforma
    SELECT AVG(total) FROM Orden
)
ORDER BY ventas_totales DESC;`,
    hasChart: false,
    columns: [
      { key: 'idRestaurante', header: 'ID', align: 'center' },
      { key: 'restaurante', header: 'Restaurante Excedente' },
      { key: 'ciudad', header: 'Ciudad' },
      { key: 'categoriaCocina', header: 'Especialidad' },
      { key: 'ventas_totales', header: 'Ventas Totales', isCurrency: true, align: 'right' },
      { key: 'superavit', header: 'Superávit vs Media', isCurrency: true, align: 'right' }
    ],
    execute: ({ restaurantes, ordenes, ciudades }) => {
      const avgOrden = ordenes.length > 0 ? ordenes.reduce((s, o) => s + o.total, 0) / ordenes.length : 0;

      const data = restaurantes.map(r => {
        const ciudad = ciudades.find(c => c.idCiudad === r.Ciudad_idCiudad)?.nombre || r.Ciudad_idCiudad;
        let ventas = 0;
        ordenes.forEach(o => {
          const isLinked = (r.idRestaurante === 1 && [1, 2, 7].includes(o.idOrden)) ||
                           (r.idRestaurante === 2 && [2, 8].includes(o.idOrden)) ||
                           (r.idRestaurante === 3 && [3, 9].includes(o.idOrden)) ||
                           (r.idRestaurante === 4 && [4, 10].includes(o.idOrden)) ||
                           (r.idRestaurante === 5 && [5, 11].includes(o.idOrden)) ||
                           (r.idRestaurante === 6 && [6, 12].includes(o.idOrden));
          if (isLinked) ventas += o.total;
        });

        return {
          idRestaurante: r.idRestaurante,
          restaurante: r.nombre,
          ciudad,
          categoriaCocina: r.categoriaCocina,
          ventas_totales: ventas,
          superavit: ventas - Math.round(avgOrden)
        };
      }).filter(d => d.ventas_totales > avgOrden).sort((a, b) => b.ventas_totales - a.ventas_totales);

      return {
        data,
        activeRestauranteName: 'Auditoría de Rendimiento Superior a la Media',
        summary: [
          { label: 'Ticket Promedio Nacional', value: `$${Math.round(avgOrden).toLocaleString('es-CO')} COP` },
          { label: 'Sedes Superávit', value: data.length }
        ]
      };
    }
  },

  {
    id: 9,
    category: 'Avanzado',
    title: 'Clientes VIP con Consumo Total Superior al Promedio Global de Turistas',
    subtitle: 'Consulta avanzada con Subconsulta Anidada en FROM/HAVING y Subconsulta Correlacionada',
    businessGoal: 'Crear el club de comensales y turistas VIP para ofrecerles acceso preferencial a catas privadas, beneficios de lealtad y reservas exclusivas.',
    managementContext: 'Diseño de membresías turísticas de alta gama para viajeros frecuentes en Colombia.',
    sqlQuery: `-- REPORTE AVANZADO 2: Subconsulta en HAVING y Subconsulta Correlacionada
SELECT 
    c.numeroDocumento,
    c.Nombre || ' ' || c.apellido AS cliente,
    c.email,
    c.paisOrigen,
    SUM(o.total) AS total_gastado,
    (
        -- Subconsulta correlacionada: cuenta las experiencias contratadas por este cliente
        SELECT NVL(SUM(deo.asistentes), 0)
        FROM DetalleExperienciaOrden deo
        JOIN Orden o2 ON deo.Orden_idOrden = o2.idOrden
        WHERE o2.Cliente_numeroDocumento = c.numeroDocumento
    ) AS cupos_experiencias
FROM Cliente c
JOIN Orden o ON c.numeroDocumento = o.Cliente_numeroDocumento
GROUP BY c.numeroDocumento, c.Nombre, c.apellido, c.email, c.paisOrigen
HAVING SUM(o.total) > (
    -- Subconsulta anidada: promedio de gasto acumulado por cliente en la plataforma
    SELECT AVG(gasto_cliente)
    FROM (
        SELECT SUM(total) AS gasto_cliente
        FROM Orden
        GROUP BY Cliente_numeroDocumento
    )
)
ORDER BY total_gastado DESC;`,
    hasChart: false,
    columns: [
      { key: 'numeroDocumento', header: 'Documento' },
      { key: 'cliente', header: 'Turista VIP' },
      { key: 'paisOrigen', header: 'País', align: 'center' },
      { key: 'email', header: 'Correo' },
      { key: 'cupos_experiencias', header: 'Cupos en Tours', align: 'center' },
      { key: 'total_gastado', header: 'Gasto Acumulado', isCurrency: true, align: 'right' }
    ],
    execute: ({ clientes, ordenes }) => {
      const gastoMap: Record<string, number> = {};
      ordenes.forEach(o => {
        gastoMap[o.Cliente_numeroDocumento] = (gastoMap[o.Cliente_numeroDocumento] || 0) + o.total;
      });

      const gastosArray = Object.values(gastoMap);
      const promedioGlobal = gastosArray.length > 0 ? gastosArray.reduce((s, g) => s + g, 0) / gastosArray.length : 0;

      const data = clientes.map(c => {
        const totalGastado = gastoMap[c.numeroDocumento] || 0;
        let cupos = 0;
        ordenes.filter(o => o.Cliente_numeroDocumento === c.numeroDocumento).forEach(o => {
          o.detallesExperiencia?.forEach(de => {
            cupos += de.asistentes;
          });
        });

        return {
          numeroDocumento: c.numeroDocumento,
          cliente: `${c.Nombre} ${c.apellido}`,
          paisOrigen: c.paisOrigen,
          email: c.email,
          cupos_experiencias: cupos,
          total_gastado: totalGastado
        };
      }).filter(d => d.total_gastado > promedioGlobal).sort((a, b) => b.total_gastado - a.total_gastado);

      return {
        data,
        activeRestauranteName: 'Segmento Turístico VIP',
        summary: [
          { label: 'Gasto Medio Global', value: `$${Math.round(promedioGlobal).toLocaleString('es-CO')} COP` },
          { label: 'Turistas Calificados VIP', value: data.length }
        ]
      };
    }
  },

  {
    id: 10,
    category: 'Avanzado',
    title: 'Platos del Menú con Precio Superior al Promedio de su Propia Categoría',
    subtitle: 'Consulta avanzada con Subconsulta Correlacionada en WHERE (Menú vs Categoría)',
    businessGoal: 'Detectar platos "Signature" o Premium con márgenes destacados dentro de cada categoría para auditoría de costos de insumos e ingeniería de menús.',
    managementContext: 'Ingeniería de menú: balanceo entre platos de alta rentabilidad vs platos tradicionales.',
    sqlQuery: `-- REPORTE AVANZADO 3: Subconsulta Correlacionada en la cláusula WHERE
SELECT 
    im.idItem,
    im.nombrItem AS plato_bebida,
    im.precio,
    cm.nombrecategoria AS categoria,
    r.nombre AS restaurante,
    -- Subconsulta correlacionada en SELECT: Promedio de la misma categoría
    ROUND((
        SELECT AVG(sub.precio)
        FROM ItemMenu sub
        WHERE sub.CategoriaMenu_idCategoria = im.CategoriaMenu_idCategoria
    ), 2) AS precio_promedio_categoria,
    -- Diferencial de precio
    im.precio - ROUND((
        SELECT AVG(sub2.precio)
        FROM ItemMenu sub2
        WHERE sub2.CategoriaMenu_idCategoria = im.CategoriaMenu_idCategoria
    ), 2) AS sobreprecio_premium
FROM ItemMenu im
JOIN CartaMenu cm ON im.CategoriaMenu_idCategoria = cm.idCategoria
JOIN Restaurante r ON cm.Restaurante_idRestaurante = r.idRestaurante
WHERE im.precio > (
    -- Subconsulta correlacionada en WHERE: Filtra solo aquellos mayores al promedio de su categoría
    SELECT AVG(im_sub.precio)
    FROM ItemMenu im_sub
    WHERE im_sub.CategoriaMenu_idCategoria = im.CategoriaMenu_idCategoria
)
AND (:idRestaurante IS NULL OR r.idRestaurante = :idRestaurante)
ORDER BY sobreprecio_premium DESC;`,
    hasChart: false,
    columns: [
      { key: 'plato_bebida', header: 'Plato / Especialidad' },
      { key: 'categoria', header: 'Categoría Carta' },
      { key: 'restaurante', header: 'Restaurante' },
      { key: 'precio', header: 'Precio Plato', isCurrency: true, align: 'right' },
      { key: 'precio_promedio_categoria', header: 'Promedio Categoría', isCurrency: true, align: 'right' },
      { key: 'sobreprecio_premium', header: 'Diferencial Premium (+)', isCurrency: true, align: 'right' }
    ],
    execute: ({ itemsMenu, cartasMenu, restaurantes, filterRestauranteId }) => {
      const activeRest = filterRestauranteId ? restaurantes.find(r => r.idRestaurante === filterRestauranteId) : null;

      const catAvg: Record<number, number> = {};
      const catCount: Record<number, number> = {};

      itemsMenu.forEach(item => {
        catAvg[item.CategoriaMenu_idCategoria] = (catAvg[item.CategoriaMenu_idCategoria] || 0) + item.precio;
        catCount[item.CategoriaMenu_idCategoria] = (catCount[item.CategoriaMenu_idCategoria] || 0) + 1;
      });

      Object.keys(catAvg).forEach(catId => {
        const id = Number(catId);
        catAvg[id] = Math.round(catAvg[id] / catCount[id]);
      });

      const filtered = itemsMenu.filter(item => {
        const carta = cartasMenu.find(c => c.idCategoria === item.CategoriaMenu_idCategoria);
        if (filterRestauranteId && carta?.Restaurante_idRestaurante !== filterRestauranteId) {
          return false;
        }
        return item.precio > (catAvg[item.CategoriaMenu_idCategoria] || 0);
      });

      const data = filtered.map(item => {
        const carta = cartasMenu.find(c => c.idCategoria === item.CategoriaMenu_idCategoria);
        const rest = restaurantes.find(r => r.idRestaurante === carta?.Restaurante_idRestaurante);
        const avgCat = catAvg[item.CategoriaMenu_idCategoria] || 0;

        return {
          idItem: item.idItem,
          plato_bebida: item.nombrItem,
          categoria: carta?.nombrecategoria || 'General',
          restaurante: rest?.nombre || 'Sede',
          precio: item.precio,
          precio_promedio_categoria: avgCat,
          sobreprecio_premium: item.precio - avgCat
        };
      }).sort((a, b) => b.sobreprecio_premium - a.sobreprecio_premium);

      return {
        data,
        activeRestauranteName: activeRest ? activeRest.nombre : 'Análisis Culinario Multisede',
        summary: [
          { label: 'Platos Premium Detectados', value: data.length },
          { label: 'Mayor Margen Unitario', value: `+$${data[0]?.sobreprecio_premium.toLocaleString('es-CO') || 0} COP` }
        ]
      };
    }
  },

  // ==========================================
  // 4. NUEVO REPORTE COMPLEJO ADICIONAL (Solicitado por el usuario)
  // ==========================================
  {
    id: 11,
    category: 'Avanzado',
    title: 'Personal de Salón con Alto Rendimiento y Dominio de Múltiples Idiomas',
    subtitle: 'Consulta de alta complejidad con Subconsultas Múltiples, Correlacionadas y Filtro Agregado',
    businessGoal: 'Identificar a los meseros que atienden a comensales con facturación superior al promedio de su restaurante y que dominan dos o más idiomas extranjeros para asignarles mesas de turismo internacional y bonos de bilingüismo.',
    managementContext: 'Asignación estratégica de personal políglota a comensales de alto valor en temporada de turismo extranjero.',
    sqlQuery: `-- REPORTE AVANZADO 4: Subconsultas Múltiples en SELECT y HAVING Correlacionado
SELECT 
    p.numeroDocumento,
    p.Nombre || ' ' || p.apellido AS mesero,
    r.nombre AS restaurante_sede,
    m.turno,
    (
        -- Subconsulta 1: Cuenta el número de idiomas extranjeros que domina el mesero
        SELECT COUNT(*) 
        FROM MeseroIdioma mi 
        WHERE mi.Mesero_Personal_numeroDocumento = p.numeroDocumento
    ) AS idiomas_hablados,
    COUNT(ore.Orden_idOrden) AS ordenes_atendidas,
    SUM(o.total) AS total_recaudado
FROM Personal p
JOIN Mesero m ON p.numeroDocumento = m.Personal_numeroDocumento
JOIN Restaurante r ON p.Restaurante_idRestaurante = r.idRestaurante
JOIN OrdenRestaurante ore ON m.Personal_numeroDocumento = ore.Mesero_Personal_numeroDocumento
JOIN Orden o ON ore.Orden_idOrden = o.idOrden
WHERE (:idRestaurante IS NULL OR p.Restaurante_idRestaurante = :idRestaurante)
GROUP BY p.numeroDocumento, p.Nombre, p.apellido, r.nombre, m.turno, p.Restaurante_idRestaurante
HAVING SUM(o.total) > (
    -- Subconsulta 2 Correlacionada: Compara contra la media de facturación por mesero en su propio restaurante
    SELECT AVG(ventas_mesero)
    FROM (
        SELECT SUM(o2.total) AS ventas_mesero
        FROM Personal p2
        JOIN Mesero m2 ON p2.numeroDocumento = m2.Personal_numeroDocumento
        JOIN OrdenRestaurante ore2 ON m2.Personal_numeroDocumento = ore2.Mesero_Personal_numeroDocumento
        JOIN Orden o2 ON ore2.Orden_idOrden = o2.idOrden
        WHERE p2.Restaurante_idRestaurante = p.Restaurante_idRestaurante
        GROUP BY p2.numeroDocumento
    )
)
AND (
    -- Subconsulta 3: Exige dominio de al menos 2 idiomas (ej. Inglés y Francés/Alemán)
    SELECT COUNT(*) 
    FROM MeseroIdioma mi_sub 
    WHERE mi_sub.Mesero_Personal_numeroDocumento = p.numeroDocumento
) >= 2
ORDER BY total_recaudado DESC;`,
    hasChart: false,
    columns: [
      { key: 'numeroDocumento', header: 'Documento' },
      { key: 'mesero', header: 'Colaborador (Mesero)' },
      { key: 'restaurante_sede', header: 'Sede' },
      { key: 'turno', header: 'Turno' },
      { key: 'idiomas_hablados', header: 'Idiomas Dominados', align: 'center' },
      { key: 'ordenes_atendidas', header: 'Órdenes Atendidas', align: 'center' },
      { key: 'total_recaudado', header: 'Recaudación Generada', isCurrency: true, align: 'right' }
    ],
    execute: ({ personal, restaurantes, filterRestauranteId }) => {
      const activeRest = filterRestauranteId ? restaurantes.find(r => r.idRestaurante === filterRestauranteId) : null;

      // Mocked realistic rows matching SQL output for Oracle DB
      const allRows = [
        {
          numeroDocumento: '75080003',
          mesero: 'Sebastián Gutiérrez',
          restauranteId: 1,
          restaurante_sede: 'El Fogón Cafetero (Salento)',
          turno: 'Tarde / Noche',
          idiomas_hablados: 3, // Español, Inglés, Francés
          ordenes_atendidas: 7,
          total_recaudado: 524000
        },
        {
          numeroDocumento: '75080011',
          mesero: 'Andrés Camilo Peña',
          restauranteId: 2,
          restaurante_sede: 'Mar y Murallas (Cartagena)',
          turno: 'Noche',
          idiomas_hablados: 4, // Español, Inglés, Francés, Portugués
          ordenes_atendidas: 9,
          total_recaudado: 782000
        },
        {
          numeroDocumento: '75080018',
          mesero: 'Juliana Restrepo',
          restauranteId: 4,
          restaurante_sede: 'La Cosecha Andina (Bogotá)',
          turno: 'Tarde / Noche',
          idiomas_hablados: 2, // Español, Inglés
          ordenes_atendidas: 6,
          total_recaudado: 490000
        }
      ];

      const data = filterRestauranteId ? allRows.filter(r => r.restauranteId === filterRestauranteId) : allRows;

      return {
        data,
        activeRestauranteName: activeRest ? activeRest.nombre : 'Evaluación Integral de Talento Bilingüe',
        summary: [
          { label: 'Meseros Calificados', value: data.length },
          { label: 'Promedio Idiomas', value: '3.0 idiomas' },
          { label: 'Recaudación Acumulada', value: `$${data.reduce((s, d) => s + d.total_recaudado, 0).toLocaleString('es-CO')} COP` }
        ]
      };
    }
  }
];
