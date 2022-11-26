// handles errors
// eslint-disable-next-line
module.exports.handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'Server error' : message });
};
