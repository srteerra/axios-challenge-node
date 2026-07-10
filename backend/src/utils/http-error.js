/**
 * Error HTTP con código de estado. Lo lanzan servicios/controladores y lo
 * captura el middleware de errores para responder con el status adecuado.
 */
export class HttpError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message, details) {
    return new HttpError(400, message, details);
  }

  static unauthorized(message = 'No autenticado') {
    return new HttpError(401, message);
  }

  static forbidden(message = 'No autorizado') {
    return new HttpError(403, message);
  }

  static notFound(message = 'Recurso no encontrado') {
    return new HttpError(404, message);
  }

  static conflict(message) {
    return new HttpError(409, message);
  }

  static unprocessable(message, details) {
    return new HttpError(422, message, details);
  }
}
