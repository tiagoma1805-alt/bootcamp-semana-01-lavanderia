# 🧺 CLI Procesador de Servicios de Lavandería y Tintorería

Herramienta de línea de comandos (CLI) construida con **Node.js**, **TypeScript** y **async/await** para procesar, filtrar y generar reportes estadísticos a partir de un catálogo de servicios de lavandería y tintorería.

---

## 📋 Dominio Asignado

* **Dominio:** Lavandería / Tintorería
* **Recurso Principal:** `LaundryService` (Servicio de Lavandería)
* **Archivo de Datos:** `data/services.json`
* **Atributos del Recurso:**
  * `id` (string): Identificador único del servicio (ej. `SRV-001`).
  * `name` (string): Nombre del servicio (ej. `Traje de 2 Piezas`).
  * `category` (string): Categoría del servicio (`Tintorería`, `Planchado`, `Lavado en Agua`, `Cuidado Especial`).
  * `price` (number): Precio en moneda local.
  * `available` (boolean): Estado de disponibilidad actual del servicio.
  * `turnaroundHours` (number): Tiempo estimado de entrega en horas.

---

## 🏗️ Estructura del Proyecto

```text
lavanderia-cli/
├── data/
│   └── services.json       # Base de datos del catálogo (10 registros)
├── output/
│   └── report.json         # Reporte final generado automáticamente
├── src/
│   ├── types.ts            # Interfaces y tipos de TypeScript
│   └── index.ts            # Lógica principal del CLI y lectura/escritura de archivos
├── package.json            # Configuración de dependencias y scripts
├── tsconfig.json           # Configuración del compilador TypeScript
└── README.md               # Documentación del proyecto