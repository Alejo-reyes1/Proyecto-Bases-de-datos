import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { exportFacturaToPdf } from '../utils/pdfExport';
import { Receipt, Download, Printer, User, UtensilsCrossed, CheckCircle, ShieldCheck } from 'lucide-react';

export const FacturaView: React.FC = () => {
  const { ordenes, clientes, restaurantes, itemsMenu, experiencias, pagos } = useDatabase();

  const [selectedOrdenId, setSelectedOrdenId] = useState<number>(ordenes[0]?.idOrden || 1);

  const selectedOrden = ordenes.find(o => o.idOrden === selectedOrdenId) || ordenes[0];
  const cliente = clientes.find(c => c.numeroDocumento === selectedOrden?.Cliente_numeroDocumento);
  const restaurante = restaurantes[0]; // Sede principal
  const pago = pagos.find(p => p.Orden_idOrden === selectedOrden?.idOrden);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (selectedOrden) {
      exportFacturaToPdf(selectedOrden, cliente, restaurante, itemsMenu, experiencias);
    }
  };

  if (!selectedOrden) {
    return <div className="text-center py-12 text-slate-500">No hay órdenes registradas para facturar.</div>;
  }

  const subtotalBase = Math.round(selectedOrden.total / 1.08);
  const impoConsumo = Math.round(selectedOrden.total - subtotalBase);
  const propina = Math.round(selectedOrden.total * 0.1);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              REQUISITO DE PLANTILLAS
            </span>
            <span className="text-xs text-slate-400">Documento Oficial: Factura Electrónica Turística</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Plantilla de Facturación y Comprobante de Pago
          </h2>
          <p className="text-xs text-slate-400">
            Formato oficial con membrete universitario, liquidación de consumos y experiencias contratadas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedOrdenId}
            onChange={(e) => setSelectedOrdenId(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {ordenes.map(o => (
              <option key={o.idOrden} value={o.idOrden}>
                Factura #FAC-00{o.idOrden} (${o.total.toLocaleString('es-CO')} COP)
              </option>
            ))}
          </select>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Invoice Document Preview (Printable) */}
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Invoice Top Header */}
        <div className="flex justify-between items-start pb-6 border-b border-slate-800 print:border-gray-300">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <h1 className="text-2xl font-black text-amber-400 print:text-amber-700 tracking-tight">
                SABOR & RUTA
              </h1>
            </div>
            <p className="text-xs font-bold text-slate-300 print:text-gray-700 mt-1">
              PLATAFORMA INTEGRAL DE GESTIÓN TURÍSTICA Y GASTRONÓMICA
            </p>
            <p className="text-[11px] text-slate-500 print:text-gray-500">
              Universidad del Quindío • Laboratorio de Usabilidad • SINFOCI
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 print:border-gray-400 print:text-black">
              FACTURA Nº FAC-00{selectedOrden.idOrden}
            </span>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-2 font-mono">
              Fecha de Emisión: <strong>{selectedOrden.fecha}</strong>
            </p>
            <p className="text-xs text-emerald-400 print:text-green-700 font-bold flex items-center justify-end gap-1 mt-0.5">
              <CheckCircle className="w-3 h-3" />
              <span>ESTADO: PAGADA Y VALIDADA</span>
            </p>
          </div>
        </div>

        {/* Emisor y Receptor */}
        <div className="grid grid-cols-2 gap-6 my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 print:bg-gray-50 print:border-gray-200">
          <div>
            <h4 className="text-xs font-extrabold uppercase text-amber-400 print:text-amber-800 tracking-wider mb-1.5 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Restaurante Emisor</span>
            </h4>
            <p className="text-sm font-bold text-white print:text-black">{restaurante?.nombre || 'El Fogón Cafetero'}</p>
            <p className="text-xs text-slate-400 print:text-gray-600 font-mono">NIT: {restaurante?.nit || '900123451-1'}</p>
            <p className="text-xs text-slate-400 print:text-gray-600">{restaurante?.direccion || 'Calle Real # 6-15'}</p>
            <p className="text-xs text-slate-500 print:text-gray-500">Salento, Quindío - Colombia</p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase text-blue-400 print:text-blue-800 tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Datos del Turista / Comensal</span>
            </h4>
            <p className="text-sm font-bold text-white print:text-black">
              {cliente ? `${cliente.Nombre} ${cliente.apellido}` : 'Cliente Mostrador'}
            </p>
            <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
              Doc: {cliente?.numeroDocumento || 'N/A'} (País: {cliente?.paisOrigen || 'CO'})
            </p>
            <p className="text-xs text-slate-400 print:text-gray-600">{cliente?.email || 'N/A'}</p>
            <p className="text-xs text-slate-500 print:text-gray-500">Móvil: {cliente?.telefono || 'N/A'}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-slate-800 print:border-gray-200 rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-gray-700 uppercase font-bold border-b border-slate-800 print:border-gray-200">
              <tr>
                <th className="px-4 py-3">Concepto / Servicio Turístico</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-center">Cant / Cupos</th>
                <th className="px-4 py-3 text-right">Tarifa Unit.</th>
                <th className="px-4 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-gray-200">
              {selectedOrden.detallesMenu?.map((dm, idx) => {
                const item = itemsMenu.find(m => m.idItem === dm.ItemMenu_idItem);
                return (
                  <tr key={`item-${idx}`} className="hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-semibold text-white print:text-black">
                      {item?.nombrItem || `Plato #${dm.ItemMenu_idItem}`}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-400 print:text-gray-600">Menú Carta</td>
                    <td className="px-4 py-3 text-center font-mono">{dm.cantidad}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300 print:text-gray-700">
                      ${(item?.precio || 0).toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white print:text-black">
                      ${dm.subTotal.toLocaleString('es-CO')}
                    </td>
                  </tr>
                );
              })}

              {selectedOrden.detallesExperiencia?.map((de, idx) => {
                const exp = experiencias.find(x => x.idExperiencia === de.ExperienciaTuristica_idExperiencia);
                return (
                  <tr key={`exp-${idx}`} className="bg-emerald-500/5 print:bg-emerald-50">
                    <td className="px-4 py-3 font-semibold text-emerald-300 print:text-emerald-900">
                      🌿 {exp?.nombreExperiencia || `Experiencia #${de.ExperienciaTuristica_idExperiencia}`}
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-400 print:text-emerald-800 font-semibold">
                      Experiencia Turística
                    </td>
                    <td className="px-4 py-3 text-center font-mono">{de.asistentes} pers.</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300 print:text-gray-700">
                      ${(exp?.precioPorPersona || 0).toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400 print:text-emerald-900">
                      ${de.subtotal.toLocaleString('es-CO')}
                    </td>
                  </tr>
                );
              })}

              {selectedOrden.costoDomicilio && selectedOrden.costoDomicilio > 0 && (
                <tr>
                  <td className="px-4 py-3 font-semibold text-white print:text-black">
                    Servicio Delivery en Zona Turística
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400 print:text-gray-600">Logística</td>
                  <td className="px-4 py-3 text-center font-mono">1</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300 print:text-gray-700">
                    ${selectedOrden.costoDomicilio.toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-white print:text-black">
                    ${selectedOrden.costoDomicilio.toLocaleString('es-CO')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="max-w-xs space-y-2 text-xs text-slate-400 print:text-gray-600">
            <div className="flex items-center gap-1.5 text-slate-300 print:text-gray-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transacción Certificada en Oracle DB</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Comprobante expedido de conformidad con la normativa del curso de Bases de Datos I.
              Válido como constancia de reserva turística y consumo gastronómico.
            </p>
          </div>

          <div className="w-full sm:w-72 p-4 rounded-2xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>Subtotal Gravable:</span>
              <span className="font-mono">${subtotalBase.toLocaleString('es-CO')} COP</span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>Impoconsumo (8%):</span>
              <span className="font-mono">${impoConsumo.toLocaleString('es-CO')} COP</span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>Propina Voluntaria (10%):</span>
              <span className="font-mono">${propina.toLocaleString('es-CO')} COP</span>
            </div>
            <div className="pt-2 border-t border-slate-800 print:border-gray-300 flex justify-between items-center">
              <span className="text-sm font-extrabold text-white print:text-black">TOTAL A PAGAR:</span>
              <span className="text-base font-black text-amber-400 print:text-amber-800 font-mono">
                ${selectedOrden.total.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
