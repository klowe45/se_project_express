const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
const UnauthorizedError = require("../customErrors/UnauthorizedError");

const handleAuthError = (res) => {
  throw new UnauthorizedError("User not authorized");
};

const extractBearerToken = (header) => header.replace("Bearer ", "").trim();

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return handleAuthError(res);
  }
};

module.exports = auth;
