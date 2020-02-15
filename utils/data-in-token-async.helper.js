const errorHelper = require("./error-async.helper");
const jwt = require("jsonwebtoken");

module.exports = async (authHeader, keyToken, res, next) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(authHeader, keyToken);
  } catch (err) {
    await errorHelper(
      res,
      next,
      "Error",
      422,
      "A ocurrido un error al obtener la data del usuario."
    );
  }

  return decodedToken;
}