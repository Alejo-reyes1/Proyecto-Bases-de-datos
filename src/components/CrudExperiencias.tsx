import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { ExperienciaTuristica } from '../types';
import {
  Compass,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  UtensilsCrossed,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export const CrudExperiencias: React.FC = () => {
  const { experiencias, restaurantes, addExperiencia, updateExperiencia, deleteExperiencia } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurante, setSelectedRestaurante] = useState<number | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienciaTuristica | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    nombreExperiencia: '',
    descripcion: '',
    precioPorPersona: 80000,
    duracion: 2,
    Restaurante_idRestaurante: 1
  });

  const filteredExperiencias = experiencias.filter(e => {
    const matchesSearch =
      e.nombreExperiencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRest = selectedRestaurante !== '' ? e.Restaurante_idRestaurante === selectedRestaurante : true;
    return matchesSearch && matchesRest;
  });

  const handleOpenCreate = () => {
    setEditingExp(null);
    setFormData({
      nombreExperiencia: '',
      descripcion: '',
      precioPorPersona: 85000,
      duracion: 2,
      Restaurante_idRestaurante: restaurantes[0]?.idRestaurante || 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: ExperienciaTuristica) => {
    setEditingExp(exp);
    setFormData({
      nombreExperiencia: exp.nombreExperiencia,
      descripcion: exp.descripcion,
      precioPorPersona: exp.precioPorPersona,
      duracion: exp.duracion,
      Restaurante_idRestaurante: exp.Restaurante_idRestaurante
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta experiencia turística?')) {
      const result = await deleteExperiencia(id);
      setFeedbackMessage({ text: result.message, type: result.success ? 'success' : 'error' });
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreExperiencia || !formData.descripcion) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    const result = editingExp
      ? await updateExperiencia(editingExp.idExperiencia, formData)
      : await addExperiencia(formData);
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
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ENTIDAD CORE 3
            </span>
            <span className="text-xs text-slate-400">Tabla: ExperienciaTuristica (Oracle 21c)</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Gestión de Experiencias Gastronómicas y Tours
          </h2>
          <p className="text-xs text-slate-400">
            Catálogo de tours cafeteros, catas de origen, talleres de cocina y maridajes para turistas.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Experiencia</span>
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
            placeholder="Buscar por nombre o descripción de la experiencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedRestaurante}
            onChange={(e) => setSelectedRestaurante(e.target.value === '' ? '' : Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Todos los Restaurantes Anfitriones</option>
            {restaurantes.map(r => (
              <option key={r.idRestaurante} value={r.idRestaurante}>
                {r.nombre} (ID: {r.idRestaurante})
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {filteredExperiencias.length} de {experiencias.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 text-center">ID</th>
                <th className="px-4 py-3">Experiencia Turística</th>
                <th className="px-4 py-3">Restaurante Anfitrión</th>
                <th className="px-4 py-3 text-center">Duración</th>
                <th className="px-4 py-3 text-right">Tarifa por Turista</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredExperiencias.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron experiencias turísticas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredExperiencias.map((e) => {
                  const rest = restaurantes.find(r => r.idRestaurante === e.Restaurante_idRestaurante);
                  return (
                    <tr key={e.idExperiencia} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-slate-400">
                        {e.idExperiencia}
                      </td>
                      <td className="px-4 py-3 max-w-sm">
                        <div className="font-bold text-white text-sm">{e.nombreExperiencia}</div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{e.descripcion}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-semibold text-slate-200">{rest?.nombre || 'Sede'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{e.duracion} horas</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          ${e.precioPorPersona.toLocaleString('es-CO')} COP
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(e)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Editar Experiencia"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(e.idExperiencia)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Eliminar Experiencia"
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
                <Compass className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingExp ? 'Editar Experiencia Turística' : 'Nueva Experiencia Gastronómica'}
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
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Experiencia *</label>
                <input
                  type="text"
                  required
                  value={formData.nombreExperiencia}
                  onChange={(e) => setFormData({ ...formData, nombreExperiencia: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ej. Tour de café y cata de origen"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción de la Actividad *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Describa el itinerario, elementos incluidos y guía turístico..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Restaurante Anfitrión (FK) *</label>
                <select
                  value={formData.Restaurante_idRestaurante}
                  onChange={(e) => setFormData({ ...formData, Restaurante_idRestaurante: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {restaurantes.map(r => (
                    <option key={r.idRestaurante} value={r.idRestaurante}>
                      {r.nombre} ({r.categoriaCocina})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tarifa por Turista (COP) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={formData.precioPorPersona}
                    onChange={(e) => setFormData({ ...formData, precioPorPersona: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duración Estimada (Horas) *</label>
                  <input
                    type="number"
                    required
                    min={0.5}
                    step={0.5}
                    value={formData.duracion}
                    onChange={(e) => setFormData({ ...formData, duracion: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  {editingExp ? 'Guardar Cambios' : 'Crear Experiencia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
