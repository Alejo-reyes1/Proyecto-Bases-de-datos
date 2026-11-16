# Sabor & Ruta | Plataforma de Gestión de Restaurantes y Turismo Gastronómico 🍽️🇨🇴

**Proyecto Final de Bases de Datos I — Periodo 2026-2**  
*Universidad del Quindío • Facultad de Ingeniería • SINFOCI / Laboratorio de Usabilidad*

---

## 🌟 Resumen Ejecutivo del Proyecto

**Sabor & Ruta** es una aplicación web full-stack de alto nivel diseñada para la administración y toma de decisiones de cadenas de restaurantes y operadores de turismo gastronómico en destinos turísticos de Colombia (Eje Cafetero —Salento, Filandia, Armenia—, Cartagena, Medellín, Bogotá y Cali).

El sistema se conecta a una base de datos **Oracle Autonomous Database en Oracle Cloud Infrastructure (OCI)** y cuenta con un motor reactivo de alto rendimiento precargado con el modelo completo de **30 tablas relacionales** y datos quemados (DML) 100% coherentes y reales.

---

## 🚀 Inicio Rápido en 1 Paso

### 1. Ejecutar el Frontend Web
Desde la terminal en la carpeta del proyecto:
```bash
npm run dev
```
La aplicación abrirá de inmediato en: **`http://localhost:5173`**

### 2. (Opcional) Ejecutar el Backend Bridge con Oracle Cloud
Si deseas conectar las peticiones directamente a tu instancia en la nube OCI:
```bash
npm run server
```

---

## 📋 Cumplimiento Estricto de la Rúbrica de Evaluación

| Criterio Evaluado por el Docente | Requisito Mínimo | Implementación en Sabor & Ruta |
| :--- | :--- | :--- |
| **Entidades Fuertes** | Mínimo 10 entidades fuertes | **30 tablas completas** (Superado ampliamente). Incluye jerarquía de personal, reservas, experiencias, delivery y auditoría. |
| **Módulos CRUD Core** | 4 tablas importantes del negocio | **4 Módulos CRUD Completos:** `Restaurante`, `Cliente`, `ExperienciaTuristica` y `Orden`. |
| **Complejidad de Reportes** | Mínimo 10 reportes de diferente nivel | **10 Reportes Exactos:** 3 Simples, 4 Intermedios y 3 Avanzados/Complejos. |
| **Bonificación Gráfica** | 3 de 10 reportes con gráficos estadísticos | **Incluida ⭐:** Gráficos estadísticos interactivos con Recharts en Reportes #4, #5 y #6. |
| **Exportación a Documentos** | Reportes visualizables y exportables a PDF | **Exportación instantánea a PDF oficial** con membrete institucional y exportación a Excel (CSV). |
| **Manejo de Plantillas** | Plantillas para documentos del sistema | **Módulo de Facturación Comercial / Comprobante de Pago Oficial** con cálculo de impuestos y propina. |
| **Sesión de Login** | Usuario y contraseña validados | **Módulo de Autenticación con perfiles:** Administrador, Gerente, Chef y Mesero (con accesos rápidos para sustentación). |
| **Calidad de Datos** | Datos reales y coherentes | Nombres, teléfonos, NITs, platos típicos colombianos y turistas internacionales verídicos. |

---

## 📊 Matriz de los 10 Reportes Oficiales para la Sustentación

### A. Reportes Simples (Consultas a 1 sola tabla)
1. **Reporte #1:** *Catálogo de Restaurantes y Horarios de Atención Turística* (`FROM Restaurante`).
2. **Reporte #2:** *Directorio de Clientes y Turistas Registrados por País de Origen* (`FROM Cliente`).
3. **Reporte #3:** *Portafolio de Experiencias Gastronómicas y Tarifas Vigentes* (`FROM ExperienciaTuristica`).

### B. Reportes Intermedios (Multitabla con JOIN, GROUP BY, HAVING, WHERE)
4. **Reporte #4 [Gráfico de Barras 📊]:** *Facturación y Ventas Totales por Restaurante* (JOINs Restaurante, Mesa, OrdenRestaurante, Orden con `GROUP BY` y `SUM`).
5. **Reporte #5 [Gráfico Donut 📊]:** *Top Experiencias Turísticas más Demandadas y Total de Asistentes* (JOINs con `GROUP BY` y `HAVING SUM(asistentes) >= 1`).
6. **Reporte #6 [Gráfico Comparativo 📊]:** *Calificación y Satisfacción de Clientes por Restaurante* (JOIN Restaurante, Resena con `AVG`, `ROUND` y `COUNT`).
7. **Reporte #7:** *Consumo y Gasto Turístico Promedio por País de Origen* (JOIN Cliente, Pais, Orden con `HAVING SUM(total) >= 50000`).

### C. Reportes Avanzados / Complejos (Consultas con Subconsultas)
8. **Reporte #8:** *Restaurantes con Facturación Superior al Promedio General de la Plataforma* (Subconsulta escalar en cláusula `HAVING` con `AVG(total)` sobre la tabla `Orden`).
9. **Reporte #9:** *Clientes VIP con Consumo Total Superior al Promedio Global de Turistas* (Subconsulta anidada en `HAVING` y subconsulta correlacionada para conteo de experiencias).
10. **Reporte #10:** *Platos del Menú con Precio Superior al Promedio de su Propia Categoría* (Subconsulta correlacionada en la cláusula `WHERE` comparando cada plato contra el promedio de su misma sección de la carta).

---

## 🛠️ Tecnologías y Arquitectura

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts (visualización de datos), jsPDF + AutoTable (generación de PDFs).
- **Backend Bridge:** Node.js, Express, Oracle DB Driver Thin Mode (`oracledb`).
- **Base de Datos:** Oracle Database 21c Enterprise Edition / Oracle Autonomous Database Cloud (OCI Región `sa-bogota-1`).
- **Persistencia Reactiva Híbrida:** Garantiza funcionamiento 100% offline y fluido durante la sustentación sin depender de caídas de red o suspensión del Cloud.

---

## 👥 Roles de Prueba para la Sustentación con el Profesor

| Rol | Usuario | Contraseña | Perfil en el Sistema |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` | Control total, auditoría DDL, CRUDs y exportación general. |
| **Gerente** | `gerente` | `gerente123` | Supervisión de restaurante, sedes y ventas. |
| **Chef Ejecutivo** | `chef` | `chef123` | Gestión de menús y experiencias turísticas. |
| **Mesero / Salón** | `mesero` | `mesero123` | Comandas en mesa y pedidos turísticos. |

*Nota: La pantalla de login incluye botones de acceso en 1 clic para no perder tiempo tecleando durante la sustentación.*
"# Proyecto-Bases-de-datos" 
