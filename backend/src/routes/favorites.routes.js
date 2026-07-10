import { Router } from 'express';
import {
  listFavorites,
  createFavorite,
  updateFavorite,
  deleteFavorite,
} from '../controllers/favorites.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de favoritos requieren autenticación.
router.use(authenticate);

router.get('/', listFavorites);
router.post('/', createFavorite);
router.patch('/:id', updateFavorite);
router.delete('/:id', deleteFavorite);

export default router;
