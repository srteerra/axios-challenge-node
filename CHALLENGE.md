# Reto técnico — Módulo "Equipos" (Teams)

¡Bienvenido/a! Este reto busca conocer cómo diseñas, implementas y **documentas** una funcionalidad nueva dentro de una base de código existente — y, muy importante para nosotros, **cómo aprovechas herramientas de IA** en tu flujo de trabajo.

No buscamos que reinventes el proyecto: buscamos ver criterio, calidad, consistencia con lo que ya existe y buena comunicación.

> ⏱️ **Alcance pensado para ~1 hora.** Es intencionalmente pequeño. Preferimos poco código bien hecho, consistente con lo existente y bien documentado, que una entrega grande y descuidada. Si algo te llevaría demasiado, **déjalo como "qué haría con más tiempo"** en el PR.

---

## Contexto

El repositorio ya trae un boilerplate **funcional**: autenticación por JWT y un módulo de **Favoritos** (CRUD) que consume la PokeAPI sobre SQLite. Úsalo como **referencia de estilo y arquitectura** (mira `backend/src/**/favorites*` y `frontend/src/pages/Favorites.tsx`).

## Lo que debes construir

Un módulo nuevo de **Equipos Pokémon (Teams)**, análogo a Favoritos pero con reglas de negocio propias. **No modifiques el módulo de Favoritos**; créalo en paralelo.

### Parte obligatoria — Backend `/api/teams` (esto es lo que evaluamos)

Un usuario autenticado puede administrar sus equipos. Un equipo tiene un **nombre** y una lista de **miembros** (pokémon).

Modelo sugerido (puedes ajustarlo y justificarlo):
- `Team`: `id`, `name`, `userId`
- `TeamMember`: `id`, `teamId`, `pokemonId`, `pokemonName`

Bastan **3 endpoints**:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/teams` | Lista los equipos del usuario (con sus miembros) |
| POST | `/api/teams` | Crea un equipo (`name` + arreglo de pokémon) |
| DELETE | `/api/teams/:id` | Elimina un equipo del usuario |

**Reglas de negocio obligatorias** (son el corazón del reto):

1. **Máximo 6 miembros** por equipo → si se excede, responde `422`.
2. **Validación contra la PokeAPI**: cada pokémon debe existir. **Reutiliza** el servicio `backend/src/services/pokeapi.service.js` (`assertSpeciesExists`); **no** reimplementes el consumo de la API. Si no existe → `422`.
3. **Ownership**: un usuario sólo ve/elimina **sus** equipos. Intentar borrar el de otro debe responder `404` (no `403`, para no filtrar existencia).

Usa los status HTTP adecuados y el manejo de errores existente (`HttpError`, `asyncHandler`).

### Test (obligatorio, sólo 1)

**Un** test (jest + supertest) siguiendo el estilo de `backend/src/tests/favorites.test.js`, que cubra **una** regla de negocio: la creación válida de un equipo **o** el rechazo del 7º miembro. Con eso basta.

### Bonus (opcional — sólo si te sobra tiempo)

No es obligatorio y no penaliza omitirlo. Si quieres mostrar más, elige lo que prefieras:
- Endpoints extra (`GET /api/teams/:id`, `PATCH /api/teams/:id`).
- Regla extra: **sin especies duplicadas** dentro de un equipo (`409`).
- Una **pantalla de Equipos** en el frontend (React + TS) siguiendo `frontend/src/pages/Favorites.tsx`, reutilizando `frontend/src/api/client.ts`.

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

**Criterios de aceptación mínimos**: el backend levanta, `npm test` pasa (incluyendo tu test), los 3 endpoints funcionan con sus reglas y `docs/AI_USAGE.md` está completo.

## Cómo te evaluamos

La rúbrica completa y transparente está en [`docs/EVALUATION.md`](./docs/EVALUATION.md).

## Tiempo estimado

Alrededor de **1 hora**. No hay reloj corriendo, pero el alcance está calibrado para eso: no sobre-inviertas. Si una idea te llevaría más, anótala en el PR como "qué haría con más tiempo" en vez de implementarla.

## Preguntas

Si algo del enunciado es ambiguo, **toma una decisión razonable y documéntala** en el PR. Saber decidir con información incompleta es parte de lo que evaluamos.

¡Mucho éxito! 🚀
