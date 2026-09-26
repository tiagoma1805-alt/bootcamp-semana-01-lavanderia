# 🧺 API de Lavandería y Tintorería - Semana 04

## 📋 Dominio Asignado
* **Dominio:** Lavandería / Tintorería
* **Recurso Principal:** `Service` (`/api/v1/services`)

---

## 🛠️ Campos del Schema y Validaciones (Zod)

| Campo | Tipo | Validación | Descripción |
|---|---|---|---|
| `name` | String | Requerido, mín. 2 caracteres, trim | Nombre del servicio (ej. "Lavado en seco saco") |
| `category` | Enum | `'lavado' \| 'seco' \| 'planchado' \| 'tintoreria'` | Tipo de servicio ofrecido |
| `price` | Number | Requerido, número positivo > 0 | Precio del servicio |
| `estimatedHours` | Number | Entero positivo, por defecto `24` | Tiempo estimado de entrega en horas |
| `available` | Boolean | Booleano, por defecto `true` | Estado de disponibilidad del servicio |

---

## 🚀 Cómo Ejecutar el Proyecto

1. **Instalar dependencias:**
   ```bash
   pnpm install