import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Orden, DetalleOrden, DetalleExperienciaOrden } from '../types';
import { exportFacturaToPdf } from '../utils/pdfExport';
import {
  ShoppingBag,
  Plus,
  Search,
  Receipt,
  Trash2,
  Calendar,
  Clock,
  User,
  CheckCircle,
  Truck,
  Eye,
  X,
  PlusCircle,
  MinusCircle
} from 'lucide-react';

export const CrudOrdenes: React.FC = () => {
  const {
    ordenes,
    clientes,
    restaurantes,
    itemsMenu,
    experiencias,
    estados,
    mesas,
    addOrden,
    updateOrden,
    deleteOrden
  } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<number | ''>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrden, setViewingOrden] = useState<Orden | null>(null);

  // New Order State
  const [newClienteDoc, setNewClienteDoc] = useState(clientes[0]?.numeroDocumento || '');
  const [newTipo, setNewTipo] = useState<'Restaurante' | 'Domicilio'>('Restaurante');
  const [newMesaId, setNewMesaId] = useState<number>(1);
  const [newDireccion, setNewDireccion] = useState('Hotel Boutique Campestre, Salento');
  const [newCostoDomi, setNewCostoDomi] = useState<number>(6000);

  // Selected Items and Experiences for new Order
  const [selectedMenuItems, setSelectedMenuItems] = useState<{ itemId: number; cantidad: number }[]>([
    { itemId: 3, cantidad: 2 }
  ]);
  const [selectedExps, setSelectedExps] = useState<{ expId: number; asistentes: number }[]>([
    { expId: 1, asistentes: 1 }
  ]);

  const filteredOrdenes = ordenes.filter(o => {
    const cliente = clientes.find(c => c.numeroDocumento === o.Cliente_numeroDocumento);
    const clienteName = cliente ? `${cliente.Nombre} ${cliente.apellido}` : '';
    const matchesSearch =
      String(o.idOrden).includes(searchTerm) ||
      o.Cliente_numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clienteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = selectedEstado !== '' ? o.Estado_idEstado === selectedEstado : true;
    const matchesTipo = selectedTipo ? o.tipo === selectedTipo : true;
    return matchesSearch && matchesEstado && matchesTipo;
  });

  const calculateNewTotal = () => {
    let sum = 0;
    selectedMenuItems.forEach(mi => {
      const item = itemsMenu.find(m => m.idItem === mi.itemId);
      if (item) sum += item.precio * mi.cantidad;
    });
    selectedExps.forEach(e => {
      const exp = experiencias.find(x => x.idExperiencia === e.expId);
      if (exp) sum += exp.precioPorPersona * e.asistentes;
    });
    if (newTipo === 'Domicilio') {
      sum += newCostoDomi;
    }
    return sum;
  };

  const handleOpenCreate = () => {
    setNewClienteDoc(clientes[0]?.numeroDocumento || '');
    setNewTipo('Restaurante');
    setSelectedMenuItems([{ itemId: 3, cantidad: 2 }]);
    setSelectedExps([{ expId: 1, asistentes: 1 }]);
    setIsModalOpen(true);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const detallesMenu: DetalleOrden[] = selectedMenuItems.map(mi => {
      const m = itemsMenu.find(item => item.idItem === mi.itemId);
      return {
        ItemMenu_idItem: mi.itemId,
        Orden_idOrden: 0,
        cantidad: mi.cantidad,
        subTotal: (m?.precio || 0) * mi.cantidad
      };
    });

    const detallesExperiencia: DetalleExperienciaOrden[] = selectedExps.map(eItem => {
      const exp = experiencias.find(x => x.idExperiencia === eItem.expId);
      return {
        ExperienciaTuristica_idExperiencia: eItem.expId,
        Orden_idOrden: 0,
        asistentes: eItem.asistentes,
        subtotal: (exp?.precioPorPersona || 0) * eItem.asistentes,
        fechaProgramada: new Date().toISOString().split('T')[0]
      };
    });

    const total = calculateNewTotal();

    addOrden({
      Cliente_numeroDocumento: newClienteDoc,
      fecha: new Date().toISOString().split('T')[0],
      Estado_idEstado: 2, // Confirmada
      tipo: newTipo,
      total,
      detallesMenu,
      detallesExperiencia,
      mesaId: newTipo === 'Restaurante' ? newMesaId : undefined,
      direccionEntrega: newTipo === 'Domicilio' ? newDireccion : undefined,
      costoDomicilio: newTipo === 'Domicilio' ? newCostoDomi : undefined
    });

    setIsModalOpen(false);
  };

  const handleStatusChange = (ordenId: number, nuevoEstado: number) => {
    updateOrden(ordenId, { Estado_idEstado: nuevoEstado });
  };

  const handleDownloadInvoice = (orden: Orden) => {
    const cliente = clientes.find(c => c.numeroDocumento === orden.Cliente_numeroDocumento);
    const restaurante = restaurantes[0]; // Sede principal
    exportFacturaToPdf(orden, cliente, restaurante, itemsMenu, experiencias);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              ENTIDAD CORE 4
            </span>
            <span className="text-xs text-slate-400">Tabla: Orden (Oracle 21c)</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Gestión de Órdenes, Reservas & Domicilios
          </h2>
          <p className="text-xs text-slate-400">
            Administración de comandas gastronómicas, compra de experiencias turísticas y facturación oficial.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Orden Turística</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por ID, documento o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="">Todos los Tipos</option>
            <option value="Restaurante">En Mesa (Restaurante)</option>
            <option value="Domicilio">Delivery en Zona Turística</option>
          </select>

          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value === '' ? '' : Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="">Todos los Estados</option>
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

      {/* Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 text-center">Nº Orden</th>
                <th className="px-4 py-3">Turista / Cliente</th>
                <th className="px-4 py-3 text-center">Fecha</th>
                <th className="px-4 py-3 text-center">Modalidad</th>
                <th className="px-4 py-3 text-center">Estado del Pedido</th>
                <th className="px-4 py-3 text-right">Total Facturado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrdenes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron órdenes registradas con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredOrdenes.map((o) => {
                  const cliente = clientes.find(c => c.numeroDocumento === o.Cliente_numeroDocumento);
                  const estadoObj = estados.find(e => e.idEstado === o.Estado_idEstado);
                  const isDomicilio = o.tipo === 'Domicilio';

                  return (
                    <tr key={o.idOrden} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-amber-400 font-mono">
                        #ORD-{o.idOrden.toString().padStart(3, '0')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">
                          {cliente ? `${cliente.Nombre} ${cliente.apellido}` : 'Cliente General'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{o.Cliente_numeroDocumento}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-300 font-mono">
                        {o.fecha}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isDomicilio
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {isDomicilio ? <Truck className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                          <span>{isDomicilio ? 'Domicilio Turístico' : 'En Mesa / Salón'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={o.Estado_idEstado}
                          onChange={(e) => handleStatusChange(o.idOrden, Number(e.target.value))}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
                        >
                          {estados.map(est => (
                            <option key={est.idEstado} value={est.idEstado}>
                              {est.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-purple-400 font-mono">
                          ${o.total.toLocaleString('es-CO')} COP
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingOrden(o)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Ver Detalle de Comanda"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(o)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 transition-colors border border-amber-500/20"
                            title="Descargar Factura Oficial en PDF"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteOrden(o.idOrden)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Eliminar Orden"
                          >
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

      {/* Modal: View Order Details */}
      {viewingOrden && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Detalle de Orden #ORD-{viewingOrden.idOrden.toString().padStart(3, '0')}
                </h3>
              </div>
              <button
                onClick={() => setViewingOrden(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Platos del menú */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Platos y Bebidas Consumidas
                </h4>
                {viewingOrden.detallesMenu && viewingOrden.detallesMenu.length > 0 ? (
                  <div className="space-y-1.5">
                    {viewingOrden.detallesMenu.map((dm, idx) => {
                      const item = itemsMenu.find(m => m.idItem === dm.ItemMenu_idItem);
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-950 border border-slate-800">
                          <div>
                            <span className="font-semibold text-white">{item?.nombrItem || `Item #${dm.ItemMenu_idItem}`}</span>
                            <span className="text-slate-500 ml-2">x{dm.cantidad}</span>
                          </div>
                          <span className="font-mono text-slate-300">${dm.subTotal.toLocaleString('es-CO')} COP</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No incluye platos directos de la carta.</p>
                )}
              </div>

              {/* Experiencias turísticas */}
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Experiencias Turísticas Contratadas
                </h4>
                {viewingOrden.detallesExperiencia && viewingOrden.detallesExperiencia.length > 0 ? (
                  <div className="space-y-1.5">
                    {viewingOrden.detallesExperiencia.map((de, idx) => {
                      const exp = experiencias.find(x => x.idExperiencia === de.ExperienciaTuristica_idExperiencia);
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-950 border border-slate-800">
                          <div>
                            <span className="font-semibold text-white">{exp?.nombreExperiencia || `Experiencia #${de.ExperienciaTuristica_idExperiencia}`}</span>
                            <span className="text-slate-500 ml-2">({de.asistentes} turista{de.asistentes > 1 ? 's' : ''})</span>
                          </div>
                          <span className="font-mono text-emerald-400">${de.subtotal.toLocaleString('es-CO')} COP</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No incluye paquetes de experiencias.</p>
                )}
              </div>

              {viewingOrden.tipo === 'Domicilio' && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                  <p className="font-semibold text-blue-300">Dirección de Entrega Turística:</p>
                  <p className="text-slate-300">{viewingOrden.direccionEntrega || 'Zona Turística'}</p>
                  <p className="text-slate-400 mt-1 font-mono">Costo de envío: ${viewingOrden.costoDomicilio?.toLocaleString('es-CO') || 0} COP</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold text-white">Total Liquidado:</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  ${viewingOrden.total.toLocaleString('es-CO')} COP
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => handleDownloadInvoice(viewingOrden)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Descargar Factura PDF Oficial</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Order */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Registrar Nueva Orden Turística</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Turista / Cliente (FK) *</label>
                <select
                  value={newClienteDoc}
                  onChange={(e) => setNewClienteDoc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {clientes.map(c => (
                    <option key={c.numeroDocumento} value={c.numeroDocumento}>
                      {c.Nombre} {c.apellido} ({c.paisOrigen}) - Doc: {c.numeroDocumento}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Modalidad de Servicio *</label>
                  <select
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value as 'Restaurante' | 'Domicilio')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Restaurante">En Mesa (Restaurante)</option>
                    <option value="Domicilio">Delivery en Zona Turística</option>
                  </select>
                </div>
                {newTipo === 'Restaurante' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mesa Asignada *</label>
                    <select
                      value={newMesaId}
                      onChange={(e) => setNewMesaId(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      {mesas.map(m => (
                        <option key={m.idMesa} value={m.idMesa}>
                          Mesa #{m.numeroMesa} (Capacidad: {m.capacidad} personas)
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Costo de Domicilio *</label>
                    <input
                      type="number"
                      value={newCostoDomi}
                      onChange={(e) => setNewCostoDomi(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                )}
              </div>

              {newTipo === 'Domicilio' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección de Entrega Turística</label>
                  <input
                    type="text"
                    value={newDireccion}
                    onChange={(e) => setNewDireccion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {/* Items Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Plato del Menú</label>
                <select
                  value={selectedMenuItems[0]?.itemId || 3}
                  onChange={(e) => setSelectedMenuItems([{ itemId: Number(e.target.value), cantidad: selectedMenuItems[0]?.cantidad || 1 }])}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {itemsMenu.map(m => (
                    <option key={m.idItem} value={m.idItem}>
                      {m.nombrItem} - ${m.precio.toLocaleString('es-CO')} COP
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Experiencia Turística (Opcional)</label>
                <select
                  value={selectedExps[0]?.expId || 1}
                  onChange={(e) => setSelectedExps([{ expId: Number(e.target.value), asistentes: 1 }])}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={0}>Sin Experiencia Turística</option>
                  {experiencias.map(exp => (
                    <option key={exp.idExperiencia} value={exp.idExperiencia}>
                      {exp.nombreExperiencia} - ${exp.precioPorPersona.toLocaleString('es-CO')} COP/turista
                    </option>
                  ))}
                </select>
              </div>

              {/* Total preview */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400">Total Calculado:</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  ${calculateNewTotal().toLocaleString('es-CO')} COP
                </span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md shadow-purple-500/20"
                >
                  Confirmar y Generar Orden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
