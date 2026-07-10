import { Router } from 'express';
import authRoutes from './auth.routes.js';
import pokemonRoutes from './pokemon.routes.js';
import favoritesRoutes from './favorites.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/pokemon', pokemonRoutes);
router.use('/favorites', favoritesRoutes);

// NOTA PARA EL CANDIDATO:
// Registra aquí tu router del módulo Teams, por ejemplo:
//   import teamsRoutes from './teams.routes.js';
//   router.use('/teams', teamsRoutes);

export default router;
