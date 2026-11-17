import React, { useEffect, useRef, useState } from 'react';
import { Bell, CalendarClock, AlertTriangle, CreditCard, Check, X } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

/**
 * Centro de recordatorios y notificaciones (característica mínima del caso de estudio).
 * Se calcula sobre Reserva, Orden y Pago: reservas próximas, reservas por confirmar,
 * órdenes en curso y órdenes servidas sin pago registrado.
 */
export const NotificacionesBell: React.FC = () => {
  const { notificaciones, updateEstadoReserva, user } = useDatabase();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const puedeGestionar = user?.rol === 'Administrador' || user?.rol === 'Gerente';

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const cambiar = async (idReserva: number, estado: number) => {
    const r = await updateEstadoReserva(idReserva, estado);
    setMsg(r.message);
    setTimeout(() => setMsg(null), 3500);
  };

  const icon = (tipo: string) =>
    tipo === 'recordatorio' ? (
      <CalendarClock className="w-4 h-4 text-sky-400" />
    ) : tipo === 'pendiente' ? (
      <CreditCard className="w-4 h-4 text-amber-400" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-rose-400" />
    );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
        title="Recordatorios y notificaciones"
        aria-label="Notificaciones"
      >
        <Bell className="w-4 h-4" />
        {notificaciones.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
            {notificaciones.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(24rem,calc(100vw-2rem))] max-h-[70vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Recordatorios y notificaciones</span>
            <span className="text-[10px] text-slate-500">{notificaciones.length} activas</span>
          </div>
          {msg && <div className="px-4 py-2 text-[11px] text-emerald-300 bg-emerald-500/10">{msg}</div>}
          {notificaciones.length === 0 ? (
            <p className="px-4 py-6 text-xs text-slate-500 text-center">No hay recordatorios pendientes.</p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {notificaciones.map(n => {
                const idReserva = n.id.startsWith('res-') ? Number(n.id.slice(4)) : null;
                return (
                  <li key={n.id} className="px-4 py-3 flex gap-3">
                    <div className="mt-0.5">{icon(n.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{n.titulo}</p>
                      <p className="text-[11px] text-slate-400 leading-snug">{n.detalle}</p>
                      {idReserva && puedeGestionar && n.tipo === 'pendiente' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => cambiar(idReserva, 2)}
                            className="px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Confirmar
                          </button>
                          <button
                            onClick={() => cambiar(idReserva, 7)}
                            className="px-2 py-1 rounded-md bg-rose-500/15 text-rose-300 text-[10px] font-bold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
