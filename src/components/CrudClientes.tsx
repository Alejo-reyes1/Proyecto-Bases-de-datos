import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Cliente } from '../types';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Globe2,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export const CrudClientes: React.FC = () => {
  const { clientes, paises, tiposDocumento, addCliente, updateCliente, deleteCliente } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPais, setSelectedPais] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<Cliente>({
    numeroDocumento: '',
    Nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    paisOrigen: 'CO',
    TipoDocumento_idTipoDocumento: 1
  });

  const filteredClientes = clientes.filter(c => {
    const matchesSearch =
      c.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPais = selectedPais ? c.paisOrigen === selectedPais : true;
    return matchesSearch && matchesPais;
  });

  const handleOpenCreate = () => {
    setEditingCliente(null);
    setFormData({
      numeroDocumento: '',
      Nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      paisOrigen: 'CO',
      TipoDocumento_idTipoDocumento: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({ ...cliente });
    setIsModalOpen(true);
  };

  const handleDelete = async (doc: string) => {
    if (window.confirm(`¿Desea eliminar al cliente con identificación ${doc}?`)) {
      const result = await deleteCliente(doc);
      setFeedbackMessage({ text: result.message, type: result.success ? 'success' : 'error' });
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.numeroDocumento || !formData.Nombre || !formData.apellido || !formData.email) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (!editingCliente && clientes.some(c => c.numeroDocumento === formData.numeroDocumento)) {
      alert('Ya existe un cliente con este número de documento (Clave Primaria Duplicada).');
      return;
    }
    const result = editingCliente
      ? await updateCliente(editingCliente.numeroDocumento, formData)
      : await addCliente(formData);
    if (result.success) setIsModalOpen(false);
    setFeedbackMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ENTIDAD CORE 2
            </span>
            <span className="text-xs text-slate-400">Tabla: Cliente (Oracle 21c)</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Gestión de Turistas y Clientes
          </h2>
          <p className="text-xs text-slate-400">
            Registro, modificación y consulta de comensales locales y viajeros internacionales.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Turista</span>
        </button>
      </div>

      {/* Notification Banner */}
      {feedbackMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {feedbackMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, documento o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedPais}
            onChange={(e) => setSelectedPais(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">Todos los Países</option>
            {paises.map(p => (
              <option key={p.idPais} value={p.idPais}>
                {p.nombre} ({p.idPais})
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {filteredClientes.length} de {clientes.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Documento / ID</th>
                <th className="px-4 py-3">Turista / Cliente</th>
                <th className="px-4 py-3 text-center">País Origen</th>
                <th className="px-4 py-3">Contacto Electrónico</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron clientes registrados con los filtros dados.
                  </td>
                </tr>
              ) : (
                filteredClientes.map((c) => {
                  const paisObj = paises.find(p => p.idPais === c.paisOrigen);
                  const isForeign = c.paisOrigen !== 'CO';
                  return (
                    <tr key={c.numeroDocumento} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-amber-400">
                        {c.numeroDocumento}
                      </td>
                      <td className="px-4 py-3 font-bold text-white text-sm">
                        {c.Nombre} {c.apellido}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isForeign
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          }`}
                        >
                          <Globe2 className="w-3 h-3" />
                          <span>{paisObj?.nombre || c.paisOrigen}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{c.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{c.telefono}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Editar Turista"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.numeroDocumento)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Eliminar Turista"
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

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingCliente ? 'Editar Turista / Cliente' : 'Registrar Nuevo Turista'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Documento *</label>
                  <select
                    value={formData.TipoDocumento_idTipoDocumento}
                    onChange={(e) => setFormData({ ...formData, TipoDocumento_idTipoDocumento: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {tiposDocumento.map(t => (
                      <option key={t.idTipoDocumento} value={t.idTipoDocumento}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nº Documento (PK) *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCliente}
                    value={formData.numeroDocumento}
                    onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    placeholder="Ej. PAS-US-55412"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={formData.Nombre}
                    onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ej. John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ej. Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ej. john.smith@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="Ej. +14155550190"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">País de Procedencia (ISO) *</label>
                <select
                  value={formData.paisOrigen}
                  onChange={(e) => setFormData({ ...formData, paisOrigen: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {paises.map(p => (
                    <option key={p.idPais} value={p.idPais}>
                      {p.nombre} ({p.idPais})
                    </option>
                  ))}
                </select>
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
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  {editingCliente ? 'Guardar Cambios' : 'Registrar Turista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
