// Genera los scripts de la carpeta database/ a partir de context/ y shared/.
//   01_esquema.sql           DDL corregido (ids geográficos VARCHAR2)
//   02_datos_prueba.sql      DML original
//   03_usuarios_sistema.sql  Tabla opcional de credenciales (login validado en Oracle)
//   04_reportes.sql          Los 12 reportes listos para SQL Developer
//   Uso: node scripts/generar-sql.mjs
import fs from 'fs';
import crypto from 'crypto';
import { REPORT_SQL } from '../shared/reportQueries.js';

const ddl = fs.readFileSync('context/esquema_restaurante.sql', 'utf8');
const geo = [
  ['Ciudad', 'idCiudad'], ['Ciudad', 'Departamento_idDepartamento'],
  ['Departamento', 'idDepartamento'], ['Departamento', 'Pais_idPais'],
  ['Pais', 'idPais'], ['Restaurante', 'Ciudad_idCiudad'],
];
let fixed = ddl;
for (const [table, col] of geo) {
  const re = new RegExp(`(CREATE TABLE ${table}\\s*\\([\\s\\S]*?\\n\\s*${col}\\s+)INTEGER`, 'm');
  if (!re.test(fixed)) throw new Error(`No se encontró ${table}.${col}`);
  fixed = fixed.replace(re, '$1VARCHAR2 (20)');
}
fixed = fixed.replace(/--  ERROR: (Column|FK) name length exceeds maximum allowed length\(30\) \r?\n/g, '');
// Formato compacto (el mismo que aparece en el documento de evidencias)
fixed = fixed
  .replace(/\r/g, '')
  .replace(/-- predefined type.*\n/g, '')
  .replace(/\n\s*\n/g, '\n')
  .replace(/ADD CONSTRAINT (\w+) FOREIGN KEY\s*\(\s*(\w+)\s*\)\s*REFERENCES (\w+)\s*\(\s*(\w+)\s*\)\s*;/g, 'ADD CONSTRAINT $1 FOREIGN KEY ($2) REFERENCES $3 ($4);')
  .replace(/ALTER TABLE (\w+)\s*\n\s*ADD/g, 'ALTER TABLE $1 ADD')
  .replace(/\(\s*\n/g, '(\n')
  .replace(/\n\s*\)\s*\n;/g, '\n);')
  .replace(/ +\n/g, '\n')
  .replace(/ +,/g, ',');
fs.mkdirSync('database', { recursive: true });
fs.writeFileSync('database/01_esquema.sql',
`-- =====================================================================
-- SABOR & RUTA - DDL del modelo relacional (30 tablas) - Oracle Database 21c
-- Base: context/esquema_restaurante.sql (Oracle SQL Developer Data Modeler)
-- Corrección aplicada: Pais.idPais, Departamento.idDepartamento/Pais_idPais,
-- Ciudad.idCiudad/Departamento_idDepartamento y Restaurante.Ciudad_idCiudad
-- pasan de INTEGER a VARCHAR2(20) porque el DML usa códigos ISO 3166
-- ('CO', 'CO-QUI', 'CO-QUI-SAL'). Con INTEGER los INSERT fallan con ORA-01722.
-- Los avisos "name length exceeds 30" del Data Modeler no aplican: Oracle
-- 12.2+ admite identificadores de hasta 128 caracteres.
-- =====================================================================
${fixed.split('-- Informe de Resumen')[0].trim()}
`);

fs.copyFileSync('context/datos_prueba_restaurantes_1.sql', 'database/02_datos_prueba.sql');

const hash = (p, salt) => crypto.scryptSync(p, salt, 32).toString('hex');
const users = [
  ['admin', 'admin123', 'Administrador', 'Administrador General', null, null],
  ['gerente.salento', 'salento123', 'Gerente', 'Carlos Ramírez', 1, null],
  ['gerente.cartagena', 'cartagena123', 'Gerente', 'Mariana Pérez', 2, null],
  ['turista.carlos', 'turista123', 'Turista', 'Carlos Mendoza', null, 'PE4587123'],
];
const q = v => (v === null ? 'NULL' : typeof v === 'number' ? v : `'${String(v).replace(/'/g, "''")}'`);
const inserts = users.map(([u, p, rol, nombre, rid, doc]) => {
  const salt = crypto.createHash('sha256').update('sabor-ruta-' + u).digest('hex').slice(0, 32);
  return `INSERT INTO UsuarioSistema (usuario, claveHash, salt, rol, nombreVisible, Restaurante_idRestaurante, Cliente_numeroDocumento, activo, fechaCreacion)
VALUES (${q(u)}, ${q(hash(p, salt))}, ${q(salt)}, ${q(rol)}, ${q(nombre)}, ${q(rid)}, ${q(doc)}, 1, SYSDATE);`;
}).join('\n');

fs.writeFileSync('database/03_usuarios_sistema.sql',
`-- =====================================================================
-- OPCIONAL: tabla de credenciales para el inicio de sesión validado en Oracle.
-- Si existe, el backend (POST /api/login) valida contra ella; si no existe,
-- valida contra los usuarios de demostración del servidor.
-- Las contraseñas se guardan como hash scrypt + salt (nunca en texto plano).
-- =====================================================================
CREATE TABLE UsuarioSistema
    (
     usuario                   VARCHAR2 (30)  NOT NULL ,
     claveHash                 VARCHAR2 (64)  NOT NULL ,
     salt                      VARCHAR2 (32)  NOT NULL ,
     rol                       VARCHAR2 (20)  NOT NULL ,
     nombreVisible             VARCHAR2 (60) ,
     Restaurante_idRestaurante INTEGER ,
     Cliente_numeroDocumento   VARCHAR2 (100) ,
     activo                    NUMBER (1) DEFAULT 1 NOT NULL ,
     fechaCreacion             DATE DEFAULT SYSDATE NOT NULL ,
     CONSTRAINT UsuarioSistema_PK PRIMARY KEY ( usuario ) ,
     CONSTRAINT UsuarioSistema_rol_CK CHECK ( rol IN ('Administrador', 'Gerente', 'Turista') ) ,
     CONSTRAINT UsuarioSistema_activo_CK CHECK ( activo IN (0, 1) ) ,
     CONSTRAINT UsuarioSistema_Restaurante_FK FOREIGN KEY ( Restaurante_idRestaurante ) REFERENCES Restaurante ( idRestaurante ) ,
     CONSTRAINT UsuarioSistema_Cliente_FK FOREIGN KEY ( Cliente_numeroDocumento ) REFERENCES Cliente ( numeroDocumento )
    )
;

${inserts}

COMMIT;
`);

const order = [1, 2, 3, 4, 5, 6, 7, 12, 8, 9, 10, 11];
fs.writeFileSync('database/04_reportes.sql',
`-- =====================================================================
-- SABOR & RUTA - 12 reportes (3 simples, 5 intermedios, 4 avanzados)
-- Mismo SQL que ejecuta la aplicación (shared/reportQueries.js).
-- En SQL Developer: al ejecutar (F5) pedirá :idRestaurante -> dejar en
-- blanco (NULL) para todas las sedes o escribir 1..6 para una sede.
-- =====================================================================

${order.map(id => REPORT_SQL[id] + ';').join('\n\n')}
`);
console.log('database/ generado: 01_esquema.sql, 02_datos_prueba.sql, 03_usuarios_sistema.sql, 04_reportes.sql');
