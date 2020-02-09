module.exports = {
  "origin": "*",
  "method": [
      'GET',
      'POST',
      'PATCH',
      'OPTIONS'
  ],
  "allowedHeaders": [
      'Authorization',
      'X-API-KEY',
      'Origin',
      'X-Requested-Width',
      'Content-Type',
      'Access-Control-Allow-Request-Method'
  ],
  "maxAge": 3600,
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};
