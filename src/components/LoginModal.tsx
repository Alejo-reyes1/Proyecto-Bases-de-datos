import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { UserSession } from '../types';
import { Lock, User, Shield, X, Sparkles, Coffee, Compass } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_USERS: {
  usuario: string;
  clave: string;
  rol: UserSession['rol'];
  nombre: string;
  restauranteId?: number;
  restauranteNombre?: string;
  icon: any;
}[] = [
  {
    usuario: 'admin',
    clave: 'admin123',
    rol: 'Administrador',
    nombre: 'Alejandro (Admin Global)',
    icon: Shield
  },
  {
    usuario: 'gerente.salento',
    clave: 'salento123',
    rol: 'Gerente',
    nombre: 'Luis Echeverri (Gerente Salento)',
    restauranteId: 1,
    restauranteNombre: 'El Fogón Cafetero (Salento, Quindío)',
    icon: Coffee
  },
  {
    usuario: 'gerente.cartagena',
    clave: 'cartagena123',
    rol: 'Gerente',
    nombre: 'Beatriz Herrera (Gerente Cartagena)',
    restauranteId: 2,
    restauranteNombre: 'Mar y Murallas (Cartagena)',
    icon: Compass
  },
  {
    usuario: 'turista.carlos',
    clave: 'turista123',
    rol: 'Turista',
    nombre: 'Carlos Gómez (Turista)',
    icon: User
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useDatabase();

  const [usuario, setUsuario] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = PRESET_USERS.find(
      u => u.usuario.toLowerCase() === usuario.toLowerCase() && u.clave === password
    );
    if (found) {
      login({
        usuario: found.usuario,
        nombre: found.nombre,
        rol: found.rol,
        restauranteId: found.restauranteId,
        restauranteNombre: found.restauranteNombre
      });
      setError(null);
      onClose();
    } else {
      setError('Credenciales inválidas. Compruebe su usuario y contraseña en Oracle DB.');
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_USERS[0]) => {
    login({
      usuario: preset.usuario,
      nombre: preset.nombre,
      rol: preset.rol,
      restauranteId: preset.restauranteId,
      restauranteNombre: preset.restauranteNombre
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Cambiar de Usuario</h3>
              <p className="text-[11px] text-slate-400">Autenticación por Roles y Sedes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Usuario *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="ej. admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all mt-2"
          >
            Validar y Cambiar de Sesión
          </button>

          {/* Quick presets */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Accesos Rápidos de Demostración:</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_USERS.map((preset) => (
                <button
                  key={preset.usuario}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
                >
                  <p className="text-[11px] font-bold text-white truncate">{preset.rol}</p>
                  <p className="text-[10px] text-slate-500 truncate font-mono">user: {preset.usuario}</p>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
