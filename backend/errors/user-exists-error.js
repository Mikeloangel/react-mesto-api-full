class UserExistsError extends Error {
  constructor(message = 'Пользователь с таим email уже существует') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = UserExistsError;
