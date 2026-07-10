# Entrega — Módulo Teams

## Resumen
_¿Qué construiste? Breve descripción del módulo Teams._

## Decisiones de diseño
_Modelo de datos, cómo implementaste las reglas de negocio, trade-offs, supuestos que tomaste ante ambigüedades._

-

## Cómo probarlo
_Pasos para levantar y ejercitar tu módulo (endpoints, credenciales, etc.)._

```bash
# ejemplo
cd backend && npm install && npm run seed && npm run dev
```

## Checklist (obligatorio)

- [ ] El backend levanta sin errores (`npm run dev`)
- [ ] `npm test` pasa (incluye mi test del módulo Teams)
- [ ] `GET` / `POST` / `DELETE /api/teams` funcionan end-to-end
- [ ] Regla: máximo 6 miembros por equipo (422)
- [ ] Regla: validación de especies contra la PokeAPI reutilizando el servicio (422)
- [ ] Regla: ownership (un usuario sólo accede a sus equipos → 404 si no es suyo)
- [ ] No modifiqué el módulo de Favoritos
- [ ] **`docs/AI_USAGE.md` completo** ⭐
- [ ] Commits con Conventional Commits

## Bonus (opcional — marca lo que hayas hecho)

- [ ] Endpoints extra (`GET /api/teams/:id`, `PATCH /api/teams/:id`)
- [ ] Regla: sin especies duplicadas en un equipo (409)
- [ ] Pantalla de Equipos en el frontend

## Notas / qué haría con más tiempo
-
