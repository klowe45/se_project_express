const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
const UnauthorizedError = require("../customErrors/UnauthorizedError");

const extractBearerToken = (header) => header.replace("Bearer ", "").trim();

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("User not authorized"));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError("User not authorized"));
  }
  req.params = payload;
  next();
};

module.exports = auth;
