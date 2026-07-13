import { Router } from 'express';
import {createTeam, deleteTeam, listTeams} from '../controllers/teams.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listTeams)
router.post('/', createTeam);
router.delete('/:id', deleteTeam);

export default router;
