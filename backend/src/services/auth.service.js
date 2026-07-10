import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/index.js';
import { HttpError } from '../utils/http-error.js';

const SALT_ROUNDS = 10;

/** Firma un JWT con el id y email del usuario. */
function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/**
 * Registra un usuario nuevo. Lanza 409 si el email ya existe.
 */
export async function register({ email, name, password }) {
  if (!email || !name || !password) {
    throw HttpError.badRequest('email, name y password son obligatorios');
  }
  if (password.length < 6) {
    throw HttpError.badRequest('La contraseña debe tener al menos 6 caracteres');
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw HttpError.conflict('Ya existe un usuario con ese email');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ email, name, passwordHash });

  return { user: user.toSafeJSON(), token: signToken(user) };
}

/**
 * Autentica un usuario por email + password. Lanza 401 si las credenciales
 * son inválidas (mensaje genérico para no filtrar qué campo falló).
 */
export async function login({ email, password }) {
  if (!email || !password) {
    throw HttpError.badRequest('email y password son obligatorios');
  }

  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.verifyPassword(password))) {
    throw HttpError.unauthorized('Credenciales inválidas');
  }

  return { user: user.toSafeJSON(), token: signToken(user) };
}

/** Verifica un token y devuelve el payload decodificado. */
export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch {
    throw HttpError.unauthorized('Token inválido o expirado');
  }
}
