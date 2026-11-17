import React, { useMemo, useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Orden, DetalleOrden, DetalleExperienciaOrden } from '../types';
import { exportFacturaToPdf } from '../utils/pdfExport';
import {
  ShoppingBag,
  Plus,
  Search,
  Receipt,
  Trash2,
  User,
  Truck,
  Eye,
  X,
  Pencil,
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

type Linea = { itemId: number; cantidad: number };
type LineaExp = { expId: number; asistentes: number; fecha: string };

const ahora = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const money = (n: number) => `$${(n || 0).toLocaleString('es-CO')} COP`;

export const CrudOrdenes: React.FC = () => {
  const {
    ordenes,
    clientes,
    restaurantes,
    itemsMenu,
    cartasMenu,
    experiencias,
    estados,
    mesas,
    personal,
    selectedRestauranteId,
    isOracleConnected,
    addOrden,
    updateOrden,
    deleteOrden,
  } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<number | ''>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [viewingOrden, setViewingOrden] = useState<Orden | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  // ----- Formulario maestro-detalle (crear / editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [clienteDoc, setClienteDoc] = useState('');
  const [restId, setRestId] = useState<number>(selectedRestauranteId || 1);
  const [tipo, setTipo] = useState<'Restaurante' | 'Domicilio'>('Restaurante');
  const [mesaId, setMesaId] = useState<number>(0);
  const [meseroId, setMeseroId] = useState('');
  const [repartidorId, setRepartidorId] = useState('');
  const [direccion, setDireccion] = useState('');
  const [costoDomi, setCostoDomi] = useState<number>(5000);
  const [estadoId, setEstadoId] = useState<number>(1);
  const [fecha, setFecha] = useState(ahora());
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [lineasExp, setLineasExp] = useState<LineaExp[]>([]);

  const restName = (id?: number) => restaurantes.find(r => r.idRestaurante === id)?.nombre || '—';

  // Opciones dependientes de la sede elegida (respetan las FK del modelo)
  const opciones = useMemo(() => {
    const cats = cartasMenu.filter(c => c.Restaurante_idRestaurante === restId).map(c => c.idCategoria);
    return {
      items: itemsMenu.filter(i => cats.includes(i.CategoriaMenu_idCategoria)),
      exps: experiencias.filter(e => e.Restaurante_idRestaurante === restId),
      mesas: mesas.filter(m => m.Restaurante_idRestaurante === restId),
      meseros: personal.filter(p => p.Restaurante_idRestaurante === restId && p.rol === 'Mesero'),
      repartidores: personal.filter(p => p.Restaurante_idRestaurante === restId && p.rol === 'Repartidor'),
    };
  }, [restId, cartasMenu, itemsMenu, experiencias, mesas, personal]);

  const filteredOrdenes = ordenes.filter(o => {
    const cliente = clientes.find(c => c.numeroDocumento === o.Cliente_numeroDocumento);
    const clienteName = cliente ? `${cliente.Nombre} ${cliente.apellido}` : '';
    const q = searchTerm.toLowerCase();
    return (
      (!selectedRestauranteId || o.restauranteId === selectedRestauranteId) &&
      (String(o.idOrden).includes(q) || o.Cliente_numeroDocumento.toLowerCase().includes(q) || clienteName.toLowerCase().includes(q)) &&
      (selectedEstado === '' || o.Estado_idEstado === selectedEstado) &&
      (!selectedTipo || o.tipo === selectedTipo)
    );
  });

  const totalCalculado =
    lineas.reduce((s, l) => s + (itemsMenu.find(i => i.idItem === l.itemId)?.precio || 0) * l.cantidad, 0) +
    lineasExp.reduce((s, l) => s + (experiencias.find(e => e.idExperiencia === l.expId)?.precioPorPersona || 0) * l.asistentes, 0) +
    (tipo === 'Domicilio' ? costoDomi : 0);

  const resetForSede = (rid: number) => {
    const cats = cartasMenu.filter(c => c.Restaurante_idRestaurante === rid).map(c => c.idCategoria);
    const firstItem = itemsMenu.find(i => cats.includes(i.CategoriaMenu_idCategoria));
    setRestId(rid);
    setMesaId(mesas.find(m => m.Restaurante_idRestaurante === rid)?.idMesa || 0);
    setMeseroId(personal.find(p => p.Restaurante_idRestaurante === rid && p.rol === 'Mesero')?.numeroDocumento || '');
    setRepartidorId(personal.find(p => p.Restaurante_idRestaurante === rid && p.rol === 'Repartidor')?.numeroDocumento || '');
    setLineas(firstItem ? [{ itemId: firstItem.idItem, cantidad: 1 }] : []);
    setLineasExp([]);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setClienteDoc(clientes[0]?.numeroDocumento || '');
    setTipo('Restaurante');
    setDireccion('');
    setCostoDomi(5000);
    setEstadoId(1);
    setFecha(ahora());
    resetForSede(selectedRestauranteId || restaurantes[0]?.idRestaurante || 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (o: Orden) => {
    setEditingId(o.idOrden);
    setClienteDoc(o.Cliente_numeroDocumento);
    setRestId(o.restauranteId || 1);
    setTipo(o.tipo || 'Restaurante');
    setMesaId(o.mesaId || 0);
    setMeseroId(o.meseroId || '');
    setRepartidorId(o.repartidorId || '');
    setDireccion(o.direccionEntrega || '');
    setCostoDomi(o.costoDomicilio || 0);
    setEstadoId(o.Estado_idEstado);
    setFecha(o.fecha.length === 10 ? `${o.fecha} 12:00` : o.fecha);
    setLineas((o.detallesMenu || []).map(d => ({ itemId: d.ItemMenu_idItem, cantidad: d.cantidad })));
    setLineasExp(
      (o.detallesExperiencia || []).map(d => ({
        expId: d.ExperienciaTuristica_idExperiencia,
        asistentes: d.asistentes,
        fecha: d.fechaProgramada?.slice(0, 16) || fecha,
      }))
    );
    setIsModalOpen(true);
  };

  const notify = (text: string, okFlag: boolean) => {
    setFeedback({ text, ok: okFlag });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteDoc) return notify('Seleccione el cliente (FK Cliente).', false);
    if (lineas.length === 0 && lineasExp.length === 0) return notify('La orden debe tener al menos un plato o una experiencia.', false);
    if (tipo === 'Restaurante' && (!mesaId || !meseroId)) return notify('Mesa y mesero son obligatorios (FK NOT NULL en OrdenRestaurante).', false);
    if (tipo === 'Domicilio' && (!repartidorId || !direccion.trim())) return notify('Repartidor y dirección son obligatorios para OrdenDomicilio.', false);

    // Agrupa líneas repetidas: la PK de DetalleOrden es (ItemMenu_idItem, Orden_idOrden)
    const agrupar = <T extends { [k: string]: any }>(arr: T[], key: keyof T, qty: keyof T) =>
      Object.values(
        arr.reduce<Record<string, T>>((acc, l) => {
          const k = String(l[key]);
          acc[k] = acc[k] ? { ...acc[k], [qty]: Number(acc[k][qty]) + Number(l[qty]) } : { ...l };
          return acc;
        }, {})
      );

    const detallesMenu: DetalleOrden[] = agrupar(lineas, 'itemId', 'cantidad').map(l => ({
      ItemMenu_idItem: l.itemId,
      Orden_idOrden: editingId || 0,
      cantidad: l.cantidad,
      subTotal: (itemsMenu.find(i => i.idItem === l.itemId)?.precio || 0) * l.cantidad,
    }));
    const detallesExperiencia: DetalleExperienciaOrden[] = agrupar(lineasExp, 'expId', 'asistentes').map(l => ({
      ExperienciaTuristica_idExperiencia: l.expId,
      Orden_idOrden: editingId || 0,
      asistentes: l.asistentes,
      subtotal: (experiencias.find(x => x.idExperiencia === l.expId)?.precioPorPersona || 0) * l.asistentes,
      fechaProgramada: l.fecha,
    }));

    const payload: Omit<Orden, 'idOrden'> = {
      Cliente_numeroDocumento: clienteDoc,
      fecha,
      Estado_idEstado: estadoId,
      tipo,
      total: totalCalculado,
      restauranteId: restId,
      detallesMenu,
      detallesExperiencia,
      mesaId: tipo === 'Restaurante' ? mesaId : undefined,
      meseroId: tipo === 'Restaurante' ? meseroId : undefined,
      repartidorId: tipo === 'Domicilio' ? repartidorId : undefined,
      direccionEntrega: tipo === 'Domicilio' ? direccion : undefined,
      costoDomicilio: tipo === 'Domicilio' ? costoDomi : undefined,
    };

    setSaving(true);
    const result = editingId ? await updateOrden(editingId, payload) : await addOrden(payload);
    setSaving(false);
    notify(result.message, result.success);
    if (result.success) setIsModalOpen(false);
  };

  const handleStatusChange = async (ordenId: number, nuevoEstado: number) => {
    const r = await updateOrden(ordenId, { Estado_idEstado: nuevoEstado });
    notify(r.message, r.success);
  };

  const handleDelete = async (o: Orden) => {
    if (!window.confirm(`¿Eliminar la orden #${o.idOrden}? Se borrarán también sus detalles, su subtipo y sus pagos (transacción).`)) return;
    const r = await deleteOrden(o.idOrden);
    notify(r.message, r.success);
  };

  const handleDownloadInvoice = (orden: Orden) => {
    const cliente = clientes.find(c => c.numeroDocumento === orden.Cliente_numeroDocumento);
    const restaurante = restaurantes.find(r => r.idRestaurante === orden.restauranteId);
    exportFacturaToPdf(orden, cliente, restaurante, itemsMenu, experiencias);
  };

  const input = 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              ENTIDAD CORE 4 · TRANSACCIÓN PRINCIPAL
            </span>
            <span className="text-xs text-slate-400">Orden + DetalleOrden + DetalleExperienciaOrden + OrdenRestaurante / OrdenDomicilio</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">Gestión de Órdenes en Salón y Domicilios</h2>
          <p className="text-xs text-slate-400">
            Cada registro se guarda como una transacción maestro-detalle ({isOracleConnected ? 'COMMIT en Oracle Cloud' : 'modo local'}).
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Orden</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            feedback.ok ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          {feedback.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {feedback.text}
        </div>
      )}

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por Nº, documento o cliente..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select value={selectedTipo} onChange={e => setSelectedTipo(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <option value="">Todas las modalidades</option>
            <option value="Restaurante">En salón (OrdenRestaurante)</option>
            <option value="Domicilio">Domicilio (OrdenDomicilio)</option>
          </select>
          <select
            value={selectedEstado}
            onChange={e => setSelectedEstado(e.target.value === '' ? '' : Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
          >
            <option value="">Todos los estados</option>
            {estados.map(est => (
              <option key={est.idEstado} value={est.idEstado}>
                {est.nombre}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {filteredOrdenes.length} de {ordenes.length}
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 text-center">Nº</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Sede</th>
                <th className="px-4 py-3 text-center">Fecha</th>
                <th className="px-4 py-3 text-center">Modalidad</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrdenes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron órdenes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredOrdenes.map(o => {
                  const cliente = clientes.find(c => c.numeroDocumento === o.Cliente_numeroDocumento);
                  const isDomicilio = o.tipo === 'Domicilio';
                  return (
                    <tr key={o.idOrden} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-amber-400 font-mono">#{o.idOrden}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{cliente ? `${cliente.Nombre} ${cliente.apellido}` : 'Cliente'}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{o.Cliente_numeroDocumento}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{restName(o.restauranteId)}</td>
                      <td className="px-4 py-3 text-center text-slate-300 font-mono">{o.fecha}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isDomicilio ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {isDomicilio ? <Truck className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                          <span>{isDomicilio ? 'Domicilio' : `Salón · Mesa ${mesas.find(m => m.idMesa === o.mesaId)?.numeroMesa ?? ''}`}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={o.Estado_idEstado}
                          onChange={e => handleStatusChange(o.idOrden, Number(e.target.value))}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-200"
                        >
                          {estados.map(est => (
                            <option key={est.idEstado} value={est.idEstado}>
                              {est.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-purple-400 font-mono">{money(o.total)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setViewingOrden(o)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Ver detalle">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleOpenEdit(o)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Modificar orden">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(o)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/20"
                            title="Factura PDF"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(o)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400" title="Eliminar">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalle */}
      {viewingOrden && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Orden #{viewingOrden.idOrden} · {restName(viewingOrden.restauranteId)}</h3>
              </div>
              <button onClick={() => setViewingOrden(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">DetalleOrden (platos y bebidas)</h4>
                {viewingOrden.detallesMenu?.length ? (
                  <div className="space-y-1.5">
                    {viewingOrden.detallesMenu.map((dm, idx) => (
                      <div key={idx} className="flex justify-between text-xs p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="font-semibold text-white">
                          {itemsMenu.find(m => m.idItem === dm.ItemMenu_idItem)?.nombrItem || `Ítem #${dm.ItemMenu_idItem}`}
                          <span className="text-slate-500 ml-2">x{dm.cantidad}</span>
                        </span>
                        <span className="font-mono text-slate-300">{money(dm.subTotal)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Sin platos.</p>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">DetalleExperienciaOrden</h4>
                {viewingOrden.detallesExperiencia?.length ? (
                  <div className="space-y-1.5">
                    {viewingOrden.detallesExperiencia.map((de, idx) => (
                      <div key={idx} className="flex justify-between text-xs p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="font-semibold text-white">
                          {experiencias.find(x => x.idExperiencia === de.ExperienciaTuristica_idExperiencia)?.nombreExperiencia}
                          <span className="text-slate-500 ml-2">
                            ({de.asistentes} pers. · {de.fechaProgramada})
                          </span>
                        </span>
                        <span className="font-mono text-emerald-400">{money(de.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Sin experiencias.</p>
                )}
              </div>
              {viewingOrden.tipo === 'Domicilio' ? (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300">
                  <p className="font-semibold text-blue-300">OrdenDomicilio</p>
                  <p>{viewingOrden.direccionEntrega}</p>
                  <p className="text-slate-400 font-mono">
                    Envío {money(viewingOrden.costoDomicilio || 0)} · Repartidor{' '}
                    {personal.find(p => p.numeroDocumento === viewingOrden.repartidorId)?.Nombre} {personal.find(p => p.numeroDocumento === viewingOrden.repartidorId)?.apellido}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300">
                  <p className="font-semibold text-emerald-300">OrdenRestaurante</p>
                  <p>
                    Mesa {mesas.find(m => m.idMesa === viewingOrden.mesaId)?.numeroMesa} · Mesero{' '}
                    {personal.find(p => p.numeroDocumento === viewingOrden.meseroId)?.Nombre} {personal.find(p => p.numeroDocumento === viewingOrden.meseroId)?.apellido}
                  </p>
                </div>
              )}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold text-white">Total:</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">{money(viewingOrden.total)}</span>
              </div>
              <button
                onClick={() => handleDownloadInvoice(viewingOrden)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                Descargar factura PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crear / editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">{editingId ? `Modificar orden #${editingId}` : 'Registrar nueva orden'}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente (FK Cliente) *</label>
                  <select value={clienteDoc} onChange={e => setClienteDoc(e.target.value)} className={input}>
                    {clientes.map(c => (
                      <option key={c.numeroDocumento} value={c.numeroDocumento}>
                        {c.Nombre} {c.apellido} ({c.paisOrigen}) · {c.numeroDocumento}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sede *</label>
                  <select
                    value={restId}
                    disabled={!!selectedRestauranteId || !!editingId}
                    onChange={e => resetForSede(Number(e.target.value))}
                    className={input}
                  >
                    {restaurantes.map(r => (
                      <option key={r.idRestaurante} value={r.idRestaurante}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha y hora *</label>
                  <input type="datetime-local" value={fecha.replace(' ', 'T')} onChange={e => setFecha(e.target.value.replace('T', ' '))} className={input} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estado (FK Estado) *</label>
                  <select value={estadoId} onChange={e => setEstadoId(Number(e.target.value))} className={input}>
                    {estados.map(s => (
                      <option key={s.idEstado} value={s.idEstado}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Modalidad (especialización) *</label>
                  <select value={tipo} disabled={!!editingId} onChange={e => setTipo(e.target.value as 'Restaurante' | 'Domicilio')} className={input}>
                    <option value="Restaurante">En salón → OrdenRestaurante</option>
                    <option value="Domicilio">Domicilio → OrdenDomicilio</option>
                  </select>
                </div>
                {tipo === 'Restaurante' ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Mesa (FK Mesa) *</label>
                      <select value={mesaId} onChange={e => setMesaId(Number(e.target.value))} className={input}>
                        {opciones.mesas.map(m => (
                          <option key={m.idMesa} value={m.idMesa}>
                            Mesa {m.numeroMesa} · {m.capacidad} pers. {m.disponibilidad === '0' ? '(ocupada)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Mesero (FK Mesero) *</label>
                      <select value={meseroId} onChange={e => setMeseroId(e.target.value)} className={input}>
                        {opciones.meseros.map(p => (
                          <option key={p.numeroDocumento} value={p.numeroDocumento}>
                            {p.Nombre} {p.apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Repartidor (FK Repartidor) *</label>
                      <select value={repartidorId} onChange={e => setRepartidorId(e.target.value)} className={input}>
                        {opciones.repartidores.map(p => (
                          <option key={p.numeroDocumento} value={p.numeroDocumento}>
                            {p.Nombre} {p.apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección de entrega *</label>
                      <input value={direccion} maxLength={100} onChange={e => setDireccion(e.target.value)} className={input} placeholder="Calle 6 # 4-20, Salento" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Costo domicilio *</label>
                      <input type="number" min={0} value={costoDomi} onChange={e => setCostoDomi(Number(e.target.value))} className={`${input} font-mono`} />
                    </div>
                  </>
                )}
              </div>

              {/* Detalle de platos */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">DetalleOrden · carta de {restName(restId)}</span>
                  <button
                    type="button"
                    onClick={() => opciones.items[0] && setLineas([...lineas, { itemId: opciones.items[0].idItem, cantidad: 1 }])}
                    className="text-[11px] text-amber-300 flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Agregar plato
                  </button>
                </div>
                {lineas.map((l, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <select
                      value={l.itemId}
                      onChange={e => setLineas(lineas.map((x, j) => (j === i ? { ...x, itemId: Number(e.target.value) } : x)))}
                      className={input}
                    >
                      {opciones.items.map(m => (
                        <option key={m.idItem} value={m.idItem}>
                          {m.nombrItem} · {money(m.precio)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={l.cantidad}
                      onChange={e => setLineas(lineas.map((x, j) => (j === i ? { ...x, cantidad: Math.max(1, Number(e.target.value)) } : x)))}
                      className={`${input} w-20`}
                    />
                    <button type="button" onClick={() => setLineas(lineas.filter((_, j) => j !== i))} className="text-rose-400">
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Detalle de experiencias */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">DetalleExperienciaOrden (opcional)</span>
                  <button
                    type="button"
                    disabled={!opciones.exps.length}
                    onClick={() => setLineasExp([...lineasExp, { expId: opciones.exps[0].idExperiencia, asistentes: 1, fecha }])}
                    className="text-[11px] text-emerald-300 flex items-center gap-1 disabled:opacity-40"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Agregar experiencia
                  </button>
                </div>
                {lineasExp.map((l, i) => (
                  <div key={i} className="grid grid-cols-[1fr_70px_170px_24px] gap-2 items-center">
                    <select
                      value={l.expId}
                      onChange={e => setLineasExp(lineasExp.map((x, j) => (j === i ? { ...x, expId: Number(e.target.value) } : x)))}
                      className={input}
                    >
                      {opciones.exps.map(x => (
                        <option key={x.idExperiencia} value={x.idExperiencia}>
                          {x.nombreExperiencia} · {money(x.precioPorPersona)}/pers.
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={l.asistentes}
                      onChange={e => setLineasExp(lineasExp.map((x, j) => (j === i ? { ...x, asistentes: Math.max(1, Number(e.target.value)) } : x)))}
                      className={input}
                    />
                    <input
                      type="datetime-local"
                      value={l.fecha.replace(' ', 'T')}
                      onChange={e => setLineasExp(lineasExp.map((x, j) => (j === i ? { ...x, fecha: e.target.value.replace('T', ' ') } : x)))}
                      className={input}
                    />
                    <button type="button" onClick={() => setLineasExp(lineasExp.filter((_, j) => j !== i))} className="text-rose-400">
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400">Orden.total = Σ subtotales{tipo === 'Domicilio' ? ' + domicilio' : ''}</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">{money(totalCalculado)}</span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-slate-950 font-bold text-xs">
                  {saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Registrar orden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
