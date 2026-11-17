// Ejecuta un script .sql contra Oracle (sentencias separadas por ';' al final de línea).
//   Uso: node scripts/ejecutar-sql.mjs database/03_usuarios_sistema.sql
import fs from 'fs';
import dotenv from 'dotenv';
import oracledb from 'oracledb';

dotenv.config({ quiet: true });
const file = process.argv[2];
if (!file) throw new Error('Indique el archivo .sql');

const text = fs.readFileSync(file, 'utf8').replace(/\r/g, '');
const stmts = text
  .split(/;\s*\n/)
  .map(s => s.split('\n').filter(l => !l.trim().startsWith('--')).join('\n').trim())
  .filter(s => s && !/^(COMMIT|SET\s)/i.test(s));

const conn = await oracledb.getConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  configDir: process.env.TNS_ADMIN,
  walletLocation: process.env.TNS_ADMIN,
  walletPassword: process.env.DB_WALLET_PASSWORD || process.env.DB_PASSWORD || undefined,
});
let n = 0;
try {
  for (const s of stmts) {
    await conn.execute(s);
    n++;
    console.log(`OK ${n}/${stmts.length}: ${s.split('\n')[0].slice(0, 90)}`);
  }
  await conn.commit();
  console.log(`COMMIT · ${n} sentencias ejecutadas`);
} catch (err) {
  await conn.rollback();
  console.error(`ERROR en la sentencia ${n + 1} (ROLLBACK de los INSERT; un CREATE TABLE ya ejecutado no se revierte):\n${stmts[n].slice(0, 300)}\n${err.message}`);
  process.exitCode = 1;
} finally {
  await conn.close();
}
