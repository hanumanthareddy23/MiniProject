const { verify } = require("jsonwebtoken");
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*';

module.exports = (req, res, next) => {
  
  const authHeader = req.headers.authorization;
 
  if (!authHeader || authHeader === "") {
    req.isAuth = false;
    res.status(301);
    return res.redirect(302,"/index.html");
    
  } else {
    let token=authHeader.split(" ").pop()
    let decoded;

    try {
      decoded = verify(token, JWT_SECRET);
    } catch (error) {
      req.isAuth = false;
      
    return res.redirect(302,"/index.html");
      
    }

    if (!decoded) {
      req.isAuth = false;
      return res.redirect(302,"/index.html");
      
    }

    if (decoded?.user?.role !== 'admin') {
      req.isAuth = false;
      return res.redirect(302,"/index.html");
      
    }

    req.isAuth = true;
    req.user = decoded.user;
    req.userData = decoded;
    return next();
  }
};