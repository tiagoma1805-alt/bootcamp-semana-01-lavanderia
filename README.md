🧺 Proyecto Semana 07: API de Lavandería y Tintorería con Autenticación JWT📌 Descripción del ProyectoEste proyecto consiste en la implementación de una API RESTful profesional con Express, TypeScript y MongoDB (Mongoose), con un sistema completo de Autenticación y Autorización basada en JWT con Cookies HttpOnly.Aplica la arquitectura en capas (Rutas $\rightarrow$ Controladores $\rightarrow$ Servicios $\rightarrow$ Repositorios) y protege el ciclo CRUD completo del recurso principal de lavandería mediante middleware de autenticación, rotación de refresh tokens e intercepción de sesiones.📋 Dominio AsignadoDominio: Lavandería / TintoreríaRecurso Principal: Garment (Prenda recepcionada para servicio)Base URL Auth: /api/v1/authBase URL Recurso: /api/v1/garments🔐 Requisitos y Criterios de SeguridadCriterioDescripciónImplementaciónContraseñas Hasheadasbcrypt con 10 salt roundsLas contraseñas nunca se almacenan en texto plano.Secretos JWT IndependientesJWT_ACCESS_SECRET $\neq$ JWT_REFRESH_SECRETSecretos generados de manera criptográfica mediante openssl.Tokens en Cookies HttpOnlyProtección contra XSSTokens enviados exclusivamente en cookies HttpOnly y SameSite=Strict.Refresh Token Hasheado en DBHash en MongoDBLa base de datos guarda únicamente el hash bcrypt del refresh token actual.Rotación de Refresh TokensReutilización / ExpiraciónCada consumo de /refresh invalida el token previo y emite uno nuevo.Rutas ProtegidasMiddleware authMiddlewareTodas las rutas /api/v1/garments requieren sesión activa.🛠️ Campos del Recurso Garment (src/models/garment.model.ts)Cada prenda registrada en el sistema está vinculada directamente al usuario que atendió la recepción:interface IGarment {
  _id?: mongoose.Types.ObjectId;
  clientName: string;                     // Nombre del cliente
  garmentType: string;                    // Ej: "Traje 2 piezas", "Camisa", "Vestido"
  serviceType: 'lavado' | 'planchado' | 'lavado_planchado' | 'tintoreria' | 'tintura';
  price: number;                          // Precio del servicio
  notes?: string;                         // Observaciones (ej: "Mancha de vino")
  status: 'recibido' | 'en_proceso' | 'listo' | 'entregado';
  registeredBy: mongoose.Types.ObjectId; // Referencia al User autenticado
  createdAt?: Date;
  updatedAt?: Date;
}
📊 Endpoints de la API🔑 Módulo de Autenticación (/api/v1/auth)MétodoRutaDescripciónEstado HTTPAccesoPOST/api/v1/auth/registerRegistro de usuario201 CreatedPúblicoPOST/api/v1/auth/loginInicio de sesión (asigna cookies access_token y refresh_token)200 OKPúblicoGET/api/v1/auth/meObtener datos del usuario autenticado200 OKPrivado (authMiddleware)POST/api/v1/auth/refreshRenovar access_token aplicando rotación de refresh token200 OKPúblico (requiere cookie)POST/api/v1/auth/logoutInvalida el refresh token en DB y remueve cookies200 OKPrivado (authMiddleware)🧺 Módulo de Prendas (/api/v1/garments) — Todas las rutas son protegidasMétodoRutaDescripciónBody / ParamsEstado HTTPGET/api/v1/garmentsListar todas las prendas registradasQuery params opcionales200 OKGET/api/v1/garments/:idObtener prenda por ID de MongoDB (ObjectId)Path param :id200 OK / 404POST/api/v1/garmentsRegistrar nueva prendaBody JSON (createGarmentSchema)201 CreatedPATCH/api/v1/garments/:idActualización parcial de prendaBody JSON (updateGarmentSchema)200 OKDELETE/api/v1/garments/:idEliminar registro de prendaPath param :id204 No Content🏗️ Estructura del Proyectosrc/
├── app.ts                          # Ensamblaje de Express, CORS, CookieParser y Routers
├── server.ts                       # Conexión a MongoDB e inicio del servidor HTTP
├── lib/
│   └── mongoose.ts                 # Conexión/Desconexión con MongoDB
├── errors/
│   └── AppError.ts                 # Manejo centralizado de errores operacionales
├── types/
│   └── express.d.ts                # Extensión global de Request para incluir req.user
├── utils/
│   └── jwt.ts                      # Generación y verificación de Access & Refresh Tokens
├── middlewares/
│   ├── auth.middleware.ts          # Verificación de JWT en cookies HttpOnly
│   ├── errorHandler.ts            # Middleware global de captura de errores
│   └── notFound.ts                # Captura de rutas inexistentes (404 JSON)
├── schemas/
│   ├── auth.schema.ts             # Zod Schemas para register/login
│   └── garment.schema.ts          # Zod Schemas para create/update Garment
├── models/
│   ├── user.model.ts              # Modelo de Mongoose para Usuarios
│   └── garment.model.ts           # Modelo de Mongoose para Prendas
├── repositories/
│   ├── users.repository.ts        # Consultas de BD para usuarios
│   └── garment.repository.ts      # Consultas de BD para prendas
├── services/
│   ├── auth.service.ts            # Lógica de registro, login, refresh tokens y bcrypt
│   └── garment.service.ts         # Lógica de negocio de la lavandería
├── controllers/
│   ├── auth.controller.ts         # Manejo de peticiones e inyección de cookies de Auth
│   └── garment.controller.ts      # Manejo de peticiones CRUD de prendas
└── routes/
    ├── auth.routes.ts             # Definición de rutas públicas y privadas de Auth
    └── garment.routes.ts          # Definición de rutas CRUD protegidas
🚀 Guía de Instalación y Ejecución1. Clonar e Instalar Dependenciaspnpm install
2. Configurar Variables de Entorno (.env)Crea un archivo .env en la raíz del proyecto basándote en .env.example:PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://root:example@localhost:27017/laundry_db?authSource=admin

# Generar secretos seguros con: openssl rand -base64 64
JWT_ACCESS_SECRET=tu_clave_secreta_de_acceso_super_segura
JWT_REFRESH_SECRET=tu_clave_secreta_de_refresco_super_segura
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
3. Iniciar la Base de Datos con Dockerdocker compose up -d
4. Ejecutar la AplicaciónModo desarrollo con recarga automática (watch mode):pnpm dev
🧪 Flujo de Pruebas en Thunder Client / PostmanRegistro de Usuario (POST /api/v1/auth/register)Enviar email y password.Verificar respuesta 201 Created.Inicio de Sesión (POST /api/v1/auth/login)Enviar credenciales válidas.Verificar que la respuesta incluya las cookies access_token y refresh_token marcadas como HttpOnly.Intento de Acceso sin Autenticación (GET /api/v1/garments)Eliminar o desactivar cookies.Verificar que la API retorne 401 Unauthorized con el mensaje "No autenticado".Operaciones CRUD Protegidas con Cookie ActivaCrear Prenda (POST /api/v1/garments):{
  "clientName": "María López",
  "garmentType": "Traje 2 piezas",
  "serviceType": "tintoreria",
  "price": 45.00,
  "notes": "Tratamiento especial en solapa"
}
Verificar respuesta 201 Created con la propiedad registeredBy vinculada al ID del usuario.Listar Prendas (GET /api/v1/garments): Retorna array de prendas en formato JSON.Actualización Parcial (PATCH /api/v1/garments/:id): Actualizar status a "listo".Eliminar Prenda (DELETE /api/v1/garments/:id): Retorna 204 No Content.Renovación de Token (POST /api/v1/auth/refresh)Simular expiración del access_token.Invocar /refresh para rotar el refresh_token y recibir nuevas cookies HttpOnly.Cierre de Sesión (POST /api/v1/auth/logout)Invocar endpoint de logout.Confirmar que la cookie de refresh token se elimina y el hash en la BD queda invalidado (null).Un intento posterior a /refresh debe retornar 401 Unauthorized.
