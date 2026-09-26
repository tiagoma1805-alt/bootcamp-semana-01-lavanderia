# 🧺 API REST Express 5 — Sistema de Gestión para Lavandería y Tintorería

API REST desarrollada con **Node.js**, **Express 5** y **TypeScript** sobre el dominio asignado de **Lavandería y Tintorería**, incluyendo operaciones CRUD completas sobre órdenes de servicio, middlewares personalizados y manejo de códigos de estado HTTP.

## 🗂️ Estructura del Proyecto

```text
lavanderia-app/
├── package.json
├── tsconfig.json
├── .env
├── README.md
└── src/
    ├── app.ts                  # Configuración de Express, rutas y middlewares
    ├── server.ts               # Entry point y manejo de Graceful Shutdown
    ├── types.ts                # Interfaces del recurso principal (Order)
    ├── store.ts                # Store en memoria (Operaciones CRUD)
    └── routes/
        └── items.routes.ts     # Endpoints CRUD (/api/v1/orders)