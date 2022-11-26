class WrongDataError extends Error {
  constructor(msg = 'Неверный формат данных') {
    super(msg);
    this.statusCode = 400;
  }
}

module.exports = WrongDataError;
