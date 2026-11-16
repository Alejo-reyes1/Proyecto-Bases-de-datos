import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Restaurante } from '../types';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export const CrudRestaurantes: React.FC = () => {
  const { restaurantes, ciudades, addRestaurante, updateRestaurante, deleteRestaurante } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCiudad, setSelectedCiudad] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRestaurante, setEditingRestaurante] = useState<Restaurante | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nit: '',
    nombre: '',
    direccion: '',
    categoriaCocina: '',
    horaApertura: '08:00',
    horaCierre: '22:00',
    Ciudad_idCiudad: 'CO-QUI-SAL'
  });

  const filteredRestaurantes = restaurantes.filter(r => {
    const matchesSearch =
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.categoriaCocina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCiudad = selectedCiudad ? r.Ciudad_idCiudad === selectedCiudad : true;
    return matchesSearch && matchesCiudad;
  });

  const handleOpenCreate = () => {
    setEditingRestaurante(null);
    setFormData({
      nit: '',
      nombre: '',
      direccion: '',
      categoriaCocina: 'Típica cafetera',
      horaApertura: '08:00',
      horaCierre: '22:00',
      Ciudad_idCiudad: ciudades[0]?.idCiudad || 'CO-QUI-SAL'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rest: Restaurante) => {
    setEditingRestaurante(rest);
    setFormData({
      nit: rest.nit,
      nombre: rest.nombre,
      direccion: rest.direccion,
      categoriaCocina: rest.categoriaCocina,
      horaApertura: rest.horaApertura,
      horaCierre: rest.horaCierre,
      Ciudad_idCiudad: rest.Ciudad_idCiudad
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este restaurante? Se verificará la integridad referencial.')) {
      const result = deleteRestaurante(id);
      setFeedbackMessage({
        text: result.message,
        type: result.success ? 'success' : 'error'
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.nit || !formData.direccion) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (editingRestaurante) {
      updateRestaurante(editingRestaurante.idRestaurante, formData);
      setFeedbackMessage({ text: 'Restaurante actualizado con éxito en Oracle DB.', type: 'success' });
    } else {
      addRestaurante(formData);
      setFeedbackMessage({ text: 'Nuevo restaurante registrado exitosamente en Oracle DB.', type: 'success' });
    }
    setIsModalOpen(false);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              ENTIDAD CORE 1
            </span>
            <span className="text-xs text-slate-400">Tabla: Restaurante (Oracle 21c)</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Gestión de Restaurantes Turísticos
          </h2>
          <p className="text-xs text-slate-400">
            Administración completa (CRUD) de establecimientos gastronómicos, sedes y horarios de atención.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Restaurante</span>
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
          {feedbackMessage.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, NIT o cocina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCiudad}
            onChange={(e) => setSelectedCiudad(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="">Todas las Ciudades</option>
            {ciudades.map(c => (
              <option key={c.idCiudad} value={c.idCiudad}>
                {c.nombre} ({c.idCiudad})
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {filteredRestaurantes.length} de {restaurantes.length}
          </span>
        </div>
      </div>

      {/* Table View */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 text-center">ID</th>
                <th className="px-4 py-3">Nombre & NIT</th>
                <th className="px-4 py-3">Cocina & Especialidad</th>
                <th className="px-4 py-3">Dirección & Ciudad</th>
                <th className="px-4 py-3 text-center">Horario</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRestaurantes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron restaurantes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredRestaurantes.map((rest) => {
                  const ciudad = ciudades.find(c => c.idCiudad === rest.Ciudad_idCiudad);
                  return (
                    <tr key={rest.idRestaurante} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-slate-400">
                        {rest.idRestaurante}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{rest.nombre}</div>
                        <div className="text-[11px] text-amber-400/90 font-mono">NIT: {rest.nit}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {rest.categoriaCocina}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{rest.direccion}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 ml-5">
                          {ciudad?.nombre || rest.Ciudad_idCiudad}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{rest.horaApertura} - {rest.horaCierre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(rest)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Editar Restaurante"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(rest.idRestaurante)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Eliminar Restaurante"
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
                <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingRestaurante ? 'Editar Restaurante' : 'Registrar Nuevo Restaurante'}
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="Ej. El Fogón Cafetero"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">NIT *</label>
                  <input
                    type="text"
                    required
                    value={formData.nit}
                    onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="Ej. 900123451-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Especialidad / Categoría Cocina *</label>
                <input
                  type="text"
                  required
                  value={formData.categoriaCocina}
                  onChange={(e) => setFormData({ ...formData, categoriaCocina: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="Ej. Típica cafetera, Caribeña, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección Física *</label>
                  <input
                    type="text"
                    required
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="Ej. Calle Real # 6-15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad Destino (FK) *</label>
                  <select
                    value={formData.Ciudad_idCiudad}
                    onChange={(e) => setFormData({ ...formData, Ciudad_idCiudad: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {ciudades.map(c => (
                      <option key={c.idCiudad} value={c.idCiudad}>
                        {c.nombre} ({c.idCiudad})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hora de Apertura</label>
                  <input
                    type="time"
                    value={formData.horaApertura}
                    onChange={(e) => setFormData({ ...formData, horaApertura: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hora de Cierre</label>
                  <input
                    type="time"
                    value={formData.horaCierre}
                    onChange={(e) => setFormData({ ...formData, horaCierre: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  {editingRestaurante ? 'Guardar Cambios' : 'Crear Restaurante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
