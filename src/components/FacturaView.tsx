import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { exportFacturaToPdf } from '../utils/pdfExport';
import { Download, Printer, User, UtensilsCrossed, CheckCircle, ShieldCheck, CreditCard, Clock } from 'lucide-react';

const cop = (n: number) => `$${(n || 0).toLocaleString('es-CO')}`;

export const FacturaView: React.FC = () => {
  const {
    ordenes: todas,
    clientes,
    restaurantes,
    ciudades,
    itemsMenu,
    experiencias,
    pagos,
    metodosPago,
    estados,
    selectedRestauranteId,
    user,
    registrarPago,
  } = useDatabase();

  // Ámbito: sede del gerente / filtro del administrador, u órdenes propias del turista
  const ordenes = todas.filter(o =>
    user?.rol === 'Turista'
      ? o.Cliente_numeroDocumento === user.clienteDocumento
      : !selectedRestauranteId || o.restauranteId === selectedRestauranteId
  );
  const [selectedOrdenId, setSelectedOrdenId] = useState<number>(ordenes[0]?.idOrden || 1);

  // Pago en línea (Pago + PagoMetodoPago)
  const [metodos, setMetodos] = useState<number[]>([2]);
  const [moneda, setMoneda] = useState('COP');
  const [propinaPct, setPropinaPct] = useState(10);
  const [payMsg, setPayMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [paying, setPaying] = useState(false);

  const selectedOrden = ordenes.find(o => o.idOrden === selectedOrdenId) || ordenes[0];

  if (!selectedOrden) {
    return <div className="text-center py-12 text-slate-500">No hay órdenes para facturar en este ámbito.</div>;
  }

  const cliente = clientes.find(c => c.numeroDocumento === selectedOrden.Cliente_numeroDocumento);
  const restaurante = restaurantes.find(r => r.idRestaurante === selectedOrden.restauranteId);
  const ciudad = ciudades.find(c => c.idCiudad === restaurante?.Ciudad_idCiudad);
  const pago = pagos.find(p => p.Orden_idOrden === selectedOrden.idOrden);
  const cancelada = selectedOrden.Estado_idEstado === 7;

  const subtotalBase = Math.round(selectedOrden.total / 1.08);
  const impoConsumo = selectedOrden.total - subtotalBase;
  const propina = pago ? pago.propina : Math.round((selectedOrden.total * propinaPct) / 100);
  const nombresMetodos = (pago?.metodosPagoIds || [])
    .map(id => metodosPago.find(m => m.idMetodoPago === id)?.nombre)
    .filter(Boolean)
    .join(' + ');

  const pagar = async () => {
    if (metodos.length === 0) return;
    setPaying(true);
    const r = await registrarPago({
      Orden_idOrden: selectedOrden.idOrden,
      monedaPago: moneda,
      totalPagado: selectedOrden.total,
      propina,
      metodosPagoIds: metodos,
      // Al pagar, la orden pasa a Completada (salón) o Entregada (domicilio)
      nuevoEstadoOrden: [5, 6].includes(selectedOrden.Estado_idEstado) ? undefined : selectedOrden.tipo === 'Domicilio' ? 5 : 6,
    });
    setPaying(false);
    setPayMsg({ ok: r.success, text: r.message });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              REQUISITO DE PLANTILLAS
            </span>
            <span className="text-xs text-slate-400">Factura / comprobante de pago</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Facturación y Pago en Línea</h2>
          <p className="text-xs text-slate-400">Plantilla generada desde Orden, sus detalles, Pago y PagoMetodoPago.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedOrden.idOrden}
            onChange={e => {
              setSelectedOrdenId(Number(e.target.value));
              setPayMsg(null);
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {ordenes.map(o => (
              <option key={o.idOrden} value={o.idOrden}>
                FAC-{String(o.idOrden).padStart(5, '0')} · {cop(o.total)} COP{pagos.some(p => p.Orden_idOrden === o.idOrden) ? ' · pagada' : ''}
              </option>
            ))}
          </select>
          <button
            onClick={() => exportFacturaToPdf(selectedOrden, cliente, restaurante, itemsMenu, experiencias, pago, nombresMetodos)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800 print:border-gray-300">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <h1 className="text-2xl font-black text-amber-400 print:text-amber-700 tracking-tight">SABOR & RUTA</h1>
            </div>
            <p className="text-xs font-bold text-slate-300 print:text-gray-700 mt-1">PLATAFORMA DE GESTIÓN TURÍSTICA Y GASTRONÓMICA</p>
            <p className="text-[11px] text-slate-500 print:text-gray-500">Universidad del Quindío • Bases de Datos I</p>
          </div>
          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 print:border-gray-400 print:text-black">
              FACTURA Nº FAC-{String(selectedOrden.idOrden).padStart(5, '0')}
            </span>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-2 font-mono">
              Fecha de la orden: <strong>{selectedOrden.fecha}</strong>
            </p>
            {pago ? (
              <p className="text-xs text-emerald-400 print:text-green-700 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" />
                <span>
                  PAGADA · Pago #{pago.idPago} · {pago.fechaPago}
                </span>
              </p>
            ) : (
              <p className="text-xs text-amber-400 print:text-amber-700 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>
                  {cancelada ? 'ORDEN CANCELADA' : 'PENDIENTE DE PAGO'} · {estados.find(e => e.idEstado === selectedOrden.Estado_idEstado)?.nombre}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 print:bg-gray-50 print:border-gray-200">
          <div>
            <h4 className="text-xs font-extrabold uppercase text-amber-400 print:text-amber-800 tracking-wider mb-1.5 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Restaurante emisor</span>
            </h4>
            <p className="text-sm font-bold text-white print:text-black">{restaurante?.nombre}</p>
            <p className="text-xs text-slate-400 print:text-gray-600 font-mono">NIT: {restaurante?.nit}</p>
            <p className="text-xs text-slate-400 print:text-gray-600">{restaurante?.direccion}</p>
            <p className="text-xs text-slate-500 print:text-gray-500">{ciudad?.nombre} - Colombia</p>
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase text-blue-400 print:text-blue-800 tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Cliente</span>
            </h4>
            <p className="text-sm font-bold text-white print:text-black">{cliente ? `${cliente.Nombre} ${cliente.apellido}` : selectedOrden.Cliente_numeroDocumento}</p>
            <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
              Doc: {cliente?.numeroDocumento} (País: {cliente?.paisOrigen})
            </p>
            <p className="text-xs text-slate-400 print:text-gray-600">{cliente?.email}</p>
            <p className="text-xs text-slate-500 print:text-gray-500">Móvil: {cliente?.telefono}</p>
          </div>
        </div>

        <div className="border border-slate-800 print:border-gray-200 rounded-2xl overflow-x-auto mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-gray-700 uppercase font-bold border-b border-slate-800 print:border-gray-200">
              <tr>
                <th className="px-4 py-3">Concepto</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-center">Cant.</th>
                <th className="px-4 py-3 text-right">Unitario</th>
                <th className="px-4 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-gray-200">
              {selectedOrden.detallesMenu?.map((dm, idx) => {
                const item = itemsMenu.find(m => m.idItem === dm.ItemMenu_idItem);
                return (
                  <tr key={`item-${idx}`}>
                    <td className="px-4 py-3 font-semibold text-white print:text-black">{item?.nombrItem || `Plato #${dm.ItemMenu_idItem}`}</td>
                    <td className="px-4 py-3 text-center text-slate-400 print:text-gray-600">Carta</td>
                    <td className="px-4 py-3 text-center font-mono">{dm.cantidad}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300 print:text-gray-700">{cop(item?.precio || 0)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white print:text-black">{cop(dm.subTotal)}</td>
                  </tr>
                );
              })}
              {selectedOrden.detallesExperiencia?.map((de, idx) => {
                const exp = experiencias.find(x => x.idExperiencia === de.ExperienciaTuristica_idExperiencia);
                return (
                  <tr key={`exp-${idx}`} className="bg-emerald-500/5 print:bg-emerald-50">
                    <td className="px-4 py-3 font-semibold text-emerald-300 print:text-emerald-900">
                      {exp?.nombreExperiencia} <span className="text-slate-500 font-normal">({de.fechaProgramada})</span>
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-400 print:text-emerald-800 font-semibold">Experiencia</td>
                    <td className="px-4 py-3 text-center font-mono">{de.asistentes} pers.</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300 print:text-gray-700">{cop(exp?.precioPorPersona || 0)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400 print:text-emerald-900">{cop(de.subtotal)}</td>
                  </tr>
                );
              })}
              {!!selectedOrden.costoDomicilio && (
                <tr>
                  <td className="px-4 py-3 font-semibold text-white print:text-black">Domicilio: {selectedOrden.direccionEntrega}</td>
                  <td className="px-4 py-3 text-center text-slate-400 print:text-gray-600">Envío</td>
                  <td className="px-4 py-3 text-center font-mono">1</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300 print:text-gray-700">{cop(selectedOrden.costoDomicilio)}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-white print:text-black">{cop(selectedOrden.costoDomicilio)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="max-w-xs space-y-2 text-xs text-slate-400 print:text-gray-600">
            <div className="flex items-center gap-1.5 text-slate-300 print:text-gray-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{pago ? `Medio de pago: ${nombresMetodos || 'N/D'} (${pago.monedaPago})` : 'Sin pago registrado'}</span>
            </div>
            <p className="text-[11px] leading-relaxed">Precios con impoconsumo (8%) incluido. La propina es voluntaria y se registra en Pago.propina.</p>
          </div>
          <div className="w-full sm:w-72 p-4 rounded-2xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>Base gravable:</span>
              <span className="font-mono">{cop(subtotalBase)} COP</span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>Impoconsumo (8%):</span>
              <span className="font-mono">{cop(impoConsumo)} COP</span>
            </div>
            <div className="flex justify-between text-slate-300 print:text-gray-800 font-semibold">
              <span>Total orden:</span>
              <span className="font-mono">{cop(selectedOrden.total)} COP</span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>Propina {pago ? '' : `sugerida (${propinaPct}%)`}:</span>
              <span className="font-mono">{cop(propina)} COP</span>
            </div>
            <div className="pt-2 border-t border-slate-800 print:border-gray-300 flex justify-between items-center">
              <span className="text-sm font-extrabold text-white print:text-black">{pago ? 'TOTAL PAGADO:' : 'TOTAL A PAGAR:'}</span>
              <span className="text-base font-black text-amber-400 print:text-amber-800 font-mono">{cop(selectedOrden.total + propina)} COP</span>
            </div>
          </div>
        </div>
      </div>

      {!pago && !cancelada && (
        <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 no-print">
          <div className="flex flex-wrap items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Pago en línea de la orden #{selectedOrden.idOrden}</h3>
            <span className="text-[10px] text-slate-500">INSERT en Pago + PagoMetodoPago (N:M: admite pago mixto)</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 mb-2">Medios de pago</p>
            <div className="flex flex-wrap gap-2">
              {metodosPago.map(m => {
                const on = metodos.includes(m.idMetodoPago);
                return (
                  <button
                    key={m.idMetodoPago}
                    onClick={() => setMetodos(on ? metodos.filter(x => x !== m.idMetodoPago) : [...metodos, m.idMetodoPago])}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                      on ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    {m.nombre}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-[11px] font-semibold text-slate-400">
              Moneda
              <select value={moneda} onChange={e => setMoneda(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
                <option value="COP">COP - Peso colombiano</option>
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </label>
            <label className="text-[11px] font-semibold text-slate-400">
              Propina
              <select value={propinaPct} onChange={e => setPropinaPct(Number(e.target.value))} className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
                {[0, 5, 10, 15].map(p => (
                  <option key={p} value={p}>
                    {p}%
                  </option>
                ))}
              </select>
            </label>
          </div>
          {payMsg && <div className={`p-3 rounded-xl text-xs ${payMsg.ok ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>{payMsg.text}</div>}
          <button
            onClick={pagar}
            disabled={paying || metodos.length === 0}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs"
          >
            {paying ? 'Procesando…' : `Registrar pago de ${cop(selectedOrden.total + propina)} COP`}
          </button>
        </div>
      )}
    </div>
  );
};
