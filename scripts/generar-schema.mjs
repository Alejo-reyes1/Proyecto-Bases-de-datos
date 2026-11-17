// Genera shared/schema.js a partir de context/esquema_restaurante.sql
import fs from 'fs';
import { parseDDL, detectDateFormats, readText } from './sqlParse.mjs';

const ddl = parseDDL(readText('context/esquema_restaurante.sql'));
const formats = detectDateFormats(readText('context/datos_prueba_restaurantes_1.sql'));

// Corrección: los ids geográficos son códigos ISO (texto) en el DML.
const GEO = new Set(['Pais.idPais', 'Departamento.idDepartamento', 'Departamento.Pais_idPais',
  'Ciudad.idCiudad', 'Ciudad.Departamento_idDepartamento', 'Restaurante.Ciudad_idCiudad']);

for (const t of Object.values(ddl)) {
  for (const c of t.columns) {
    if (GEO.has(`${t.name}.${c.name}`)) { c.type = 'VARCHAR2'; c.length = 20; c.corrected = true; }
    if (c.type === 'DATE') c.format = formats[`${t.name}.${c.name}`] || 'YYYY-MM-DD';
  }
}
const out = `// ARCHIVO GENERADO por scripts/generar-schema.mjs a partir del DDL. No editar a mano.
// Las 30 tablas del modelo relacional con columnas, PK y FK.
export const SCHEMA = ${JSON.stringify(ddl, null, 2)};

export const TABLE_NAMES = Object.keys(SCHEMA);
`;
fs.writeFileSync('shared/schema.js', out);
console.log('shared/schema.js ->', Object.keys(ddl).length, 'tablas');
