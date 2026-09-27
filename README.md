# Semana 09: Pruebas Unitarias y de Integración — API REST Lavandería

Este proyecto corresponde al desarrollo e implementación de la suite completa de pruebas unitarias y de integración HTTP para la API REST de Lavandería. Se implementó **Jest**, **Supertest** y **MongoDB Memory Server** para garantizar la fiabilidad, estabilidad y correcto funcionamiento del sistema sin depender de una base de datos física durante los tests.

---

## 🚀 Características Principales

* **Pruebas Unitarias:** Cobertura completa de la lógica de negocio en servicios (`AuthService`, `GarmentsService`) y capa de persistencia (`UsersRepository`, `GarmentsRepository`).
* **Pruebas de Integración HTTP:** Validación del ciclo completo Request/Response en controladores y rutas (`/api/v1/auth`, `/api/v1/garments`) mediante **Supertest**.
* **Base de Datos en Memoria:** Aislamiento total de entornos de prueba utilizando **MongoDB Memory Server** (`mongodb-memory-server`), garantizando limpiezas de colecciones en cada ciclo de test (`afterEach` / `afterAll`).
* **Cobertura de Código Total:** Cumplimiento de métricas de calidad superiores al target mínimo ($80\%$), logrando un **$100\%$ de cobertura global** en Declaraciones, Funciones y Líneas.
* **Manejo de Errores y Validaciones:** Verificación de respuestas $401$ (No autorizado), $404$ (No encontrado), $409$ (Conflicto) y $422$ (Errores de validación de Zod).

---

## 📊 Métricas de Cobertura (Coverage Report)

| Categoría | Cobertura Lograda | Estado |
| :--- | :---: | :---: |
| **Statements (Declaraciones)** | **100%** | 🟢 Excelente |
| **Branches (Ramas)** | **93.75%** | 🟢 Excelente |
| **Functions (Funciones)** | **100%** | 🟢 Excelente |
| **Lines (Líneas)** | **100%** | 🟢 Excelente |
| **Test Suites** | **4 / 4 Pasadas** | 🟢 $100\%$ |
| **Pruebas Totales** | **34 / 34 Aprobadas** | 🟢 $100\%$ |

---

## 🛠️ Tecnologías y Herramientas

* **Lenguaje:** TypeScript / Node.js
* **Framework Web:** Express.js
* **Base de Datos:** MongoDB & Mongoose
* **Gestión de Sesión:** JWT (JSON Web Tokens) & Bcrypt
* **Validaciones:** Zod
* **Testing Suite:** Jest, Supertest & ts-node
* **Entorno de Datos para Test:** MongoDB Memory Server

---

## 📁 Estructura del Proyecto

```text
proyecto-semana09-lavanderia/
├── coverage/                   # Reporte HTML generado por Jest
│   └── lcov-report/
│       └── index.html
├── src/
│   ├── __tests__/              # Suite de pruebas automatizadas
│   │   ├── auth.routes.test.ts
│   │   ├── auth.service.test.ts
│   │   ├── garments.routes.test.ts
│   │   └── garments.service.test.ts
│   ├── config/                 # Configuración de variables de entorno
│   ├── controllers/            # Controladores HTTP (Auth y Prendas)
│   ├── errors/                 # Clase personalizada AppError
│   ├── middlewares/            # Auth JWT y Error Handler Global
│   ├── models/                 # Modelos Mongoose (User, Garment)
│   ├── repositories/           # Capa de Acceso a Datos
│   ├── routes/                 # Enrutadores Express
│   ├── services/               # Lógica de Negocio
│   ├── utils/                  # Generación y verificación de JWT
│   ├── validators/             # Esquemas de validación Zod
│   └── app.ts                  # Configuración principal de la aplicación
├── .env.test                   # Variables de entorno para pruebas
├── jest.config.ts              # Configuración global de Jest
├── package.json
└── tsconfig.json
