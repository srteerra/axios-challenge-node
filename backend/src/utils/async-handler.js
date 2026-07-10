/**
 * Envuelve un handler async de Express para propagar los errores al
 * middleware de manejo de errores sin tener que repetir try/catch.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
