const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkLogin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let accessToken;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    accessToken = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    req.userLogin = decoded;
    next();
  });
};

module.exports = checkLogin;
