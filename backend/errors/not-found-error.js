class ResourceNotFoundError extends Error {
  constructor(msg = 'Ресурс не найден') {
    super(msg);
    this.statusCode = 404;
  }
}

module.exports = ResourceNotFoundError;
