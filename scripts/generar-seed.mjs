// Genera src/data/seedData.ts a partir de context/datos_prueba_restaurantes_1.sql
// para que el modo sin conexión muestre EXACTAMENTE los mismos datos que Oracle.
//   Uso: npm run seed
import fs from 'fs';
import { parseDML, readText } from './sqlParse.mjs';
import { buildDataset } from '../shared/dataset.js';

const raw = parseDML(readText('context/datos_prueba_restaurantes_1.sql'));
const ds = buildDataset(raw);

const out = `// ARCHIVO GENERADO por scripts/generar-seed.mjs desde context/datos_prueba_restaurantes_1.sql
// No editar a mano: modifique el DML y ejecute \`npm run seed\`.
import type { Dataset } from '../types';

export const SEED_DATASET: Dataset = ${JSON.stringify(ds, null, 2)};

export const INITIAL_PAISES = SEED_DATASET.paises;
export const INITIAL_CIUDADES = SEED_DATASET.ciudades;
export const INITIAL_TIPOS_DOCUMENTO = SEED_DATASET.tiposDocumento;
export const INITIAL_ESTADOS = SEED_DATASET.estados;
export const INITIAL_PETICIONES_ESPECIALES = SEED_DATASET.peticionesEspeciales;
export const INITIAL_RESTAURANTES = SEED_DATASET.restaurantes;
export const INITIAL_CLIENTES = SEED_DATASET.clientes;
export const INITIAL_EXPERIENCIAS = SEED_DATASET.experiencias;
export const INITIAL_CARTAS_MENU = SEED_DATASET.cartasMenu;
export const INITIAL_ITEMS_MENU = SEED_DATASET.itemsMenu;
export const INITIAL_MESAS = SEED_DATASET.mesas;
export const INITIAL_PERSONAL = SEED_DATASET.personal;
export const INITIAL_ORDENES = SEED_DATASET.ordenes;
export const INITIAL_RESERVAS = SEED_DATASET.reservas;
export const INITIAL_RESENAS = SEED_DATASET.resenas;
export const INITIAL_PAGOS = SEED_DATASET.pagos;
`;
fs.writeFileSync('src/data/seedData.ts', out);
console.log('src/data/seedData.ts generado:', JSON.stringify(ds.conteos));
