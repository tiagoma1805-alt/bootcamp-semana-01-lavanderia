🧺 Proyecto Semana 04: API de Lavandería y Tintorería📌 Descripción del ProyectoEste repositorio contiene la implementación de una API RESTful profesional desarrollada con Express y TypeScript para la gestión de servicios de lavandería y tintorería.El proyecto aplica la arquitectura en capas (Rutas $\rightarrow$ Controladores $\rightarrow$ Servicios $\rightarrow$ Repositorios) e integra Zod para validación de datos sintácticos y semánticos, manejo estructurado de errores con la clase personalizada AppError, y logging profesional centralizado mediante Winston y Morgan.📋 Dominio AsignadoDominio: Lavandería / TintoreríaRecurso Principal: Garment (Prenda recepcionada para servicio)Base URL: /api/v1/garments🛠️ Campos del Schema y Validaciones (Zod)El recurso principal representa una prenda ingresada por un cliente al establecimiento para recibir uno o varios procesos de cuidado de textil.Estructura del Objeto (Garment)CampoTipoValidacionesDescripciónidnumberAutogenerado, entero positivoIdentificador único de la prenda/servicio.clientNamestring.min(2).max(100).trim()Nombre completo del cliente que entrega la prenda.garmentTypestring.min(2).max(50).trim()Tipo de prenda (ej: "Camisa", "Traje 2 Piezas", "Vestido de Gala", "Edredón").serviceTypeenum'lavado', 'planchado', 'lavado_planchado', 'tintoreria', 'tintura'Tipo de servicio contratado para la prenda.pricenumber.positive('El precio debe ser mayor a 0')Precio asignado al servicio.notesstring (opcional).max(250).trim().optional()Observaciones particulares (ej: "Mancha de café en puño derecho", "Seda delicada").statusenum (opcional)'recibido', 'en_proceso', 'listo', 'entregado' (default: 'recibido')Estado actual del proceso de la prenda.Schemas Zod (src/schemas/garment.schema.ts)createGarmentSchema: Schema de creación con todas las validaciones estrictas y mensajes en español.updateGarmentSchema: Reutiliza createGarmentSchema.partial() para permitir modificaciones parciales (método PUT).garmentIdParamSchema: Valida que los parámetros de ruta :id correspondan a un entero positivo utilizando z.coerce.number().int().positive().📊 Endpoints de la APIMétodoRutaDescripciónParámetros Query / BodyGET/api/v1/garmentsObtener lista paginada de prendasQuery params: page (def: 1), limit (def: 10)GET/api/v1/garments/:idObtener detalle de una prenda específicaPath param: :idPOST/api/v1/garmentsRegistrar una nueva prenda y servicioBody: JSON estructurado según createGarmentSchemaPUT/api/v1/garments/:idActualizar datos de una prenda existenteBody: JSON con campos opcionales (updateGarmentSchema)DELETE/api/v1/garments/:idEliminar registro de prenda por IDPath param: :id🏗️ Estructura de Capas y Archivossrc/
├── config/
│   └── logger.ts            # Configuración de Winston (formato JSON/colores, streams) + Morgan
├── errors/
│   └── AppError.ts          # Clase de error operacional personalizada
├── middlewares/
│   ├── errorHandler.ts      # Middleware global de error (4 parámetros)
│   └── notFound.ts          # Middleware para capturar rutas inexistentes (404 JSON)
├── schemas/
│   └── garment.schema.ts    # Schemas de validación con Zod e inferencia de tipos
├── repositories/
│   └── garment.repository.ts # Almacenamiento en memoria para operaciones CRUD
├── services/
│   └── garment.service.ts   # Lógica de negocio y lanzamiento de AppError
├── controllers/
│   └── garment.controller.ts # Controlador delgado que deriva errores mediante next(err)
├── routes/
│   └── garment.routes.ts    # Mapeo de rutas hacia los controladores
├── types.ts                 # Interfaces TypeScript para Garment y respuestas paginadas
├── app.ts                   # Ensamblaje de Express, middlewares y rutas
└── server.ts                # Bootstrap de la aplicación e inicialización del servidor
🚀 Cómo Ejecutar el Proyecto1. Instalación de dependenciasAsegúrate de tener pnpm instalado y ejecuta:pnpm install
2. Modo DesarrolloInicia el servidor con recarga automática (watch mode) y logs colorizados en consola:pnpm dev
El servidor se iniciará en http://localhost:3000.3. Modo ProducciónPara compilar a JavaScript y ejecutar con logging en formato JSON y persistencia en archivo de logs:pnpm build
pnpm start
🧪 Casos de Prueba y Demostración de RequisitosA continuación se detallan las respuestas generadas por la API ante los casos solicitados en los requerimientos del proyecto:1. POST /api/v1/garments con body inválido (HTTP 400)Body enviado:{
  "clientName": "A",
  "garmentType": "Camisa",
  "serviceType": "lavado_express",
  "price": -10
}
Respuesta JSON:{
  "status": "fail",
  "message": "Error de validación de datos",
  "issues": [
    {
      "field": "clientName",
      "message": "El nombre del cliente debe tener al menos 2 caracteres"
    },
    {
      "field": "serviceType",
      "message": "Tipo de servicio no válido"
    },
    {
      "field": "price",
      "message": "El precio debe ser mayor a 0"
    }
  ]
}
2. GET /api/v1/garments/abc con ID no numérico (HTTP 400)Respuesta JSON:{
  "status": "fail",
  "message": "Error de validación de datos",
  "issues": [
    {
      "field": "id",
      "message": "Expected number, received nan"
    }
  ]
}
3. GET /api/v1/garments/999 con ID inexistente (HTTP 404)Respuesta JSON:{
  "status": "fail",
  "message": "La prenda con ID 999 no fue encontrada"
}
4. GET /api/v1/ruta-inexistente (HTTP 404 JSON)Respuesta JSON:{
  "status": "fail",
  "message": "Ruta GET /api/v1/ruta-inexistente no encontrada"
}
5. Logging del SistemaEn entorno development, los logs en consola utilizan colores indicando el nivel de severidad y el método HTTP.En entorno production, se registra un log de nivel warn cuando ocurre un error de tipo AppError, y los errores no controlados se escriben en el archivo logs/error.log en formato JSON estructurado.
