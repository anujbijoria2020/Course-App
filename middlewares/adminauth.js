const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET_KEY } = require("../config");
// const cookieParse = require("cookie-parser");

function adminMiddleWare(req, res, next) {
  console.log("middleware called");

  const token = req.headers.token;
  // const token  = window.localStorage.getItem("token");
  // const token = req.c
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET_KEY); // should now work
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  adminMiddleWare,
};
