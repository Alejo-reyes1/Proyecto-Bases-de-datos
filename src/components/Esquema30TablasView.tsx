import React, { useState } from 'react';
import { Database, Search, Key, Link2, Network, Image as ImageIcon } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { SCHEMA } from '../../shared/schema.js';

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
  { name: 'Departamento', type: 'Fuerte', category: 'Geografía', pk: 'idDepartamento (VARCHAR2)', fks: ['Pais_idPais -> Pais'], records: 18, description: 'Subdivisiones territoriales y departamentos' },
  { name: 'Ciudad', type: 'Fuerte', category: 'Geografía', pk: 'idCiudad (VARCHAR2)', fks: ['Departamento_idDepartamento -> Departamento'], records: 23, description: 'Ciudades y destinos turísticos (Salento, Armenia, Cartagena, etc.)' },

  // 2. Parámetros Generales
  { name: 'TipoDocumento', type: 'Fuerte', category: 'Negocio Core', pk: 'idTipoDocumento (INTEGER)', fks: [], records: 5, description: 'Tipologías de identificación (CC, Pasaporte, CE, NIT)' },
  { name: 'Estado', type: 'Fuerte', category: 'Negocio Core', pk: 'idEstado (INTEGER)', fks: [], records: 8, description: 'Estados de ciclo de vida de órdenes y reservas' },
  { name: 'Idioma', type: 'Fuerte', category: 'Personal y Roles', pk: 'idIdioma (INTEGER)', fks: [], records: 6, description: 'Idiomas dominados por el personal bilingüe para atención turística' },
  { name: 'MetodoPago', type: 'Fuerte', category: 'Pagos y Reseñas', pk: 'idMetodoPago (INTEGER)', fks: [], records: 5, description: 'Medios de pago (efectivo, tarjetas, Nequi, transferencia)' },
  { name: 'PeticionEspecial', type: 'Fuerte', category: 'Negocio Core', pk: 'idPeticion (INTEGER)', fks: [], records: 6, description: 'Requerimientos especiales para comensales (alergias, vista panorámica)' },

  // 3. Negocio Core
  { name: 'Restaurante', type: 'Fuerte', category: 'Negocio Core', pk: 'idRestaurante (INTEGER)', fks: ['Ciudad_idCiudad -> Ciudad'], records: 6, description: 'Establecimiento gastronómico turístico con ubicación y horario' },
  { name: 'Cliente', type: 'Fuerte', category: 'Negocio Core', pk: 'numeroDocumento (VARCHAR2)', fks: ['TipoDocumento_idTipoDocumento -> TipoDocumento'], records: 15, description: 'Turistas nacionales e internacionales con país de origen' },
  { name: 'ExperienciaTuristica', type: 'Fuerte', category: 'Negocio Core', pk: 'idExperiencia (INTEGER)', fks: ['Restaurante_idRestaurante -> Restaurante'], records: 8, description: 'Tours de café, catas guiadas y talleres gastronómicos con chefs' },
  { name: 'Mesa', type: 'Fuerte', category: 'Negocio Core', pk: 'idMesa (INTEGER)', fks: ['Restaurante_idRestaurante -> Restaurante'], records: 18, description: 'Mesas físicas por restaurante con capacidad y disponibilidad' },

  // 4. Menú
  { name: 'CartaMenu', type: 'Fuerte', category: 'Menú y Platos', pk: 'idCategoria (INTEGER)', fks: ['Restaurante_idRestaurante -> Restaurante'], records: 16, description: 'Secciones o categorías de la carta (Entradas, Platos fuertes, Bebidas, Postres...)' },
  { name: 'ItemMenu', type: 'Fuerte', category: 'Menú y Platos', pk: 'idItem (INTEGER)', fks: ['CategoriaMenu_idCategoria -> CartaMenu'], records: 35, description: 'Platos y bebidas con precio, indicador vegetariano e descripción' },

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

const ER_IMAGE = '/diagramas/diagrama-er.png';
const RELACIONAL_PDF = '/diagramas/diagrama-relacional.pdf';

type Vista = 'diccionario' | 'er' | 'relacional';

export const Esquema30TablasView: React.FC = () => {
  const { conteos, isOracleConnected } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [vista, setVista] = useState<Vista>('diccionario');
  const [erDisponible, setErDisponible] = useState(true);
  const [abierta, setAbierta] = useState<string | null>(null);

  const categories = ['Todas', 'Geografía', 'Negocio Core', 'Menú y Platos', 'Personal y Roles', 'Órdenes y Ventas', 'Pagos y Reseñas'];
  const schema = SCHEMA as Record<string, any>;

  const filtered = TABLAS_MODELO.filter(t => {
    const cols: string[] = (schema[t.name]?.columns || []).map((c: any) => c.name.toLowerCase());
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || cols.some(c => c.includes(q));
    return matchesSearch && (selectedCategory === 'Todas' || t.category === selectedCategory);
  });

  const totalRecords = Object.values(conteos || {}).reduce((s, n) => s + Number(n || 0), 0);
  const fuertes = TABLAS_MODELO.filter(t => t.type === 'Fuerte').length;
  const tipoCol = (c: any) => (c.type === 'VARCHAR2' ? `VARCHAR2(${c.length})` : c.type);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              MODELO RELACIONAL · ORACLE 21c
            </span>
            <span className="text-xs text-slate-400">
              30 tablas · {fuertes} entidades fuertes (mínimo exigido: 10)
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">Modelo de Datos y Diccionario</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Columnas, tipos, PK y FK leídos del DDL (esquema_restaurante.sql). Conteo de filas{' '}
            {isOracleConnected ? 'en vivo desde Oracle Cloud' : 'del DML de prueba (modo local)'}.
          </p>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Filas: </span>
          <span className="font-bold text-amber-400 font-mono">{totalRecords}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 max-w-xl">
        {(
          [
            ['diccionario', 'Diccionario de datos'],
            ['er', 'Diagrama E-R'],
            ['relacional', 'Diagrama relacional'],
          ] as [Vista, string][]
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setVista(v)}
            className={`py-2 rounded-lg text-xs font-bold ${vista === v ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {vista === 'er' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Diagrama Entidad-Relación (modelo conceptual)</h3>
          </div>
          {erDisponible ? (
            <a href={ER_IMAGE} target="_blank" rel="noreferrer">
              <img
                src={ER_IMAGE}
                alt="Diagrama Entidad-Relación de Sabor & Ruta"
                onError={() => setErDisponible(false)}
                className="w-full rounded-xl bg-white border border-slate-800"
              />
            </a>
          ) : (
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center space-y-2">
              <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Espacio reservado para el diagrama Entidad-Relación</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Exporte el diagrama E-R (entidades, atributos, relaciones y cardinalidades) como imagen PNG y guárdelo en{' '}
                <code className="text-amber-300">public/diagramas/diagrama-er.png</code>. Aparecerá aquí automáticamente.
              </p>
            </div>
          )}
        </div>
      )}

      {vista === 'relacional' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white">Diagrama relacional (Oracle SQL Developer Data Modeler)</h3>
            <a href={RELACIONAL_PDF} target="_blank" rel="noreferrer" className="text-xs text-amber-400 hover:underline">
              Abrir en pestaña nueva
            </a>
          </div>
          <iframe src={RELACIONAL_PDF} title="Diagrama relacional" className="w-full h-[75vh] rounded-xl bg-white border border-slate-800" />
        </div>
      )}

      {vista === 'diccionario' && (
        <>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar tabla o columna..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(table => {
              const def = schema[table.name];
              const fkCols = new Map<string, string>((def?.fks || []).map((f: any) => [f.column, `${f.refTable}.${f.refColumn}`]));
              const isOpen = abierta === table.name;
              return (
                <div key={table.name} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-sm font-extrabold text-white font-mono flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-amber-400" />
                        {table.name}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                          table.type === 'Fuerte'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : table.type === 'Asociativa (N:M)'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {table.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{table.description}</p>

                    <div className="space-y-1 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Key className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="text-slate-500">PK:</span>
                        <span className="font-semibold break-all">{(def?.pk || []).join(' + ')}</span>
                      </div>
                      {(def?.fks || []).map((f: any) => (
                        <p key={f.name} className="text-[10px] text-blue-300 flex items-start gap-1.5 break-all">
                          <Link2 className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                          {f.column} → {f.refTable}
                        </p>
                      ))}
                    </div>

                    {isOpen && (
                      <div className="overflow-x-auto">
                        <table className="w-full mt-3 text-[10px] font-mono">
                          <thead className="text-slate-500">
                            <tr>
                              <th className="text-left py-1">Columna</th>
                              <th className="text-left">Tipo</th>
                              <th className="text-center">Nulo</th>
                              <th className="text-center">Llave</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {(def?.columns || []).map((c: any) => (
                              <tr key={c.name} className="text-slate-300">
                                <td className="py-1 pr-1 break-all">{c.name}</td>
                                <td className="pr-1">
                                  {tipoCol(c)}
                                  {c.corrected && <span className="text-amber-400">*</span>}
                                </td>
                                <td className="text-center">{c.notNull ? 'NO' : 'SÍ'}</td>
                                <td className="text-center">
                                  {def.pk.includes(c.name) && <span className="text-amber-400">PK </span>}
                                  {fkCols.has(c.name) && (
                                    <span className="text-blue-300" title={fkCols.get(c.name)}>
                                      FK
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <button onClick={() => setAbierta(isOpen ? null : table.name)} className="text-amber-400 hover:underline font-semibold">
                      {isOpen ? 'Ocultar columnas' : `Ver ${def?.columns.length || 0} columnas`}
                    </button>
                    <span className="font-bold text-amber-400 font-mono bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {conteos?.[table.name] ?? 0} filas
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500">
            * Tipo corregido a VARCHAR2: los identificadores geográficos son códigos ISO 3166 ('CO', 'CO-QUI', 'CO-QUI-SAL'). Ver
            database/01_esquema.sql.
          </p>
        </>
      )}
    </div>
  );
};
