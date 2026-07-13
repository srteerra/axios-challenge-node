import { Router } from 'express';
import {createTeam, deleteTeam, getTeam, listTeams, updateTeam} from '../controllers/teams.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listTeams);
router.get('/:id', getTeam);
router.post('/', createTeam);
router.delete('/:id', deleteTeam);
router.patch('/:id', updateTeam);

export default router;
