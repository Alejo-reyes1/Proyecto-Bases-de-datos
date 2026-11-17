import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { ActiveTab } from './Sidebar';
import {
  UtensilsCrossed,
  Users,
  Compass,
  ShoppingBag,
  TrendingUp,
  Globe2,
  Award,
  ChevronRight,
  Database
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

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const { restaurantes, clientes, experiencias, ordenes, paises } = useDatabase();

  // Ventas reales por sede (salón y domicilio), excluyendo órdenes canceladas (Estado 7)
  const activas = ordenes.filter(o => o.Estado_idEstado !== 7);
  const totalFacturado = activas.reduce((acc, curr) => acc + curr.total, 0);
  const turistasExtranjeros = clientes.filter(c => c.paisOrigen !== 'CO').length;

  const salesByRestaurante = restaurantes.map(r => ({
    name: r.nombre.length > 15 ? r.nombre.slice(0, 14) + '...' : r.nombre,
    ventas: activas.filter(o => o.restauranteId === r.idRestaurante).reduce((s, o) => s + o.total, 0),
  }));

  // Chart 2 data: Tourists by country
  const countryCounts: Record<string, number> = {};
  clientes.forEach(c => {
    const p = paises.find(p => p.idPais === c.paisOrigen)?.nombre || c.paisOrigen;
    countryCounts[p] = (countryCounts[p] || 0) + 1;
  });

  const touristsByCountry = Object.entries(countryCounts).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PROYECTO FINAL BD1 • 2026-2
            </span>
            <span className="text-xs text-slate-400">Universidad del Quindío</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Plataforma Turística y Gastronómica: Sabor & Ruta
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Gestión integral de restaurantes, reservas de mesas, tours culinarios, catas de café en el Eje Cafetero, 
            delivery en zonas turísticas y generación de reportes analíticos con base en 30 entidades relacionales.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('reportes')}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          <span>Ir a Reportes Evaluables</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Restaurantes */}
        <div
          onClick={() => setActiveTab('restaurantes')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Restaurantes Turísticos</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{restaurantes.length}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-amber-400 font-bold">4 Regiones</span>
            <span>(Quindío, Caribe, Antioquia, Bogotá)</span>
          </p>
        </div>

        {/* Clientes */}
        <div
          onClick={() => setActiveTab('clientes')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Turistas & Clientes</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{clientes.length}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 font-bold">{turistasExtranjeros} Internacionales</span>
            <span>registrados</span>
          </p>
        </div>

        {/* Experiencias */}
        <div
          onClick={() => setActiveTab('experiencias')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Experiencias Turísticas</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">{experiencias.length}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tours cafeteros, catas y talleres chef</span>
          </p>
        </div>

        {/* Facturación */}
        <div
          onClick={() => setActiveTab('ordenes')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Facturación Total</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">
            ${totalFacturado.toLocaleString('es-CO')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-purple-400 font-bold">{ordenes.length} Órdenes</span>
            <span>(Mesa + Domicilio turístico)</span>
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Restaurant Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Facturación por Restaurante</h3>
              <p className="text-xs text-slate-400">Distribución de ingresos en pesos colombianos (COP)</p>
            </div>
            <button
              onClick={() => setActiveTab('reportes')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Ver Reporte #4
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByRestaurante} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString('es-CO')} COP`, 'Facturación']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="ventas" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tourists by Country Pie Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Turistas por País</h3>
              <p className="text-xs text-slate-400">Nacionales vs Internacionales</p>
            </div>
            <button
              onClick={() => setActiveTab('reportes')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Ver Reporte #7
            </button>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={touristsByCountry}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {touristsByCountry.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [value, 'Turistas']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model & Database Showcase Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Modelo Relacional de 30 Tablas</h4>
            <p className="text-xs text-slate-400">
              Cumple con creces el requisito del docente (mínimo 10 entidades fuertes) y modela el dominio turístico completo.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('modelo30')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
        >
          Explorar Diccionario de 30 Tablas
        </button>
      </div>
    </div>
  );
};
