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

## Checklist

- [ ] El backend levanta sin errores (`npm run dev`)
- [ ] `npm test` pasa (incluye mis tests del módulo Teams)
- [ ] CRUD de `/api/teams` funciona end-to-end
- [ ] Regla: máximo 6 miembros por equipo
- [ ] Regla: sin especies duplicadas en un equipo
- [ ] Regla: validación de especies contra la PokeAPI (reutilizando el servicio)
- [ ] Regla: ownership (un usuario sólo accede a sus equipos → 404 si no es suyo)
- [ ] No modifiqué el módulo de Favoritos
- [ ] Pantalla de Teams en el frontend funcional
- [ ] **`docs/AI_USAGE.md` completo** ⭐
- [ ] Commits con Conventional Commits

## Notas / qué haría con más tiempo
-
