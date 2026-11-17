// Utilidades para leer el DDL y el DML originales (context/*.sql)
import fs from 'fs';

export function parseDDL(text) {
  const tables = {};
  for (const m of text.matchAll(/CREATE TABLE (\w+)\s*\(([\s\S]*?)\)\s*;/g)) {
    const columns = [];
    for (const line of m[2].split('\n')) {
      const c = line.match(/^\s*(\w+)\s+(VARCHAR2|INTEGER|NUMBER|DATE)\s*(?:\((\d+)\))?\s*(NOT NULL)?/);
      if (c) columns.push({ name: c[1], type: c[2], length: c[3] ? +c[3] : null, notNull: !!c[4] });
    }
    tables[m[1]] = { name: m[1], columns, pk: [], fks: [] };
  }
  for (const m of text.matchAll(/ALTER TABLE (\w+)\s+ADD CONSTRAINT (\w+) PRIMARY KEY \(([^)]*)\)/g)) {
    tables[m[1]].pk = m[3].split(',').map(s => s.trim());
    tables[m[1]].pkName = m[2];
  }
  for (const m of text.matchAll(/ALTER TABLE (\w+)\s+ADD CONSTRAINT (\w+) FOREIGN KEY\s*\(\s*([\w\s,]+?)\s*\)\s*REFERENCES (\w+)\s*\(\s*([\w\s,]+?)\s*\)/g)) {
    tables[m[1]].fks.push({ name: m[2], column: m[3].trim(), refTable: m[4], refColumn: m[5].trim() });
  }
  return tables;
}

function splitValues(s) {
  const out = []; let cur = ''; let q = false; let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "'") {
      if (q && s[i + 1] === "'") { cur += "''"; i++; continue; }
      q = !q; cur += ch; continue;
    }
    if (!q) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function parseLiteral(v) {
  if (/^NULL$/i.test(v)) return null;
  const d = v.match(/^TO_DATE\('([^']*)'\s*,\s*'([^']*)'\)$/i);
  if (d) return d[1];
  if (v.startsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
  return Number(v);
}

/** Devuelve { Tabla: [ {columna: valor} ] } con los nombres de columna exactos del DDL. */
export function parseDML(text) {
  const rows = {};
  for (const m of text.matchAll(/INSERT INTO (\w+)\s*\(([^)]*)\)\s*VALUES\s*\((.*)\);/g)) {
    const cols = m[2].split(',').map(s => s.trim());
    const vals = splitValues(m[3]).map(parseLiteral);
    const row = {};
    cols.forEach((c, i) => { row[c] = vals[i]; });
    (rows[m[1]] ||= []).push(row);
  }
  return rows;
}

/** Detecta el formato TO_DATE usado por cada columna DATE en el DML. */
export function detectDateFormats(text) {
  const formats = {};
  for (const m of text.matchAll(/INSERT INTO (\w+)\s*\(([^)]*)\)\s*VALUES\s*\((.*)\);/g)) {
    const cols = m[2].split(',').map(s => s.trim());
    splitValues(m[3]).forEach((v, i) => {
      const d = v.match(/^TO_DATE\('[^']*'\s*,\s*'([^']*)'\)$/i);
      if (d) formats[`${m[1]}.${cols[i]}`] = d[1];
    });
  }
  return formats;
}

export const readText = p => fs.readFileSync(p, 'utf8');
