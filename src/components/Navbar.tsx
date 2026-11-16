import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Database, Shield, RotateCcw, User, LogOut, Building } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const {
    user,
    logout,
    resetDatabase,
    restaurantes,
    selectedRestauranteId,
    setSelectedRestauranteId
  } = useDatabase();

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer todas las tablas a los datos originales de Oracle (DML de prueba)?')) {
      resetDatabase();
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 font-bold">
          🍽️
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-white tracking-tight">Sabor & Ruta</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Gastronomía Turística
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>Universidad del Quindío</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Bases de Datos I</span>
          </p>
        </div>
      </div>

      {/* Cloud DB & Actions */}
      <div className="flex items-center gap-3">
        {/* Administrator Global Restaurant Switcher */}
        {user?.rol === 'Administrador' && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedRestauranteId ?? ''}
              onChange={(e) => setSelectedRestauranteId(e.target.value === '' ? null : Number(e.target.value))}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">Vista Global (6 Sedes)</option>
              {restaurantes.map(r => (
                <option key={r.idRestaurante} value={r.idRestaurante} className="bg-slate-900">
                  {r.nombre} ({r.Ciudad_idCiudad})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Oracle Cloud Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Database className="w-3.5 h-3.5" />
          <span className="font-medium">Oracle Autonomous DB (OCI)</span>
        </div>

        {/* Quick DML Reset */}
        <button
          onClick={handleReset}
          title="Restablecer tablas con los INSERTs oficiales de prueba"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restablecer DML</span>
        </button>

        {/* User Session */}
        {user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{user.nombre}</p>
              <div className="flex items-center justify-end gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-amber-400 font-medium">
                  {user.rol} {user.restauranteNombre ? `• ${user.restauranteNombre.split('(')[0]}` : ''}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Cerrar Sesión e Ir al Portal de Inicio"
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition-colors border border-slate-700 flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[11px] font-semibold hidden md:inline">Salir</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-md shadow-amber-500/20 transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>
        )}
      </div>
    </header>
  );
};
