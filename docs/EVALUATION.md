# Rúbrica de evaluación

Rúbrica transparente: así revisamos tu entrega. Total 100 puntos.

| # | Dimensión | Peso | Qué miramos |
|---|---|---:|---|
| 1 | **Correctitud del CRUD** | 25 | Los 5 endpoints funcionan; los status HTTP son los adecuados; el CRUD opera end-to-end. |
| 2 | **Reglas de negocio** | 20 | Máx. 6 miembros, sin especies duplicadas, validación contra PokeAPI reutilizando el servicio, ownership (404 al tocar equipos ajenos). |
| 3 | **Calidad y consistencia del código** | 20 | Sigue el patrón existente (capas, `HttpError`, `asyncHandler`, ownership scoping); legible; sin duplicar lógica ya disponible. |
| 4 | **Documentación de uso de IA** | 15 | `docs/AI_USAGE.md` completo y honesto; se nota criterio al aceptar/rechazar/corregir output de IA. |
| 5 | **Tests** | 10 | Al menos 1–2 tests significativos que pasan; cubren al menos una regla de negocio. |
| 6 | **Frontend** | 10 | Pantalla de Teams funcional y legible que consume la API; reutiliza el cliente existente. |

## Señales que suman (bonus, sin exceder 100)

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
