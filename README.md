🧺 API REST - Lavandería & Tintorería (Semana 06)
API REST desarrollada con Express 5, TypeScript, Mongoose y MongoDB, orientada a la gestión de servicios y categorías para una lavandería / tintorería.

📋 Dominio y Entidades
1. Entidad Secundaria: Category (Categorías de Lavado)
Representa las categorías generales del negocio (sin dependencias de otras entidades).

name (String, Requerido, Único, Trim)

description (String, Opcional, Trim)

2. Entidad Principal: Service (Servicios de Lavandería)
Representa los servicios individuales ofertados al cliente.

name (String, Requerido, Único, Trim)

price (Number, Requerido, Min: 0)

estimatedHours (Number, Requerido, Min: 1)

category (ObjectId, Requerido, Referencia a Category)

🛠️ Stack Técnico
Node.js v22

Express v5.1.0

TypeScript v5.8.3

Mongoose v8.12.0

MongoDB v7 (Docker)

Zod v3.24.2

📁 Estructura del Proyecto
Plaintext
semana06-lavanderia/
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .env
└── src/
    ├── lib/
    │   └── mongoose.ts          # Conexión a MongoDB
    ├── models/
    │   ├── category.model.ts    # Esquema Mongoose Categoría
    │   └── service.model.ts     # Esquema Mongoose Servicio con ref
    ├── errors/
    │   └── AppError.ts          # Clase personalizada de error
    ├── middlewares/
    │   ├── errorHandler.ts      # Middleware global de errores
    │   └── notFound.ts          # Middleware para rutas inexistentes
    ├── schemas/
    │   ├── category.schema.ts   # Validación Zod Categoría
    │   └── service.schema.ts    # Validación Zod Servicio + ObjectId
    ├── repositories/
    │   ├── category.repository.ts # CRUD Categoría + manejo de errores
    │   └── service.repository.ts  # CRUD Servicio + populate + paginación
    ├── services/
    │   ├── category.service.ts    # Lógica de negocio Categoría
    │   └── service.service.ts     # Lógica de negocio Servicio
    ├── controllers/
    │   ├── category.controller.ts # Controladores HTTP Categoría
    │   └── service.controller.ts  # Controladores HTTP Servicio
    ├── routes/
    │   ├── category.routes.ts     # Rutas /api/v1/categories
    │   └── service.routes.ts      # Rutas /api/v1/services
    ├── app.ts                    # Configuración de Express
    ├── server.ts                 # Inicio del servidor HTTP
    └── seed.ts                   # Poblamiento de datos de prueba
🚀 Instalación y Ejecución
Clonar / Ubicarse en el proyecto:

Bash
cd semana06-lavanderia
Instalar dependencias y autorizar scripts de compilación:

Bash
pnpm install
pnpm approve-builds
Iniciar el contenedor de MongoDB con Docker:

Bash
docker compose up -d
Poblar la base de datos (Seed):

Bash
pnpm seed
Iniciar el servidor de desarrollo:

Bash
pnpm dev
El servidor estará disponible en http://localhost:3000.

📌 Endpoints de la API
🏷️ Categorías (/api/v1/categories)
Método	Endpoint	Descripción
GET	/api/v1/categories	Obtener todas las categorías
GET	/api/v1/categories/:id	Obtener categoría por ID
POST	/api/v1/categories	Crear una nueva categoría
PUT	/api/v1/categories/:id	Actualizar una categoría por ID
DELETE	/api/v1/categories/:id	Eliminar una categoría por ID
🧺 Servicios (/api/v1/services)
Método	Endpoint	Descripción
GET	/api/v1/services?page=1&limit=10	Obtener servicios paginados + populate('category')
GET	/api/v1/services/:id	Obtener servicio por ID + populate('category')
POST	/api/v1/services	Crear un servicio (valida ID de categoría con Zod)
PUT	/api/v1/services/:id	Actualizar un servicio por ID
DELETE	/api/v1/services/:id	Eliminar un servicio por ID
📄 Respuestas de Ejemplo
Paginación + Populate (GET /api/v1/services?page=1&limit=2)
JSON
{
  "data": [
    {
      "_id": "66f5bc2f1a2b3c4d5e6f7a8b",
      "name": "Terno Completo 2 Piezas",
      "price": 25000,
      "estimatedHours": 24,
      "category": {
        "_id": "66f5bc2f1a2b3c4d5e6f7a8a",
        "name": "Lavado al Seco",
        "description": "Tratamiento delicado para trajes y vestidos"
      },
      "createdAt": "2026-09-26T17:00:00.000Z",
      "updatedAt": "2026-09-26T17:00:00.000Z"
    }
  ],
  "total": 4,
  "page": 1,
  "totalPages": 2
}
⚠️ Manejo de Errores
Código HTTP	Tipo de Error	Descripción
400 Bad Request	Validaciones / CastError	ID de MongoDB con formato inválido o fallo en esquema Zod.
404 Not Found	No encontrado	El recurso solicitado no existe en la base de datos o ruta inválida.
409 Conflict	Duplicado (Mongoose 11000)	Intento de registrar un nombre ya existente en una entidad con campo único.