const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkLogin = (req, res, next) => {
  // const authHeader = req.headers.authorization || req.headers.Authorization;
  
  const authHeader = req.cookies

  if (!authHeader) {
    return res.status(401).json({ message: "cookies ga ketemu njing" });
  }
  // if (!authHeader?.startsWith("Bearer ")) {
  //   return res.status(401).json({ message: "Header Not Found" });
  // }
//  const accessToken = authHeader.split(" ")[1]
  const accessToken = authHeader;

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json("Invalid Token");
    }

    req.userLogin = decoded;
    next();
  });
};

module.exports = checkLogin;
