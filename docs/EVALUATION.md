# Rúbrica de evaluación

Rúbrica transparente: así revisamos tu entrega. Total 100 puntos. El alcance está calibrado para **~1 hora**, así que la rúbrica premia lo esencial bien hecho.

| # | Dimensión | Peso | Qué miramos |
|---|---|---:|---|
| 1 | **Correctitud del endpoint** | 30 | Los 3 endpoints (`GET`/`POST`/`DELETE /api/teams`) funcionan end-to-end con los status HTTP adecuados. |
| 2 | **Reglas de negocio** | 25 | Máx. 6 miembros (422), validación contra PokeAPI **reutilizando** el servicio (422), ownership (404 al tocar equipos ajenos). |
| 3 | **Calidad y consistencia del código** | 20 | Sigue el patrón existente (capas, `HttpError`, `asyncHandler`, scoping por `req.user.id`); legible; sin duplicar lógica ya disponible. |
| 4 | **Documentación de uso de IA** | 15 | `docs/AI_USAGE.md` completo y honesto; se nota criterio al aceptar/rechazar/corregir output de IA. |
| 5 | **Test** | 10 | Al menos 1 test que pasa y cubre creación válida o el rechazo de una regla. |

## Señales que suman (bonus, sin exceder 100)

- Elementos de la sección **Bonus** del reto: endpoints extra, regla de "sin duplicados" (409), o la pantalla de Equipos en el frontend.
- Manejo cuidado de errores y mensajes claros.
- Notar y respetar el rate-limit / caché de la PokeAPI.
- Buenos mensajes de commit (Conventional Commits) e historial limpio.
- Un PR bien redactado que explica decisiones y trade-offs.
- Validación de entradas robusta.

## Señales que restan

- Modificar el módulo de Favoritos para "hacer encajar" Teams.
- Reimplementar el consumo de PokeAPI en vez de reutilizar el servicio.
- Copy-paste de IA sin entender el código (se nota en la entrevista de seguimiento).
- Sobre-ingeniería no justificada para el alcance del reto.
- Romper el arranque del proyecto o dejar los tests en rojo.

## Nota sobre la entrevista de seguimiento

Tras revisar el código, en la entrevista te pediremos **explicar tus decisiones** y quizá **modificar algo en vivo**. El objetivo es confirmar que entiendes lo que entregaste — incluido lo que generaste con ayuda de IA.
