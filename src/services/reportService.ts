// Definición de los 12 reportes de decisión.
// - sqlQuery: texto oficial (shared/reportQueries.js) que el backend ejecuta en Oracle.
// - compute(): réplica en TypeScript del MISMO SQL para el modo sin conexión. Devuelve
//   filas con las mismas claves que los alias del SQL (en minúscula), igual que Oracle.
// - summarize(): indicadores calculados sobre las filas (sirve para ambos modos).
import { Dataset, Orden } from '../types';
import { REPORT_SQL } from '../../shared/reportQueries.js';

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

export type ReportContext = Dataset & { filterRestauranteId?: number | null };

export interface ReportDefinition {
  id: number;
  category: 'Simple' | 'Intermedio' | 'Avanzado';
  title: string;
  subtitle: string;
  businessGoal: string;
  managementContext: string;
  sqlTechniques: string[];
  scoped: boolean; // true si respeta el filtro de sede (:idRestaurante)
  sqlQuery: string;
  hasChart: boolean;
  chartType?: 'bar' | 'pie' | 'area';
  chartXKey?: string;
  chartYKey?: string;
  chartName?: string;
  columns: ReportColumn[];
  compute: (ctx: ReportContext) => any[];
  summarize: (rows: any[], ctx: ReportContext) => ReportSummaryItem[];
}

// ------------------------------------------------------------------ utilidades
const CANCELADA = 7;
const money = (n: number) => `$${Math.round(n || 0).toLocaleString('es-CO')} COP`;
const sum = (xs: number[]) => xs.reduce((a, b) => a + (Number(b) || 0), 0);
const avg = (xs: number[]) => (xs.length ? sum(xs) / xs.length : 0);
const round = (n: number, d = 0) => Math.round(n * 10 ** d) / 10 ** d;
const groupBy = <T,>(xs: T[], key: (x: T) => string | number) =>
  xs.reduce<Map<string | number, T[]>>((m, x) => {
    const k = key(x);
    m.set(k, [...(m.get(k) || []), x]);
    return m;
  }, new Map());
// Desempate como Oracle (comparación binaria de VARCHAR2)
const cmp = (a: unknown, b: unknown) => (a < b ? -1 : a > b ? 1 : 0);
const inScope = (ctx: ReportContext, rid?: number) => !ctx.filterRestauranteId || rid === ctx.filterRestauranteId;
const activas = (ctx: ReportContext) => ctx.ordenes.filter(o => o.Estado_idEstado !== CANCELADA);
const salon = (ordenes: Orden[]) => ordenes.filter(o => o.tipo === 'Restaurante' && o.mesaId);
const sql = (id: number) => `${REPORT_SQL[id as keyof typeof REPORT_SQL]};`;

/** Sumatoria de ventas en salón por sede (base de los reportes 4 y 8). */
const ventasSalonPorSede = (ctx: ReportContext) => {
  const restDeMesa = new Map(ctx.mesas.map(m => [m.idMesa, m.Restaurante_idRestaurante]));
  return groupBy(salon(activas(ctx)), o => restDeMesa.get(o.mesaId!) as number);
};

export const REPORTS: ReportDefinition[] = [
  // ============================================================ SIMPLES
  {
    id: 1,
    category: 'Simple',
    title: 'Catálogo de Restaurantes y Horarios de Atención',
    subtitle: 'Una tabla: Restaurante · ORDER BY nombre',
    businessGoal: 'Permite a los operadores turísticos conocer la oferta gastronómica disponible por tipo de cocina y franja horaria de servicio.',
    managementContext: 'Auditoría de horarios para turistas matutinos (desayunos cafeteros) y nocturnos.',
    sqlTechniques: ['SELECT', 'WHERE con bind', 'TO_CHAR', 'ORDER BY'],
    scoped: true,
    sqlQuery: sql(1),
    hasChart: false,
    columns: [
      { key: 'idrestaurante', header: 'ID', align: 'center' },
      { key: 'nit', header: 'NIT' },
      { key: 'nombre', header: 'Restaurante' },
      { key: 'categoriacocina', header: 'Especialidad' },
      { key: 'direccion', header: 'Dirección' },
      { key: 'apertura', header: 'Apertura', align: 'center' },
      { key: 'cierre', header: 'Cierre', align: 'center' },
      { key: 'codigo_ciudad', header: 'Cód. Ciudad', align: 'center' },
    ],
    compute: ctx =>
      ctx.restaurantes
        .filter(r => inScope(ctx, r.idRestaurante))
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map(r => ({
          idrestaurante: r.idRestaurante,
          nit: r.nit,
          nombre: r.nombre,
          direccion: r.direccion,
          categoriacocina: r.categoriaCocina,
          apertura: r.horaApertura,
          cierre: r.horaCierre,
          codigo_ciudad: r.Ciudad_idCiudad,
        })),
    summarize: rows => [
      { label: 'Sedes listadas', value: rows.length },
      { label: 'Apertura más temprana', value: rows.map(r => r.apertura).sort()[0] || '-' },
      { label: 'Cierre más tardío', value: rows.map(r => r.cierre).sort().at(-1) || '-' },
    ],
  },
  {
    id: 2,
    category: 'Simple',
    title: 'Directorio de Clientes por País de Origen',
    subtitle: 'Una tabla: Cliente · ORDER BY paisOrigen, apellido',
    businessGoal: 'Identificar el flujo de viajeros nacionales e internacionales para orientar campañas de fidelización y marketing turístico.',
    managementContext: 'Mapa de la afluencia internacional para cartas multilingües y señalética bilingüe.',
    sqlTechniques: ['SELECT', 'ORDER BY compuesto'],
    scoped: false,
    sqlQuery: sql(2),
    hasChart: false,
    columns: [
      { key: 'numerodocumento', header: 'Identificación' },
      { key: 'nombre', header: 'Nombre' },
      { key: 'apellido', header: 'Apellido' },
      { key: 'paisorigen', header: 'País', align: 'center' },
      { key: 'email', header: 'Correo electrónico' },
      { key: 'telefono', header: 'Teléfono' },
    ],
    compute: ctx =>
      [...ctx.clientes]
        .sort((a, b) => a.paisOrigen.localeCompare(b.paisOrigen) || a.apellido.localeCompare(b.apellido))
        .map(c => ({
          numerodocumento: c.numeroDocumento,
          nombre: c.Nombre,
          apellido: c.apellido,
          email: c.email,
          telefono: c.telefono,
          paisorigen: c.paisOrigen,
        })),
    summarize: rows => {
      const ext = rows.filter(r => r.paisorigen !== 'CO').length;
      return [
        { label: 'Clientes', value: rows.length },
        { label: 'Países distintos', value: new Set(rows.map(r => r.paisorigen)).size },
        { label: 'Extranjeros', value: `${ext} (${rows.length ? Math.round((ext / rows.length) * 100) : 0}%)` },
      ];
    },
  },
  {
    id: 3,
    category: 'Simple',
    title: 'Portafolio de Experiencias y Tarifas Vigentes',
    subtitle: 'Una tabla: ExperienciaTuristica · ORDER BY precio DESC',
    businessGoal: 'Monitorear la cartera de tours, catas y talleres con su duración y tarifa por persona.',
    managementContext: 'Rentabilidad por hora de los tours temáticos de cada sede.',
    sqlTechniques: ['SELECT', 'Alias de columna', 'WHERE con bind', 'ORDER BY'],
    scoped: true,
    sqlQuery: sql(3),
    hasChart: false,
    columns: [
      { key: 'idexperiencia', header: 'ID', align: 'center' },
      { key: 'nombreexperiencia', header: 'Experiencia' },
      { key: 'descripcion', header: 'Descripción' },
      { key: 'duracion_horas', header: 'Duración (h)', align: 'center' },
      { key: 'precioporpersona', header: 'Precio por persona', isCurrency: true, align: 'right' },
      { key: 'id_restaurante', header: 'Sede', align: 'center' },
    ],
    compute: ctx =>
      ctx.experiencias
        .filter(e => inScope(ctx, e.Restaurante_idRestaurante))
        .sort((a, b) => b.precioPorPersona - a.precioPorPersona)
        .map(e => ({
          idexperiencia: e.idExperiencia,
          nombreexperiencia: e.nombreExperiencia,
          descripcion: e.descripcion,
          duracion_horas: e.duracion,
          precioporpersona: e.precioPorPersona,
          id_restaurante: e.Restaurante_idRestaurante,
        })),
    summarize: rows => [
      { label: 'Experiencias', value: rows.length },
      { label: 'Tarifa promedio', value: money(avg(rows.map(r => r.precioporpersona))) },
      { label: 'Duración promedio', value: `${round(avg(rows.map(r => r.duracion_horas)), 1)} h` },
    ],
  },

  // ============================================================ INTERMEDIOS
  {
    id: 4,
    category: 'Intermedio',
    title: 'Ventas en Salón por Sede',
    subtitle: 'Restaurante ⋈ Ciudad ⟕ Mesa ⟕ OrdenRestaurante ⟕ Orden · GROUP BY',
    businessGoal: 'Evaluar el rendimiento comercial de cada sede para liquidación contable y análisis de rentabilidad.',
    managementContext: 'Control del recaudo por mesas; excluye órdenes canceladas.',
    sqlTechniques: ['JOIN', 'LEFT JOIN', 'GROUP BY', 'COUNT', 'SUM', 'NVL'],
    scoped: true,
    sqlQuery: sql(4),
    hasChart: true,
    chartType: 'bar',
    chartXKey: 'restaurante',
    chartYKey: 'total_facturado',
    chartName: 'Ventas en salón ($ COP)',
    columns: [
      { key: 'restaurante', header: 'Restaurante' },
      { key: 'ciudad', header: 'Ciudad' },
      { key: 'total_pedidos', header: 'Órdenes', align: 'center' },
      { key: 'total_facturado', header: 'Facturación', isCurrency: true, align: 'right' },
    ],
    compute: ctx => {
      const ventas = ventasSalonPorSede(ctx);
      return ctx.restaurantes
        .filter(r => inScope(ctx, r.idRestaurante))
        .map(r => {
          const os = ventas.get(r.idRestaurante) || [];
          return {
            idrestaurante: r.idRestaurante,
            restaurante: r.nombre,
            ciudad: ctx.ciudades.find(c => c.idCiudad === r.Ciudad_idCiudad)?.nombre,
            total_pedidos: os.length,
            total_facturado: sum(os.map(o => o.total)),
          };
        })
        .sort((a, b) => b.total_facturado - a.total_facturado || a.idrestaurante - b.idrestaurante);
    },
    summarize: rows => [
      { label: 'Facturación total', value: money(sum(rows.map(r => r.total_facturado))) },
      { label: 'Órdenes', value: sum(rows.map(r => r.total_pedidos)) },
      { label: 'Sede líder', value: rows[0]?.restaurante || '-' },
    ],
  },
  {
    id: 5,
    category: 'Intermedio',
    title: 'Experiencias Turísticas más Demandadas',
    subtitle: 'ExperienciaTuristica ⋈ Restaurante ⋈ DetalleExperienciaOrden · GROUP BY · HAVING',
    businessGoal: 'Detectar qué tours y talleres atraen más turistas e ingresos para ampliar cupos y calendario.',
    managementContext: 'Planificación de guías bilingües y compra anticipada de insumos según asistencia.',
    sqlTechniques: ['JOIN', 'GROUP BY', 'COUNT DISTINCT', 'SUM', 'HAVING'],
    scoped: true,
    sqlQuery: sql(5),
    hasChart: true,
    chartType: 'pie',
    chartXKey: 'nombreexperiencia',
    chartYKey: 'total_turistas',
    chartName: 'Turistas por experiencia',
    columns: [
      { key: 'nombreexperiencia', header: 'Experiencia' },
      { key: 'restaurante_anfitrion', header: 'Restaurante anfitrión' },
      { key: 'ordenes', header: 'Órdenes', align: 'center' },
      { key: 'total_turistas', header: 'Turistas', align: 'center' },
      { key: 'ingreso_acumulado', header: 'Ingreso', isCurrency: true, align: 'right' },
    ],
    compute: ctx => {
      const det = ctx.ordenes.flatMap(o => o.detallesExperiencia || []);
      return ctx.experiencias
        .filter(e => inScope(ctx, e.Restaurante_idRestaurante))
        .map(e => {
          const d = det.filter(x => x.ExperienciaTuristica_idExperiencia === e.idExperiencia);
          return {
            idexperiencia: e.idExperiencia,
            nombreexperiencia: e.nombreExperiencia,
            restaurante_anfitrion: ctx.restaurantes.find(r => r.idRestaurante === e.Restaurante_idRestaurante)?.nombre,
            ordenes: new Set(d.map(x => x.Orden_idOrden)).size,
            total_turistas: sum(d.map(x => x.asistentes)),
            ingreso_acumulado: sum(d.map(x => x.subtotal)),
          };
        })
        .filter(r => r.total_turistas >= 1) // HAVING SUM(asistentes) >= 1
        .sort((a, b) => b.total_turistas - a.total_turistas || b.ingreso_acumulado - a.ingreso_acumulado || a.idexperiencia - b.idexperiencia);
    },
    summarize: rows => [
      { label: 'Turistas atendidos', value: sum(rows.map(r => r.total_turistas)) },
      { label: 'Ingreso por experiencias', value: money(sum(rows.map(r => r.ingreso_acumulado))) },
      { label: 'Más demandada', value: rows[0]?.nombreexperiencia || '-' },
    ],
  },
  {
    id: 6,
    category: 'Intermedio',
    title: 'Calificación y Satisfacción por Restaurante',
    subtitle: 'Restaurante ⋈ Resena · AVG · ROUND · COUNT · HAVING',
    businessGoal: 'Auditar la calidad de la comida y del servicio en cada sede para sostener la reputación turística.',
    managementContext: 'Seguimiento a tiempos de cocina y atención en sala a turistas extranjeros.',
    sqlTechniques: ['JOIN', 'GROUP BY', 'AVG', 'ROUND', 'COUNT', 'HAVING'],
    scoped: true,
    sqlQuery: sql(6),
    hasChart: true,
    chartType: 'bar',
    chartXKey: 'restaurante',
    chartYKey: 'calificacion_global',
    chartName: 'Calificación global (1-5)',
    columns: [
      { key: 'restaurante', header: 'Restaurante' },
      { key: 'categoriacocina', header: 'Cocina' },
      { key: 'prom_comida', header: 'Comida', align: 'center' },
      { key: 'prom_servicio', header: 'Servicio', align: 'center' },
      { key: 'calificacion_global', header: 'Global (1-5)', align: 'center' },
      { key: 'total_opiniones', header: 'Reseñas', align: 'center' },
    ],
    compute: ctx =>
      ctx.restaurantes
        .filter(r => inScope(ctx, r.idRestaurante))
        .map(r => {
          const rs = ctx.resenas.filter(x => x.Restaurante_idRestaurante === r.idRestaurante);
          return {
            restaurante: r.nombre,
            categoriacocina: r.categoriaCocina,
            prom_comida: round(avg(rs.map(x => x.puntuacionComida)), 2),
            prom_servicio: round(avg(rs.map(x => x.puntuacionServicio)), 2),
            calificacion_global: round(avg(rs.map(x => (x.puntuacionComida + x.puntuacionServicio) / 2)), 2),
            total_opiniones: rs.length,
          };
        })
        .filter(r => r.total_opiniones >= 1)
        .sort((a, b) => b.calificacion_global - a.calificacion_global || cmp(a.restaurante, b.restaurante)),
    summarize: rows => [
      { label: 'Reseñas', value: sum(rows.map(r => r.total_opiniones)) },
      { label: 'Mejor calificada', value: rows[0]?.restaurante || '-' },
      { label: 'Nota más baja', value: rows.at(-1)?.calificacion_global ?? '-' },
    ],
  },
  {
    id: 7,
    category: 'Intermedio',
    title: 'Gasto Turístico por País de Origen',
    subtitle: 'Cliente ⋈ Pais ⋈ Orden · WHERE · GROUP BY · HAVING',
    businessGoal: 'Conocer el perfil de gasto según el país emisor para diseñar paquetes turísticos dirigidos.',
    managementContext: 'Ticket promedio de turistas extranjeros frente al consumo nacional.',
    sqlTechniques: ['JOIN', 'WHERE', 'GROUP BY', 'COUNT DISTINCT', 'AVG', 'HAVING'],
    scoped: false,
    sqlQuery: sql(7),
    hasChart: false,
    columns: [
      { key: 'pais', header: 'País' },
      { key: 'total_turistas', header: 'Clientes', align: 'center' },
      { key: 'total_pedidos', header: 'Órdenes', align: 'center' },
      { key: 'ticket_promedio', header: 'Ticket promedio', isCurrency: true, align: 'right' },
      { key: 'gasto_acumulado', header: 'Gasto total', isCurrency: true, align: 'right' },
    ],
    compute: ctx => {
      const pais = new Map(ctx.paises.map(p => [p.idPais, p.nombre]));
      const cli = new Map(ctx.clientes.map(c => [c.numeroDocumento, c]));
      const filas = activas(ctx)
        .map(o => ({ o, c: cli.get(o.Cliente_numeroDocumento) }))
        .filter(x => x.c && pais.has(x.c.paisOrigen));
      return [...groupBy(filas, x => pais.get(x.c!.paisOrigen)!).entries()]
        .map(([p, xs]) => ({
          pais: p,
          total_turistas: new Set(xs.map(x => x.c!.numeroDocumento)).size,
          total_pedidos: xs.length,
          ticket_promedio: round(avg(xs.map(x => x.o.total))),
          gasto_acumulado: sum(xs.map(x => x.o.total)),
        }))
        .filter(r => r.gasto_acumulado >= 50000)
        .sort((a, b) => b.gasto_acumulado - a.gasto_acumulado || cmp(a.pais, b.pais));
    },
    summarize: rows => [
      { label: 'Países con consumo', value: rows.length },
      { label: 'Mayor gasto', value: rows[0]?.pais || '-' },
      { label: 'Gasto total', value: money(sum(rows.map(r => r.gasto_acumulado))) },
    ],
  },
  {
    id: 12,
    category: 'Intermedio',
    title: 'Ventas Mes a Mes por Canal',
    subtitle: 'Orden ⋈ Estado ⟕ OrdenDomicilio · CASE · GROUP BY TO_CHAR(fecha)',
    businessGoal: 'Ver la tendencia mensual de ventas y el peso del domicilio frente al salón para planear personal y compras.',
    managementContext: 'Estacionalidad turística: temporadas altas y bajas en los destinos.',
    sqlTechniques: ['JOIN', 'LEFT JOIN', 'CASE', 'TO_CHAR', 'GROUP BY', 'AVG'],
    scoped: false,
    sqlQuery: sql(12),
    hasChart: true,
    chartType: 'area',
    chartXKey: 'mes',
    chartYKey: 'ventas_mes',
    chartName: 'Ventas del mes ($ COP)',
    columns: [
      { key: 'mes', header: 'Mes', align: 'center' },
      { key: 'total_ordenes', header: 'Órdenes', align: 'center' },
      { key: 'ordenes_salon', header: 'Salón', align: 'center' },
      { key: 'ordenes_domicilio', header: 'Domicilio', align: 'center' },
      { key: 'ticket_promedio', header: 'Ticket promedio', isCurrency: true, align: 'right' },
      { key: 'ventas_mes', header: 'Ventas', isCurrency: true, align: 'right' },
    ],
    compute: ctx =>
      [...groupBy(activas(ctx), o => o.fecha.slice(0, 7)).entries()]
        .map(([mes, os]) => ({
          mes,
          total_ordenes: os.length,
          ordenes_salon: os.filter(o => o.tipo !== 'Domicilio').length,
          ordenes_domicilio: os.filter(o => o.tipo === 'Domicilio').length,
          ticket_promedio: round(avg(os.map(o => o.total))),
          ventas_mes: sum(os.map(o => o.total)),
        }))
        .sort((a, b) => String(a.mes).localeCompare(String(b.mes))),
    summarize: rows => {
      const best = [...rows].sort((a, b) => b.ventas_mes - a.ventas_mes)[0];
      const dom = sum(rows.map(r => r.ordenes_domicilio));
      const tot = sum(rows.map(r => r.total_ordenes));
      return [
        { label: 'Ventas del periodo', value: money(sum(rows.map(r => r.ventas_mes))) },
        { label: 'Mejor mes', value: best?.mes || '-' },
        { label: 'Participación domicilio', value: `${tot ? Math.round((dom / tot) * 100) : 0}%` },
      ];
    },
  },

  // ============================================================ AVANZADOS
  {
    id: 8,
    category: 'Avanzado',
    title: 'Sedes con Ventas sobre el Promedio por Sede',
    subtitle: 'Subconsulta escalar con agregado anidado AVG(SUM()) en SELECT y HAVING',
    businessGoal: 'Identificar las sedes de alto desempeño que superan la media de la red para incentivos y expansión.',
    managementContext: 'Benchmarking: sedes estrella frente al promedio de ventas en salón por sede.',
    sqlTechniques: ['Subconsulta escalar', 'AVG(SUM()) anidado', 'HAVING con subconsulta', 'JOIN'],
    scoped: false,
    sqlQuery: sql(8),
    hasChart: false,
    columns: [
      { key: 'restaurante', header: 'Restaurante' },
      { key: 'ciudad', header: 'Ciudad' },
      { key: 'categoriacocina', header: 'Especialidad' },
      { key: 'total_pedidos', header: 'Órdenes', align: 'center' },
      { key: 'ventas_totales', header: 'Ventas', isCurrency: true, align: 'right' },
      { key: 'promedio_por_sede', header: 'Promedio por sede', isCurrency: true, align: 'right' },
    ],
    compute: ctx => {
      const ventas = ventasSalonPorSede(ctx);
      const totales = [...ventas.values()].map(os => sum(os.map(o => o.total)));
      const media = avg(totales);
      return [...ventas.entries()]
        .map(([rid, os]) => {
          const r = ctx.restaurantes.find(x => x.idRestaurante === rid)!;
          return {
            idrestaurante: rid,
            restaurante: r?.nombre,
            categoriacocina: r?.categoriaCocina,
            ciudad: ctx.ciudades.find(c => c.idCiudad === r?.Ciudad_idCiudad)?.nombre,
            total_pedidos: os.length,
            ventas_totales: sum(os.map(o => o.total)),
            promedio_por_sede: round(media),
          };
        })
        .filter(r => r.ventas_totales > media)
        .sort((a, b) => b.ventas_totales - a.ventas_totales || Number(a.idrestaurante) - Number(b.idrestaurante));
    },
    summarize: rows => [
      { label: 'Sedes sobre la media', value: rows.length },
      { label: 'Promedio por sede', value: money(rows[0]?.promedio_por_sede || 0) },
      { label: 'Superávit de la líder', value: money((rows[0]?.ventas_totales || 0) - (rows[0]?.promedio_por_sede || 0)) },
    ],
  },
  {
    id: 9,
    category: 'Avanzado',
    title: 'Clientes VIP: Gasto sobre el Promedio por Cliente',
    subtitle: 'Subconsulta correlacionada en SELECT + subconsulta en FROM dentro de HAVING',
    businessGoal: 'Conformar el club de clientes VIP para catas privadas, beneficios de fidelización y reservas preferenciales.',
    managementContext: 'Membresías de alta gama para viajeros frecuentes (programa de fidelización).',
    sqlTechniques: ['Subconsulta correlacionada', 'Vista en línea (FROM)', 'HAVING con subconsulta', 'NVL'],
    scoped: false,
    sqlQuery: sql(9),
    hasChart: false,
    columns: [
      { key: 'numerodocumento', header: 'Documento' },
      { key: 'cliente', header: 'Cliente VIP' },
      { key: 'paisorigen', header: 'País', align: 'center' },
      { key: 'email', header: 'Correo' },
      { key: 'total_ordenes', header: 'Órdenes', align: 'center' },
      { key: 'cupos_experiencias', header: 'Cupos en tours', align: 'center' },
      { key: 'total_gastado', header: 'Gasto acumulado', isCurrency: true, align: 'right' },
    ],
    compute: ctx => {
      const porCliente = groupBy(activas(ctx), o => o.Cliente_numeroDocumento);
      const media = avg([...porCliente.values()].map(os => sum(os.map(o => o.total))));
      return [...porCliente.entries()]
        .map(([doc, os]) => {
          const c = ctx.clientes.find(x => x.numeroDocumento === doc);
          return {
            numerodocumento: doc,
            cliente: c ? `${c.Nombre} ${c.apellido}` : doc,
            email: c?.email,
            paisorigen: c?.paisOrigen,
            total_ordenes: os.length,
            total_gastado: sum(os.map(o => o.total)),
            // la subconsulta correlacionada recorre TODAS las órdenes del cliente
            cupos_experiencias: sum(
              ctx.ordenes
                .filter(o => o.Cliente_numeroDocumento === doc)
                .flatMap(o => o.detallesExperiencia || [])
                .map(d => d.asistentes)
            ),
          };
        })
        .filter(r => r.total_gastado > media)
        .sort((a, b) => b.total_gastado - a.total_gastado || cmp(a.numerodocumento, b.numerodocumento));
    },
    summarize: (rows, ctx) => {
      const media = avg([...groupBy(activas(ctx), o => o.Cliente_numeroDocumento).values()].map(os => sum(os.map(o => o.total))));
      return [
        { label: 'Clientes VIP', value: rows.length },
        { label: 'Umbral (promedio)', value: money(media) },
        { label: 'Gasto VIP total', value: money(sum(rows.map(r => r.total_gastado))) },
      ];
    },
  },
  {
    id: 10,
    category: 'Avanzado',
    title: 'Platos con Precio sobre el Promedio de su Categoría',
    subtitle: 'Subconsultas correlacionadas en WHERE y en SELECT',
    businessGoal: 'Detectar platos premium dentro de cada categoría de la carta para ingeniería de menú y costos.',
    managementContext: 'Balance entre platos de alta rentabilidad y platos tradicionales.',
    sqlTechniques: ['Subconsulta correlacionada en WHERE', 'Subconsulta correlacionada en SELECT', 'JOIN'],
    scoped: true,
    sqlQuery: sql(10),
    hasChart: false,
    columns: [
      { key: 'plato_bebida', header: 'Plato / bebida' },
      { key: 'categoria', header: 'Categoría' },
      { key: 'restaurante', header: 'Restaurante' },
      { key: 'precio', header: 'Precio', isCurrency: true, align: 'right' },
      { key: 'precio_promedio_categoria', header: 'Promedio categoría', isCurrency: true, align: 'right' },
      { key: 'sobreprecio_premium', header: 'Diferencial', isCurrency: true, align: 'right' },
    ],
    compute: ctx => {
      const promCat = (cat: number) => avg(ctx.itemsMenu.filter(i => i.CategoriaMenu_idCategoria === cat).map(i => i.precio));
      return ctx.itemsMenu
        .map(i => {
          const cm = ctx.cartasMenu.find(c => c.idCategoria === i.CategoriaMenu_idCategoria);
          const r = ctx.restaurantes.find(x => x.idRestaurante === cm?.Restaurante_idRestaurante);
          const prom = round(promCat(i.CategoriaMenu_idCategoria));
          return {
            iditem: i.idItem,
            plato_bebida: i.nombrItem,
            precio: i.precio,
            categoria: cm?.nombrecategoria,
            restaurante: r?.nombre,
            rid: r?.idRestaurante,
            precio_promedio_categoria: prom,
            sobreprecio_premium: i.precio - prom,
            _gt: i.precio > promCat(i.CategoriaMenu_idCategoria),
          };
        })
        .filter(r => r._gt && inScope(ctx, r.rid))
        .map(({ _gt, rid, ...r }) => r)
        .sort((a, b) => b.sobreprecio_premium - a.sobreprecio_premium || a.iditem - b.iditem);
    },
    summarize: rows => [
      { label: 'Platos premium', value: rows.length },
      { label: 'Mayor diferencial', value: money(rows[0]?.sobreprecio_premium || 0) },
      { label: 'Plato estrella', value: rows[0]?.plato_bebida || '-' },
    ],
  },
  {
    id: 11,
    category: 'Avanzado',
    title: 'Meseros Bilingües con Ventas sobre el Promedio de su Sede',
    subtitle: 'Subconsulta en SELECT + dos subconsultas correlacionadas en HAVING',
    businessGoal: 'Asignar mesas de turismo internacional y bonos de bilingüismo a los meseros políglotas de mayor recaudo.',
    managementContext: 'Personal que habla 2 o más idiomas y vende igual o más que el promedio de su propia sede.',
    sqlTechniques: ['Subconsulta en SELECT', 'HAVING correlacionado', 'AVG(SUM()) anidado', 'COUNT(*)'],
    scoped: true,
    sqlQuery: sql(11),
    hasChart: false,
    columns: [
      { key: 'mesero', header: 'Mesero' },
      { key: 'restaurante_sede', header: 'Sede' },
      { key: 'turno', header: 'Turno' },
      { key: 'idiomas_hablados', header: 'Idiomas', align: 'center' },
      { key: 'ordenes_atendidas', header: 'Órdenes', align: 'center' },
      { key: 'total_recaudado', header: 'Recaudo', isCurrency: true, align: 'right' },
    ],
    compute: ctx => {
      const porMesero = groupBy(salon(activas(ctx)).filter(o => o.meseroId), o => o.meseroId!) as Map<string, Orden[]>;
      const idiomas = (doc: string) => ctx.meseroIdiomas.filter(m => m.Mesero_Personal_numeroDocumento === doc).length;
      const filas = [...porMesero.entries()].map(([doc, os]) => {
        const p = ctx.personal.find(x => x.numeroDocumento === doc)!;
        return { p, doc, os, total: sum(os.map(o => o.total)) };
      });
      const mediaSede = (rid: number) => avg(filas.filter(f => f.p?.Restaurante_idRestaurante === rid).map(f => f.total));
      return filas
        .filter(f => f.p && inScope(ctx, f.p.Restaurante_idRestaurante))
        .filter(f => f.total >= mediaSede(f.p.Restaurante_idRestaurante) && idiomas(f.doc) >= 2)
        .map(f => ({
          numerodocumento: f.doc,
          mesero: `${f.p.Nombre} ${f.p.apellido}`,
          restaurante_sede: ctx.restaurantes.find(r => r.idRestaurante === f.p.Restaurante_idRestaurante)?.nombre,
          turno: ctx.meseros.find(m => m.Personal_numeroDocumento === f.doc)?.turno,
          idiomas_hablados: idiomas(f.doc),
          ordenes_atendidas: f.os.length,
          total_recaudado: f.total,
        }))
        .sort((a, b) => b.total_recaudado - a.total_recaudado || cmp(a.numerodocumento, b.numerodocumento));
    },
    summarize: rows => [
      { label: 'Meseros destacados', value: rows.length },
      { label: 'Máx. idiomas', value: Math.max(0, ...rows.map(r => r.idiomas_hablados)) },
      { label: 'Recaudo del grupo', value: money(sum(rows.map(r => r.total_recaudado))) },
    ],
  },
];

export const REPORT_ORDER = [1, 2, 3, 4, 5, 6, 7, 12, 8, 9, 10, 11];
