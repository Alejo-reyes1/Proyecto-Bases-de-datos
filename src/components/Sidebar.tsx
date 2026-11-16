import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Compass,
  ShoppingBag,
  FileBarChart2,
  Receipt,
  Layers,
  CalendarCheck,
  Building
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'reserva_turista'
  | 'restaurantes'
  | 'clientes'
  | 'experiencias'
  | 'ordenes'
  | 'reportes'
  | 'factura'
  | 'modelo30';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useDatabase();

  const menuItems = [
    { id: 'dashboard', label: 'Panel Ejecutivo', icon: LayoutDashboard, badge: null },
    { id: 'reserva_turista', label: 'Hacer una Reserva', icon: CalendarCheck, badge: 'Flujo Turista' },
    {
      type: 'section',
      label: 'Módulos CRUD Core (4 Tablas)',
    },
    { id: 'restaurantes', label: 'Restaurantes', icon: UtensilsCrossed, badge: 'Core 1' },
    { id: 'clientes', label: 'Clientes / Turistas', icon: Users, badge: 'Core 2' },
    { id: 'experiencias', label: 'Experiencias Turísticas', icon: Compass, badge: 'Core 3' },
    { id: 'ordenes', label: 'Órdenes & Pedidos', icon: ShoppingBag, badge: 'Core 4' },
    {
      type: 'section',
      label: 'Reportes & Documentos',
    },
    { id: 'reportes', label: 'Centro de Reportes', icon: FileBarChart2, badge: '11 Consultas' },
    { id: 'factura', label: 'Plantilla de Factura', icon: Receipt, badge: 'Plantilla' },
    {
      type: 'section',
      label: 'Arquitectura de Datos',
    },
    { id: 'modelo30', label: 'Modelo de 30 Tablas', icon: Layers, badge: '30 Tablas' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="space-y-1">
        {/* User Scope Banner */}
        {user?.rol === 'Gerente' && user.restauranteNombre && (
          <div className="p-3 mb-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
            <Building className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-[11px] leading-tight">Sede Gerencial:</p>
              <p className="text-[10px] text-amber-400/90 leading-tight mt-0.5">{user.restauranteNombre}</p>
            </div>
          </div>
        )}

        {menuItems.map((item, index) => {
          if (item.type === 'section') {
            return (
              <div key={index} className="pt-4 pb-1 px-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {item.label}
                </p>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-800 text-amber-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mt-6">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <span className="text-[11px] font-bold text-slate-200">Bases de Datos I</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Oracle Autonomous Database Cloud • Universidad del Quindío.
        </p>
      </div>
    </aside>
  );
};
