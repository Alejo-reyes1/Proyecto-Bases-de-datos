import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { UserSession } from '../types';
import {
  UtensilsCrossed,
  Shield,
  Coffee,
  Compass,
  ArrowRight,
  Lock,
  User,
  Sparkles,
  MapPin,
  CheckCircle2,
  CalendarCheck,
  ChevronRight
} from 'lucide-react';

interface LandingPortalViewProps {
  onStartBookingAsGuest: () => void;
}

export const LandingPortalView: React.FC<LandingPortalViewProps> = ({ onStartBookingAsGuest }) => {
  const { login, restaurantes, experiencias } = useDatabase();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-configured test roles matching database records
  const PROFILES: {
    id: string;
    username: string;
    pass: string;
    name: string;
    role: UserSession['rol'];
    restaurantId?: number;
    restaurantName?: string;
    badge: string;
    badgeColor: string;
    icon: any;
    description: string;
  }[] = [
    {
      id: 'admin',
      username: 'admin',
      pass: 'admin123',
      name: 'Alejandro (Arquitecto de BD & Admin)',
      role: 'Administrador',
      badge: 'Acceso Total 30 Tablas',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: Shield,
      description: 'Supervisa las 6 sedes en Colombia, ejecuta auditoría DDL, consolidado nacional y reportes globales.'
    },
    {
      id: 'gerente-salento',
      username: 'gerente.salento',
      pass: 'salento123',
      name: 'Luis Echeverri (Gerente)',
      role: 'Gerente',
      restaurantId: 1,
      restaurantName: 'El Fogón Cafetero (Salento, Quindío)',
      badge: 'Gerente Sede Salento',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Coffee,
      description: 'Gestión exclusiva de El Fogón Cafetero: tours de café, truchas al ajillo, comandas en mesa y reportes locales.'
    },
    {
      id: 'gerente-cartagena',
      username: 'gerente.cartagena',
      pass: 'cartagena123',
      name: 'Beatriz Herrera (Gerente)',
      role: 'Gerente',
      restaurantId: 2,
      restaurantName: 'Mar y Murallas (Cartagena de Indias)',
      badge: 'Gerente Sede Cartagena',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: Compass,
      description: 'Gestión exclusiva de Mar y Murallas: carta de mariscos, ruta gastronómica amurallada y delivery turístico.'
    },
    {
      id: 'turista',
      username: 'turista.carlos',
      pass: 'turista123',
      name: 'Carlos Gómez (Turista / Viajero)',
      role: 'Turista',
      badge: 'Comensal & Turista',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: CalendarCheck,
      description: 'Explora restaurantes, reserva mesas con peticiones especiales, contrata catas de café y obtiene su voucher.'
    }
  ];

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = PROFILES.find(
      p => p.username.toLowerCase() === username.toLowerCase() && p.pass === password
    );

    if (matched) {
      login({
        usuario: matched.username,
        nombre: matched.name,
        rol: matched.role,
        restauranteId: matched.restaurantId,
        restauranteNombre: matched.restaurantName
      });
    } else {
      setErrorMessage('Credenciales no válidas. Pruebe uno de los perfiles rápidos del sistema.');
    }
  };

  const handleQuickLogin = (profile: typeof PROFILES[0]) => {
    login({
      usuario: profile.username,
      nombre: profile.name,
      rol: profile.role,
      restauranteId: profile.restaurantId,
      restauranteNombre: profile.restaurantName
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top Banner Navigation */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 font-bold">
              🍽️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Sabor & Ruta</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Colombia
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Universidad del Quindío • Bases de Datos I</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Oracle Cloud Autonomous DB (sa-bogota-1)
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section with Login Gate */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Storytelling & Academic Framing */}
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Caso de Estudio #4: Turismo Gastronómico & Restaurantes</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Gestión Inteligente de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">Restaurantes & Rutas Culinarias</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Plataforma universitaria con arquitectura relacional de <strong>30 tablas</strong> para la administración de sedes gastronómicas, tours de café en el Quindío, talleres culinarios caribeños, reservas de mesas y analítica gerencial en Oracle Database 21c.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-2xl font-black text-amber-400 font-mono">30</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Tablas Relacionales</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-2xl font-black text-blue-400 font-mono">11</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Reportes Oficiales</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-2xl font-black text-emerald-400 font-mono">6</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Sedes Turísticas</p>
            </div>
          </div>

          {/* Direct Tourist Reservation Shortcut */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white">¿Deseas probar el flujo como Turista?</p>
              <p className="text-[11px] text-slate-400">Reserva mesas y tours sin escribir contraseña</p>
            </div>
            <button
              onClick={() => handleQuickLogin(PROFILES[3])}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Hacer una Reserva</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Mandatory Login Box & Role Switcher */}
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Portal de Autenticación</h2>
              <p className="text-xs text-slate-400">Inicio de sesión obligatorio para acceder al sistema</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Quick 1-Click Role Profiles (Prepared for University Defense) */}
          <div className="space-y-2 mb-6">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Selecciona un Perfil para la Sustentación:</span>
            </span>

            {PROFILES.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => handleQuickLogin(p)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-all group flex items-start gap-3"
                >
                  <div className="p-2 rounded-xl bg-slate-900 text-slate-300 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-white truncate">{p.name.split('(')[0]}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${p.badgeColor} shrink-0`}>
                        {p.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight line-clamp-1">{p.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500 font-semibold text-[10px]">O ingresa credenciales</span></div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleManualLogin} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Usuario</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="ej. admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Acceder al Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-900 text-center text-xs text-slate-400">
        Universidad del Quindío • Facultad de Ingeniería • Programa de Ingeniería de Sistemas y Computación • Bases de Datos I
      </footer>
    </div>
  );
};
