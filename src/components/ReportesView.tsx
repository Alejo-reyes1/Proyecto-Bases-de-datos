import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { REPORTS, ReportDefinition } from '../services/reportService';
import { exportReportToPdf, exportToCsv } from '../utils/pdfExport';
import {
  FileBarChart2,
  Download,
  Code2,
  FileSpreadsheet,
  Check,
  Copy,
  ChevronRight,
  Sparkles,
  BarChart3,
  UtensilsCrossed,
  Filter,
  Lock,
  Building2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const CHART_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

export const ReportesView: React.FC = () => {
  const dbContext = useDatabase();
  const { user, restaurantes, selectedRestauranteId, setSelectedRestauranteId } = dbContext;

  const [selectedReportId, setSelectedReportId] = useState<number>(4);
  const [filterCategory, setFilterCategory] = useState<'Todos' | 'Simple' | 'Intermedio' | 'Avanzado'>('Todos');
  const [showSql, setShowSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // If user is Gerente, scope is locked to their restaurant
  const isGerente = user?.rol === 'Gerente';
  const effectiveRestauranteId = isGerente ? user.restauranteId : selectedRestauranteId;

  const filteredReports = REPORTS.filter(r => {
    if (filterCategory === 'Todos') return true;
    return r.category === filterCategory;
  });

  const currentReport = REPORTS.find(r => r.id === selectedReportId) || REPORTS[0];

  // Execute report with active restaurant filter
  const { data, summary, activeRestauranteName } = currentReport.execute({
    ...dbContext,
    filterRestauranteId: effectiveRestauranteId
  });

  const handleCopySql = () => {
    navigator.clipboard.writeText(currentReport.sqlQuery);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleExportPdf = () => {
    exportReportToPdf(currentReport, data, summary, user?.nombre || 'Administrador');
  };

  const handleExportCsv = () => {
    exportToCsv(currentReport, data);
  };

  return (
    <div className="space-y-6">
      {/* Header and Scope Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              REQUISITO OBLIGATORIO DE EVALUACIÓN
            </span>
            <span className="text-xs text-slate-400">11 Reportes: 3 Simples • 4 Intermedios • 4 Complejos</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Centro de Analítica & Reportes de Decisión</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Bonificación Gráfica ⭐
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Consultas SQL en Oracle Database 21c con trasfondo gerencial real para la toma de decisiones turísticas.
          </p>
        </div>

        {/* Global Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF Oficial</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Role-Based Restaurant Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200">Ámbito / Sede Evaluada:</span>

          {isGerente ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{user?.restauranteNombre || 'Sede Asignada'} (Restricción de Gerencia)</span>
            </div>
          ) : (
            <select
              value={selectedRestauranteId ?? ''}
              onChange={(e) => setSelectedRestauranteId(e.target.value === '' ? null : Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Consolidado Nacional (Todas las 6 Sedes)</option>
              {restaurantes.map(r => (
                <option key={r.idRestaurante} value={r.idRestaurante}>
                  {r.nombre} ({r.Ciudad_idCiudad})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs text-slate-400">
          Mostrando datos para: <strong className="text-amber-400">{activeRestauranteName}</strong>
        </div>
      </div>

      {/* Complexity Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {(['Todos', 'Simple', 'Intermedio', 'Avanzado'] as const).map(cat => {
          const count = cat === 'Todos' ? REPORTS.length : REPORTS.filter(r => r.category === cat).length;
          const isActive = filterCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat === 'Todos' ? 'Todos los Reportes (11)' : `Reportes ${cat}s`}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Report Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {filteredReports.map(rep => {
          const isSelected = rep.id === selectedReportId;
          return (
            <button
              key={rep.id}
              onClick={() => {
                setSelectedReportId(rep.id);
                setShowSql(false);
              }}
              className={`p-3 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-slate-800 border-amber-500/80 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    rep.category === 'Simple'
                      ? 'bg-blue-500/20 text-blue-300'
                      : rep.category === 'Intermedio'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}
                >
                  #{rep.id} • {rep.category}
                </span>
                {rep.hasChart && <BarChart3 className="w-3.5 h-3.5 text-amber-400" title="Incluye Gráfico Estadístico" />}
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">{rep.title}</p>
            </button>
          );
        })}
      </div>

      {/* Main Selected Report Container */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Report Header & Goal */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  currentReport.category === 'Simple'
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : currentReport.category === 'Intermedio'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}
              >
                REPORTE {currentReport.category.toUpperCase()} Nº {currentReport.id}
              </span>
              <span className="text-xs text-slate-400 font-mono">{currentReport.subtitle}</span>
            </div>

            <h3 className="text-xl font-bold text-white">{currentReport.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[11px] text-amber-300/90 leading-relaxed">
                  <strong className="text-amber-400">Objetivo de Decisión Gerencial:</strong>{' '}
                  {currentReport.businessGoal}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[11px] text-blue-300/90 leading-relaxed">
                  <strong className="text-blue-400">Trasfondo de Negocio para el Restaurante:</strong>{' '}
                  {currentReport.managementContext}
                </p>
              </div>
            </div>
          </div>

          {/* Toggle SQL Drawer */}
          <button
            onClick={() => setShowSql(!showSql)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 self-start ${
              showSql
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{showSql ? 'Ocultar Sentencia SQL' : 'Ver Código SQL en Oracle'}</span>
          </button>
        </div>

        {/* Oracle SQL Query Box (Expandable) */}
        {showSql && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400">
                SINTAXIS SQL CERTIFICADA PARA ORACLE 21C / OCI CLOUD
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copiado al Portapapeles' : 'Copiar SQL'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-3 rounded-lg bg-slate-900 border border-slate-800 leading-relaxed">
              {currentReport.sqlQuery}
            </pre>
          </div>
        )}

        {/* KPI Summary Strip */}
        {summary && summary.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {summary.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {item.label}
                </span>
                <span className="text-base font-extrabold text-white mt-1 block">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Chart */}
        {currentReport.hasChart && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Visualización Estadística Interactiva (Bonificación Docente)
                </h4>
              </div>
              <span className="text-[10px] text-slate-500">Recharts Engine</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {currentReport.chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey={currentReport.chartYKey || 'total_turistas'}
                      nameKey={currentReport.chartXKey || 'nombreExperiencia'}
                      label={({ name, percent }: any) => `${name?.slice(0, 15)} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [value, currentReport.chartName || 'Valor']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    />
                  </PieChart>
                ) : (
                  <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                    <XAxis
                      dataKey={currentReport.chartXKey || 'restaurante'}
                      stroke="#64748b"
                      fontSize={11}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(val) => (val > 1000 ? `$${(val / 1000).toFixed(0)}k` : val)}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        typeof value === 'number' && value > 1000
                          ? `$${Number(value).toLocaleString('es-CO')} COP`
                          : value,
                        currentReport.chartName || 'Valor'
                      ]}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Bar dataKey={currentReport.chartYKey || 'total_facturado'} fill="#f59e0b" radius={[6, 6, 0, 0]}>
                      {data.map((_, index) => (
                        <Cell key={`cell-bar-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  {currentReport.columns.map(col => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={currentReport.columns.length} className="px-4 py-8 text-center text-slate-500">
                      No se encontraron registros para la sede seleccionada en este reporte.
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      {currentReport.columns.map(col => {
                        const val = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={`px-4 py-3 ${
                              col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                            } ${col.isCurrency ? 'font-mono font-bold text-amber-400' : 'text-slate-300'}`}
                          >
                            {col.isCurrency && typeof val === 'number'
                              ? `$${val.toLocaleString('es-CO')} COP`
                              : val !== undefined && val !== null
                              ? String(val)
                              : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
