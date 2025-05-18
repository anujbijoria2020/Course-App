const jwt  =  require("jsonwebtoken");
const {JWT_USER_SECRET_KEY}  = require("../config");


function userMiddleware(req,res,next){
const token  = req.headers.token;
 if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

const decoded = jwt.verify(token,JWT_USER_SECRET_KEY);
if(decoded){
req.userId = decoded.id;
next();
}
else{
    res.status(403).json({
        message:"you are not signed in"
    })
}
}

module.exports = {
    userMiddleware,
}
