import React, { useState } from 'react';
import { Layers, Database, Search, CheckCircle2, Key, Link2 } from 'lucide-react';

interface TableMetadata {
  name: string;
  type: 'Fuerte' | 'Débil' | 'Asociativa (N:M)' | 'Subtipo Especialización';
  category: 'Geografía' | 'Negocio Core' | 'Menú y Platos' | 'Personal y Roles' | 'Órdenes y Ventas' | 'Pagos y Reseñas';
  pk: string;
  fks: string[];
  records: number;
  description: string;
}

const TABLAS_MODELO: TableMetadata[] = [
  // 1. Geografía
  { name: 'Pais', type: 'Fuerte', category: 'Geografía', pk: 'idPais (VARCHAR2)', fks: [], records: 8, description: 'Catálogo de países según norma ISO 3166-1 (CO, US, ES, MX, AR, etc.)' },
  { name: 'Departamento', type: 'Débil', category: 'Geografía', pk: 'idDepartamento (VARCHAR2)', fks: ['Pais_idPais -> Pais'], records: 18, description: 'Subdivisiones territoriales y departamentos' },
  { name: 'Ciudad', type: 'Débil', category: 'Geografía', pk: 'idCiudad (VARCHAR2)', fks: ['Departamento_idDepartamento -> Departamento'], records: 23, description: 'Ciudades y destinos turísticos (Salento, Armenia, Cartagena, etc.)' },

  // 2. Parámetros Generales
  { name: 'TipoDocumento', type: 'Fuerte', category: 'Negocio Core', pk: 'idTipoDocumento (INTEGER)', fks: [], records: 5, description: 'Tipologías de identificación (CC, Pasaporte, CE, NIT)' },
  { name: 'Estado', type: 'Fuerte', category: 'Negocio Core', pk: 'idEstado (INTEGER)', fks: [], records: 8, description: 'Estados de ciclo de vida de órdenes y reservas' },
  { name: 'Idioma', type: 'Fuerte', category: 'Personal y Roles', pk: 'idIdioma (INTEGER)', fks: [], records: 6, description: 'Idiomas dominados por el personal bilingüe para atención turística' },
  { name: 'MetodoPago', type: 'Fuerte', category: 'Pagos y Reseñas', pk: 'idMetodoPago (INTEGER)', fks: [], records: 5, description: 'Medios de pago (Tarjeta, Efectivo, Transferencia, PSE)' },
  { name: 'PeticionEspecial', type: 'Fuerte', category: 'Negocio Core', pk: 'idPeticion (INTEGER)', fks: [], records: 6, description: 'Requerimientos especiales para comensales (alergias, vista panorámica)' },

  // 3. Negocio Core
  { name: 'Restaurante', type: 'Fuerte', category: 'Negocio Core', pk: 'idRestaurante (INTEGER)', fks: ['Ciudad_idCiudad -> Ciudad'], records: 6, description: 'Establecimiento gastronómico turístico con ubicación y horario' },
  { name: 'Cliente', type: 'Fuerte', category: 'Negocio Core', pk: 'numeroDocumento (VARCHAR2)', fks: ['TipoDocumento_idTipoDocumento -> TipoDocumento'], records: 15, description: 'Turistas nacionales e internacionales con país de origen' },
  { name: 'ExperienciaTuristica', type: 'Fuerte', category: 'Negocio Core', pk: 'idExperiencia (INTEGER)', fks: ['Restaurante_idRestaurante -> Restaurante'], records: 8, description: 'Tours de café, catas guiadas y talleres gastronómicos con chefs' },
  { name: 'Mesa', type: 'Débil', category: 'Negocio Core', pk: 'idMesa (INTEGER)', fks: ['Restaurante_idRestaurante -> Restaurante'], records: 18, description: 'Mesas físicas por restaurante con capacidad y disponibilidad' },

  // 4. Menú
  { name: 'CartaMenu', type: 'Débil', category: 'Menú y Platos', pk: 'idCategoria (INTEGER)', fks: ['Restaurante_idRestaurante -> Restaurante'], records: 16, description: 'Secciones o categorías de la carta (Desayunos, Platos fuertes, etc.)' },
  { name: 'ItemMenu', type: 'Débil', category: 'Menú y Platos', pk: 'idItem (INTEGER)', fks: ['CategoriaMenu_idCategoria -> CartaMenu'], records: 35, description: 'Platos y bebidas con precio, indicador vegetariano e ingredientes' },

  // 5. Personal y Jerarquía
  { name: 'Personal', type: 'Fuerte', category: 'Personal y Roles', pk: 'numeroDocumento (VARCHAR2)', fks: ['Restaurante_idRestaurante -> Restaurante', 'TipoDocumento_idTipoDocumento -> TipoDocumento'], records: 27, description: 'Colaboradores del sistema de restaurantes' },
  { name: 'Administrador', type: 'Subtipo Especialización', category: 'Personal y Roles', pk: 'Personal_numeroDocumento (VARCHAR2)', fks: ['Personal_numeroDocumento -> Personal'], records: 6, description: 'Subtipo administrador con años de experiencia en gestión' },
  { name: 'Chef', type: 'Subtipo Especialización', category: 'Personal y Roles', pk: 'Personal_numeroDocumento (VARCHAR2)', fks: ['Personal_numeroDocumento -> Personal'], records: 6, description: 'Subtipo chef con especialidad culinaria' },
  { name: 'Mesero', type: 'Subtipo Especialización', category: 'Personal y Roles', pk: 'Personal_numeroDocumento (VARCHAR2)', fks: ['Personal_numeroDocumento -> Personal'], records: 9, description: 'Subtipo mesero con turno asignado' },
  { name: 'Repartidor', type: 'Subtipo Especialización', category: 'Personal y Roles', pk: 'Personal_numeroDocumento (VARCHAR2)', fks: ['Personal_numeroDocumento -> Personal'], records: 6, description: 'Subtipo repartidor para entrega en zonas turísticas y hoteles' },
  { name: 'MeseroIdioma', type: 'Asociativa (N:M)', category: 'Personal y Roles', pk: 'Mesero_doc + Idioma_id (COMPUESTA)', fks: ['Mesero_doc -> Mesero', 'Idioma_id -> Idioma'], records: 21, description: 'Relación de idiomas hablados por cada mesero para turistas' },

  // 6. Órdenes y Transacciones
  { name: 'Orden', type: 'Fuerte', category: 'Órdenes y Ventas', pk: 'idOrden (INTEGER)', fks: ['Cliente_numeroDocumento -> Cliente', 'Estado_idEstado -> Estado'], records: 22, description: 'Transacción principal de pedido o comanda' },
  { name: 'OrdenRestaurante', type: 'Subtipo Especialización', category: 'Órdenes y Ventas', pk: 'Orden_idOrden (INTEGER)', fks: ['Orden_idOrden -> Orden', 'Mesero_doc -> Mesero', 'Mesa_idMesa -> Mesa'], records: 14, description: 'Órdenes consumidas en mesa con asignación de mesero' },
  { name: 'OrdenDomicilio', type: 'Subtipo Especialización', category: 'Órdenes y Ventas', pk: 'Orden_idOrden (INTEGER)', fks: ['Orden_idOrden -> Orden', 'Repartidor_doc -> Repartidor'], records: 8, description: 'Órdenes de delivery a hoteles campestres y zonas turísticas' },
  { name: 'DetalleOrden', type: 'Asociativa (N:M)', category: 'Órdenes y Ventas', pk: 'ItemMenu_id + Orden_id (COMPUESTA)', fks: ['ItemMenu_id -> ItemMenu', 'Orden_id -> Orden'], records: 55, description: 'Líneas de detalle de platos solicitados con cantidad y subtotal' },
  { name: 'DetalleExperienciaOrden', type: 'Asociativa (N:M)', category: 'Órdenes y Ventas', pk: 'Experiencia_id + Orden_id (COMPUESTA)', fks: ['Experiencia_id -> ExperienciaTuristica', 'Orden_id -> Orden'], records: 8, description: 'Cupos contratados para tours y catas con fecha programada' },

  // 7. Reservas
  { name: 'Reserva', type: 'Fuerte', category: 'Negocio Core', pk: 'idReserva (INTEGER)', fks: ['Cliente_doc -> Cliente', 'Restaurante_id -> Restaurante', 'Estado_id -> Estado'], records: 12, description: 'Reservación previa de mesa con cantidad de personas' },
  { name: 'ReservaPeticionesEsp', type: 'Asociativa (N:M)', category: 'Negocio Core', pk: 'Reserva_id + Peticion_id (COMPUESTA)', fks: ['Reserva_id -> Reserva', 'Peticion_id -> PeticionEspecial'], records: 13, description: 'Peticiones especiales asociadas a una reserva' },

  // 8. Pagos y Reseñas
  { name: 'Pago', type: 'Fuerte', category: 'Pagos y Reseñas', pk: 'idPago (INTEGER)', fks: ['Orden_idOrden -> Orden'], records: 18, description: 'Registro de cobro con propina y moneda' },
  { name: 'PagoMetodoPago', type: 'Asociativa (N:M)', category: 'Pagos y Reseñas', pk: 'Pago_id + MetodoPago_id (COMPUESTA)', fks: ['Pago_id -> Pago', 'MetodoPago_id -> MetodoPago'], records: 20, description: 'Métodos de pago utilizados en cada liquidación' },
  { name: 'Resena', type: 'Fuerte', category: 'Pagos y Reseñas', pk: 'idResena (INTEGER)', fks: ['Restaurante_id -> Restaurante', 'Cliente_doc -> Cliente'], records: 15, description: 'Calificaciones de comida y servicio otorgadas por los turistas' }
];

export const Esquema30TablasView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Geografía', 'Negocio Core', 'Menú y Platos', 'Personal y Roles', 'Órdenes y Ventas', 'Pagos y Reseñas'];

  const filtered = TABLAS_MODELO.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' ? true : t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalRecords = TABLAS_MODELO.reduce((s, t) => s + t.records, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ARQUITECTURA DE DATOS APROBADA
            </span>
            <span className="text-xs text-slate-400">Total: 30 Tablas (Supera el mínimo de 10 entidades)</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Diccionario de Datos: Modelo Relacional de 30 Tablas</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Estructura DDL completa implementada en Oracle Cloud Autonomous Database con integridad referencial, 
            claves foráneas y más de {totalRecords} registros reales cargados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Registros DML: </span>
            <span className="font-bold text-amber-400 font-mono">{totalRecords} filas</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar tabla o atributo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(table => (
          <div
            key={table.name}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-extrabold text-white font-mono flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>{table.name}</span>
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                    table.type === 'Fuerte'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : table.type === 'Débil'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : table.type === 'Asociativa (N:M)'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}
                >
                  {table.type}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                {table.description}
              </p>

              <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                  <Key className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="text-slate-500">PK:</span>
                  <span className="font-semibold">{table.pk}</span>
                </div>

                {table.fks.length > 0 && (
                  <div className="text-slate-300 font-mono">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                      <Link2 className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>Claves Foráneas (FK):</span>
                    </div>
                    {table.fks.map((fk, i) => (
                      <p key={i} className="text-[10px] text-blue-300 ml-4 font-mono">
                        ↳ {fk}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{table.category}</span>
              <span className="font-bold text-amber-400 font-mono bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                {table.records} registros
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
