import { verifyToken } from '../services/auth.service.js';
import { User } from '../models/index.js';
import { HttpError } from '../utils/http-error.js';
import { asyncHandler } from '../utils/async-handler.js';

/**
 * Middleware de autenticación por JWT.
 * Espera un header `Authorization: Bearer <token>`. Si el token es válido,
 * adjunta el usuario a `req.user`; si no, responde 401.
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw HttpError.unauthorized('Falta el header Authorization Bearer');
  }

  const payload = verifyToken(token);
  const user = await User.findByPk(payload.sub);
  if (!user) {
    throw HttpError.unauthorized('El usuario del token ya no existe');
  }

  req.user = user;
  next();
});
