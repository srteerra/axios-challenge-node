import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const registerHandler = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

export const loginHandler = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

/** Devuelve el usuario autenticado actual (ruta protegida). */
export const meHandler = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user.toSafeJSON() });
});
