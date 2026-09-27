# 🚀 Proyecto Semana 08: API Segura con RBAC y Capas de Seguridad — Lavandería / Tintorería

API RESTful profesional para la gestión de servicios en **Lavandería / Tintorería**, reforzada con Control de Acceso Basado en Roles (**RBAC**) y múltiples capas de seguridad HTTP (Helmet, CORS con Whitelist, Rate Limiting diferenciado y sanitización contra NoSQL Injection).

---

## 📋 Dominio y Recurso Principal

* **Dominio Asignado:** Lavandería / Tintorería
* **Recurso Principal:** `Garment` (Prenda / Servicio de Lavandería)
* **Campo Único:** `tagCode` (Código de etiqueta o marcado de lavandería, ej: `LAV-2026-9081`)

### Entidad `Garment` (Prenda)

| Campo | Tipo | Requerido | Descripción | Validaciones |
| :--- | :--- | :---: | :--- | :--- |
| `tagCode` | `String` | Sí | Código único impreso en la etiqueta de la prenda | Formato regex: `/^LAV-\d{4}-\d{4}$/`, único |
| `clientName` | `String` | Sí | Nombre del cliente propietario de la prenda | Mín. 2 caracteres, trim |
| `garmentType` | `String` | Sí | Tipo de prenda (ej: Traje 2p, Vestido de Noche, Edredón) | Enum: `'Traje'`, `'Vestido'`, `'Camisa'`, `'Pantalón'`, `'Edredón'`, `'Otros'` |
| `serviceType` | `String` | Sí | Servicio requerido | Enum: `'Lavado en Seco'`, `'Lavado al Agua'`, `'Planchado'`, `'Tintorería Special'` |
| `price` | `Number` | Sí | Costo del servicio en moneda local | Positivo (> 0) |
| `status` | `String` | Sí | Estado del proceso de lavandería | Enum: `'Recibido'`, `'En Lavado'`, `'Planchado'`, `'Listo para Entrega'`, `'Entregado'` |
| `registeredBy` | `ObjectId` | Sí | Referencia al usuario (Empleado/Admin) que registró el ingreso | Mongoose Ref -> `User` |

---

## 🔐 Matriz de Roles y Permisos (RBAC)

La API cuenta con dos roles definidos:
1. **`user`** (Operador / Empleado de recepción)
2. **`admin`** (Gerente / Administrador general de la lavandería)

| Acción | Endpoint | Método | Acceso Requerido | Descripción / Regla RBAC |
| :--- | :--- | :---: | :---: | :--- |
| Registrar Usuario | `/api/v1/auth/register` | `POST` | Público | Registro de nuevos usuarios/operadores |
| Iniciar Sesión | `/api/v1/auth/login` | `POST` | Público | Autenticación y generación de tokens JWT en cookies HttpOnly |
| Refrescar Token | `/api/v1/auth/refresh` | `POST` | Público | Rotación de tokens usando Refresh Token |
| Listar Prendas | `/api/v1/garments` | `GET` | `user` / `admin` | Consulta catálogo/registro de prendas ingresadas |
| Obtener Prenda | `/api/v1/garments/:id` | `GET` | `user` / `admin` | Obtiene el detalle de una prenda específica |
| Registrar Prenda | `/api/v1/garments` | `POST` | `user` / `admin` | Crea un nuevo registro de lavandería asignado al creador |
| Actualizar Prenda | `/api/v1/garments/:id` | `PATCH` | `user` (dueño) / `admin` | Actualiza estado o datos. Los usuarios estándar solo actualizan prendas que ellos registraron; los administradores actualizan cualquiera |
| Eliminar Prenda | `/api/v1/garments/:id` | `DELETE` | `admin` | **Exclusivo Admin:** Elimina un registro del sistema |

---

## 🛡️ Capas de Seguridad Implementadas

### 1. Helmet (Security HTTP Headers)
Protege la aplicación de vulnerabilidades web conocidas configurando encabezados HTTP seguros.
* **Headers Activos:**
  * `X-Content-Type-Options: nosniff` (previene sniffing de MIME types)
  * `X-Frame-Options: DENY` (protege contra Clickjacking)
  * `Strict-Transport-Security` (fuerza uso de HTTPS en producción)
  * `X-XSS-Protection: 0` (desactiva el filtro legacy para evitar ataques de canal lateral)

### 2. CORS con Whitelist
Control de acceso de origen cruzado configurado estrictamente.
* Se restringe el acceso a orígenes explícitos listados en la variable de entorno `ALLOWED_ORIGINS`.
* Bloquea solicitudes provenientes de dominios no autorizados con un mensaje explícito `CORS Policy Error`.

### 3. Rate Limiting Diferenciado
Prevención de ataques de Fuerza Bruta y Denegación de Servicio (DoS).
* **Limitador Estricto (`authLimiter`):**
  * Aplicado a `/api/v1/auth/login` y `/api/v1/auth/register`.
  * Máximo **5 peticiones** por ventana de **15 minutos**. Responde con estado `429 Too Many Requests`.
* **Limitador General (`apiLimiter`):**
  * Aplicado a las rutas de recursos `/api/v1/garments`.
  * Máximo **100 peticiones** por ventana de **15 minutos**.

### 4. Sanitización contra NoSQL Injection
* Los parámetros de consulta (`req.query`), cuerpo (`req.body`) y parámetros de ruta (`req.params`) son sanitizados usando middleware especializado (`express-mongo-sanitize`).
* Elimina operadores prohibidos como `$` (ej. `{$gt: ""}`) impidiendo la manipulación maliciosa de consultas de Mongoose.

---

## 🛠️ Estructura de Proyecto

```text
src/
├── config/
│   ├── db.ts               # Conexión a MongoDB con Mongoose
│   ├── logger.ts           # Logger profesional Winston + Morgan
│   └── security.ts         # Configuración de Helmet, CORS y Rate Limiters
├── errors/
│   └── AppError.ts         # Clase personalizada para manejo de errores
├── middlewares/
│   ├── auth.middleware.ts  # Middleware de autenticación JWT (Bearer / Cookie)
│   ├── role.middleware.ts  # RBAC: requireRole('admin', 'user')
│   ├── errorHandler.ts    # Middleware global para captura de errores
│   └── notFound.ts        # Manejo de rutas no encontradas (404 JSON)
├── models/
│   ├── user.model.ts       # Modelo Mongoose de Usuario con enum ['user', 'admin']
│   └── garment.model.ts    # Modelo Mongoose para prendas de lavandería
├── schemas/
│   ├── auth.schema.ts      # Esquemas de validación Zod para registro y login
│   └── garment.schema.ts   # Esquemas Zod para createGarmentSchema y updateGarmentSchema
├── repositories/
│   ├── user.repository.ts  # Consultas de BD para usuarios
│   └── garment.repository.ts # Consultas Mongoose para prendas
├── services/
│   ├── auth.service.ts     # Lógica de negocio para autenticación
│   └── garment.service.ts  # Lógica de negocio con verificación de autoría y RBAC
├── controllers/
│   ├── auth.controller.ts  # Controladores HTTP de autenticación
│   └── garment.controller.ts # Controladores HTTP para prendas (getGarments, createGarment, etc.)
├── routes/
│   ├── auth.routes.ts      # Rutas de autenticación con rate limiter estricto
│   └── garment.routes.ts   # Rutas CRUD del recurso protegidas con authMiddleware + requireRole
├── app.ts                 # Ensamble de Middlewares de seguridad y routers
└── server.ts              # Inicio del servidor e inicialización de BD
