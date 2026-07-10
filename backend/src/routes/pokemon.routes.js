import { Router } from 'express';
import { listHandler, detailHandler } from '../controllers/pokemon.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// El catálogo de PokeAPI se expone sólo a usuarios autenticados.
router.get('/', authenticate, listHandler);
router.get('/:name', authenticate, detailHandler);

export default router;
