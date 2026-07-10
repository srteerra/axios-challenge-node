# Reto técnico — Módulo "Equipos" (Teams)

¡Bienvenido/a! Este reto busca conocer cómo diseñas, implementas y **documentas** una funcionalidad nueva dentro de una base de código existente — y, muy importante para nosotros, **cómo aprovechas herramientas de IA** en tu flujo de trabajo.

No buscamos que reinventes el proyecto: buscamos ver criterio, calidad, consistencia con lo que ya existe y buena comunicación.

---

## Contexto

El repositorio ya trae un boilerplate **funcional**: autenticación por JWT y un módulo de **Favoritos** (CRUD) que consume la PokeAPI sobre SQLite. Úsalo como **referencia de estilo y arquitectura** (mira `backend/src/**/favorites*` y `frontend/src/pages/Favorites.tsx`).

## Lo que debes construir

Un módulo nuevo de **Equipos Pokémon (Teams)**, análogo a Favoritos pero con reglas de negocio propias. **No modifiques el módulo de Favoritos**; créalo en paralelo.

### Backend — CRUD HTTP bajo `/api/teams`

Un usuario autenticado puede administrar sus equipos. Un equipo tiene un **nombre** y una lista de **miembros** (pokémon).

Modelo sugerido (puedes ajustarlo y justificarlo):
- `Team`: `id`, `name`, `userId`
- `TeamMember`: `id`, `teamId`, `pokemonId`, `pokemonName`, `slot` (1–6)

Endpoints mínimos:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/teams` | Lista los equipos del usuario (con sus miembros) |
| GET | `/api/teams/:id` | Detalle de un equipo |
| POST | `/api/teams` | Crea un equipo (nombre + miembros iniciales opcionales) |
| PATCH | `/api/teams/:id` | Renombra el equipo y/o actualiza sus miembros |
| DELETE | `/api/teams/:id` | Elimina el equipo |

### Reglas de negocio (parte central del reto)

1. **Máximo 6 miembros** por equipo (como en los juegos de Pokémon).
2. **Sin especies duplicadas** dentro de un mismo equipo.
3. **Validación contra la PokeAPI**: cada pokémon agregado debe existir. **Reutiliza** el servicio existente `backend/src/services/pokeapi.service.js` (`assertSpeciesExists`), no reimplementes el consumo de la API.
4. **Ownership**: un usuario sólo puede ver/editar/eliminar **sus** equipos. Intentar tocar el equipo de otro debe responder `404` (no `403`, para no filtrar existencia).
5. Errores con el **status HTTP correcto** (400/401/404/409/422 según corresponda), consistente con el manejo de errores actual (`HttpError`).

### Frontend — una pantalla de Equipos

Con React + TypeScript (mira `frontend/src/pages/Favorites.tsx` como patrón):
- Listar los equipos del usuario y sus miembros.
- Crear un equipo y agregarle pokémon.
- Eliminar un equipo.

No necesita ser bonito; necesita **funcionar y ser legible**. Puedes reutilizar el cliente `frontend/src/api/client.ts`.

### Tests

Al menos **1–2 tests** del módulo (jest + supertest), siguiendo el estilo de `backend/src/tests/favorites.test.js`. Como mínimo cubre: creación válida, y el rechazo de una regla de negocio (p. ej. el 7º miembro, o especie duplicada).

---

## Uso de IA (requisito obligatorio)

Queremos que **uses herramientas de IA** (Claude, ChatGPT, Copilot, Cursor, etc.) — es parte del trabajo real en el equipo. Lo que evaluamos no es "si" las usas, sino **qué tan bien las diriges y validas**.

Completa la plantilla [`docs/AI_USAGE.md`](./docs/AI_USAGE.md) documentando:
- Qué herramienta(s) usaste.
- Prompts clave (los que más movieron la aguja).
- Qué output **aceptaste, rechazaste o corregiste**, y **por qué**.
- Decisiones de diseño que tomaste tú (no la IA).

Un uso de IA honesto y bien razonado suma; un copy-paste sin criterio resta.

---

## Cómo entregar

1. Usa este repositorio como plantilla ("Use this template") o haz un fork.
2. Trabaja en una rama `feat/teams-module`.
3. Commits con [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `test:`, `docs:`…).
4. Abre un **Pull Request** hacia `main` de tu repo, llenando la plantilla de PR.
5. Comparte el enlace del PR con quien te contactó.

**Criterios de aceptación mínimos**: el backend levanta, `npm test` pasa (incluyendo tus tests), el CRUD funciona end-to-end y `docs/AI_USAGE.md` está completo.

## Cómo te evaluamos

La rúbrica completa y transparente está en [`docs/EVALUATION.md`](./docs/EVALUATION.md).

## Tiempo estimado

Alrededor de **4–6 horas**. No hay reloj corriendo, pero valoramos entregas enfocadas. Si algo te toma demasiado, documenta el trade-off en el PR en lugar de sobre-ingenierizar.

## Preguntas

Si algo del enunciado es ambiguo, **toma una decisión razonable y documéntala** en el PR. Saber decidir con información incompleta es parte de lo que evaluamos.

¡Mucho éxito! 🚀
