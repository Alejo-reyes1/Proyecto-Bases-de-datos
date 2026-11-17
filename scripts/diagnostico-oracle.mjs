// Diagnóstico de SOLO LECTURA de la conexión a Oracle y del esquema.
//   Uso: node scripts/diagnostico-oracle.mjs
import dotenv from 'dotenv';
import oracledb from 'oracledb';
import { SCHEMA, TABLE_NAMES } from '../shared/schema.js';

dotenv.config();
const conn = await oracledb.getConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  configDir: process.env.TNS_ADMIN,
  walletLocation: process.env.TNS_ADMIN,
  walletPassword: process.env.DB_WALLET_PASSWORD || process.env.DB_PASSWORD || undefined, // el wallet de OCI suele usar la misma clave
});
const O = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const q = async (sql, b = {}) => (await conn.execute(sql, b, O)).rows;

console.log('Conexión OK:', (await q(`SELECT SYS_CONTEXT('USERENV','DB_NAME') DB, USER U, TO_CHAR(SYSDATE,'YYYY-MM-DD HH24:MI') F FROM dual`))[0]);
console.log('Versión:', (await q(`SELECT banner_full FROM v$version`))[0]?.BANNER_FULL?.split('\n')[0]);

const tablas = (await q(`SELECT table_name FROM user_tables`)).map(r => r.TABLE_NAME);
const faltan = TABLE_NAMES.filter(t => !tablas.includes(t.toUpperCase()));
console.log(`Tablas del usuario: ${tablas.length} · faltan del modelo: ${faltan.length ? faltan.join(', ') : 'ninguna'}`);
console.log('UsuarioSistema existe:', tablas.includes('USUARIOSISTEMA'));

const cols = await q(`SELECT table_name, column_name, data_type, data_length FROM user_tab_columns`);
const dif = [];
for (const t of TABLE_NAMES) for (const c of SCHEMA[t].columns) {
  const r = cols.find(x => x.TABLE_NAME === t.toUpperCase() && x.COLUMN_NAME === c.name.toUpperCase());
  if (!r) { dif.push(`${t}.${c.name}: no existe`); continue; }
  const esperado = c.type === 'INTEGER' ? 'NUMBER' : c.type;
  if (r.DATA_TYPE !== esperado || (c.type === 'VARCHAR2' && r.DATA_LENGTH !== c.length))
    dif.push(`${t}.${c.name}: Oracle ${r.DATA_TYPE}(${r.DATA_LENGTH}) · modelo ${c.type}${c.length ? `(${c.length})` : ''}`);
}
console.log('Diferencias de columnas:', dif.length ? '\n  ' + dif.join('\n  ') : 'ninguna');

const fk = (await q(`SELECT COUNT(*) N FROM user_constraints WHERE constraint_type='R'`))[0].N;
const pk = (await q(`SELECT COUNT(*) N FROM user_constraints WHERE constraint_type='P'`))[0].N;
console.log(`Constraints: ${pk} PK, ${fk} FK`);

let total = 0;
const conteo = {};
for (const t of TABLE_NAMES) {
  if (faltan.includes(t)) continue;
  conteo[t] = (await q(`SELECT COUNT(*) N FROM ${t}`))[0].N;
  total += conteo[t];
}
console.log(`Filas: ${total}`, JSON.stringify(conteo));
await conn.close();
