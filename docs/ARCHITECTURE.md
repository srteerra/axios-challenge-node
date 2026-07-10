# Arquitectura del boilerplate

Documento breve para que entiendas cómo está organizado el código antes de extenderlo.

## Backend — capas

El backend sigue una separación por responsabilidades. El flujo de una request es:

```
routes  →  middlewares (auth, validación)  →  controllers  →  services  →  models (Sequelize)
                                                     │
                                                     └→ services externos (pokeapi.service)
```

| Carpeta | Responsabilidad |
|---|---|
| `config/` | Carga de env (`env.js`) e inicialización de Sequelize/SQLite (`database.js`) |
| `models/` | Modelos Sequelize y asociaciones (`index.js` es el punto de registro) |
| `middlewares/` | `auth.middleware.js` (JWT) y `error.middleware.js` (manejo centralizado) |
| `services/` | Lógica de negocio y de integración (`auth.service.js`, `pokeapi.service.js`) |
| `controllers/` | Traducen HTTP ↔ servicios; delgados |
| `routes/` | Definición de rutas y a qué controlador van |
| `utils/` | `HttpError` (errores con status) y `asyncHandler` (propaga errores async) |
| `seeders/` | `seed.js` crea datos iniciales |
| `tests/` | Jest + Supertest, con la PokeAPI mockeada (`helpers.js`) |

### Decisiones clave

- **ESM** (`"type": "module"`): imports modernos.
- **SQLite** vía Sequelize con `sequelize.sync()` (sin migraciones, para simplicidad del reto). En producción usaríamos migraciones.
- **Manejo de errores centralizado**: los servicios lanzan `HttpError` (o Sequelize lanza sus errores) y `error.middleware.js` los traduce a JSON con el status correcto. **No hagas `try/catch` en cada controlador**; usa `asyncHandler` y lanza `HttpError`.
- **Ownership por diseño**: todas las queries de Favoritos filtran por `req.user.id`. Replica esto en Teams.
- **PokeAPI encapsulada**: todo el consumo vive en `pokeapi.service.js` con una caché en memoria simple. Reutilízalo.

## Flujo de autenticación

1. `POST /api/auth/register` o `/login` → `auth.service` valida, hashea con bcrypt y firma un JWT.
2. El cliente guarda el token y lo manda en `Authorization: Bearer <token>`.
3. `auth.middleware.js` verifica el token, carga el `User` y lo pone en `req.user`.
4. Las rutas de negocio (`/favorites`, y tu futuro `/teams`) exigen ese middleware.

## Frontend

Deliberadamente mínimo, **sin router** (ruteo por estado de sesión en `App.tsx`):

- `api/client.ts`: wrapper de `fetch` que adjunta el JWT y normaliza errores.
- `context/AuthContext.tsx`: estado de sesión (token en `localStorage`).
- `pages/Login.tsx`: formulario de login.
- `pages/Favorites.tsx`: pantalla de referencia (lista PokeAPI + CRUD de favoritos).

Vite hace proxy de `/api` → `http://localhost:4000` (ver `vite.config.ts`).

## Dónde engancha tu módulo Teams

- Modelos: `backend/src/models/` + registrar asociaciones en `models/index.js`.
- Rutas: crear `routes/teams.routes.js` y montarlo en `routes/index.js` (hay un comentario marcando el lugar).
- Controlador/servicio: siguiendo el patrón de `favorites`.
- Frontend: nueva página análoga a `Favorites.tsx`.
