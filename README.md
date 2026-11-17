# Sabor & Ruta — Restaurantes y Turismo Gastronómico

Proyecto Final de Bases de Datos I (2026-2) · Universidad del Quindío.
Aplicación web (React + Node.js) conectada a **Oracle Autonomous Database 21c (OCI)** con un modelo de **30 tablas**.

## Puesta en marcha

```bash
npm install
cp .env.example .env      # y escribir DB_PASSWORD (el .env NO se sube a git)
npm run server            # backend Node/Express <-> Oracle (puerto 3001)
npm run dev               # frontend en http://localhost:5173 (Vite redirige /api al backend)
```

`.env`:

| Variable | Valor |
| --- | --- |
| `TNS_ADMIN` | Carpeta del Oracle Wallet descomprimido |
| `DB_USER` / `DB_PASSWORD` | Usuario y contraseña del esquema |
| `DB_CONNECT_STRING` | `proyectorestaurante_medium` |
| `DB_WALLET_PASSWORD` | Solo si el wallet tiene `ewallet.pem` cifrado |

La barra superior indica la fuente de datos: **verde = Oracle Cloud** (los CRUD hacen COMMIT en Oracle y los reportes ejecutan su SQL allí); **ámbar = modo local**, que usa exactamente los datos del DML (`src/data/seedData.ts` se genera desde el script).

## Base de datos (`database/`)

| Script | Contenido |
| --- | --- |
| `01_esquema.sql` | DDL de las 30 tablas (ids geográficos corregidos a VARCHAR2: el DML usa códigos ISO) |
| `02_datos_prueba.sql` | 438 INSERT coherentes (0 FK huérfanas, totales cuadrados) |
| `03_usuarios_sistema.sql` | Opcional: tabla `UsuarioSistema` con contraseñas hash para el login en Oracle |
| `04_reportes.sql` | Los 12 reportes para correr en SQL Developer |

## Usuarios de demostración

| Rol | Usuario | Contraseña | Alcance |
| --- | --- | --- | --- |
| Administrador | `admin` | `admin123` | Las 6 sedes |
| Gerente | `gerente.salento` | `salento123` | El Fogón Cafetero |
| Gerente | `gerente.cartagena` | `cartagena123` | Mar y Murallas |
| Turista | `turista.carlos` | `turista123` | Sus reservas y facturas (cliente PE4587123) |

## Funcionalidades frente a la rúbrica

- **CRUD core (4):** Restaurante, Cliente, ExperienciaTuristica y Orden (maestro-detalle transaccional: Orden + DetalleOrden + DetalleExperienciaOrden + OrdenRestaurante/OrdenDomicilio).
- **12 reportes:** 3 simples, 5 intermedios, 4 avanzados; 4 con gráfico (#4, #5, #6, #12); PDF y CSV.
- **Login validado en el servidor** y **registro de cuenta** de turista.
- **Plantillas:** factura/comprobante de pago y voucher de reserva en PDF.
- **Pago en línea** con uno o varios medios (Pago + PagoMetodoPago).
- **Recordatorios y notificaciones:** reservas próximas o por confirmar, órdenes en curso y sin pago.
- **Modelo de datos:** diccionario generado del DDL, diagrama relacional y espacio para el diagrama E-R (`public/diagramas/diagrama-er.png`).

## Scripts de generación

```bash
npm run seed                          # schema + seedData.ts desde context/*.sql
node scripts/generar-sql.mjs          # regenera database/
node scripts/generar-diccionario.mjs  # diccionario de datos en markdown
```
