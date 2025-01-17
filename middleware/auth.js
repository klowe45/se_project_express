const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
const { UNAUTHORIZED_ACCESS } = require("../utils/errors");

const handleAuthError = (res) => res
    .status(UNAUTHORIZED_ACCESS)
    .send({ message: "Authorization error" });

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
