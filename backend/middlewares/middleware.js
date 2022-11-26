/* eslint-disable no-console */

// disables header:Cache-Control, uses from App.js to developing purposes
module.exports.disableCache = (req, res, next) => {
  res.header('Cache-Control', 'no-store');
  next();
};

// shows req basic info in console (url, method, body, query)
// req params are shown in url: at this part we dont know params names
// because logger is too generic at this execution point
module.exports.logger = (req, res, next) => {
  console.log(`URL ${req.url} Method: ${req.method}`);

  if (Object.keys(req.body).length !== 0) {
    console.log('Body:');
    console.dir(req.body);
  }

  if (Object.keys(req.query).length !== 0) {
    console.log('Query:');
    console.dir(req.query);
  }

  next();
};
