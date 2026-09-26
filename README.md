# 🧺 API REST con Arquitectura en Capas — Lavandería y Tintorería

API REST para la gestión de órdenes de lavandería desarrollada con Node.js, Express 5 y TypeScript aplicando una arquitectura en 4 capas desacopladas.

## 🏗️ Arquitectura del Sistema

```text
src/
├── routes/          # Capa de Mapeo: Asigna URLs a funciones del controlador
├── controllers/     # Capa del Controlador: Recibe req, invoca servicio y responde
├── services/        # Capa de Servicio: Lógica de negocio y paginación (sin Express)
├── repositories/    # Capa del Repositorio: Acceso a datos con copias defensivas
├── types.ts         # Contratos tipados de respuesta e interfaces de dominio
├── app.ts           # Configuración de Middlewares
└── server.ts        # Inicialización del servidor y Graceful Shutdown