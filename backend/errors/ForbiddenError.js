class ForbiddenError extends Error {
  constructor(msg = 'Нет доступа') {
    super(msg);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
