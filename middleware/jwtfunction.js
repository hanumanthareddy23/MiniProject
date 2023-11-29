const jwt=require("jsonwebtoken");
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*';
module.exports = (req, res, next) => {

  let authHeader=req.headers.authorization;

  if(authHeader==undefined)
  {
    
    res.status(401).send({error:"no token provided"});
  }
  let token=authHeader.split(" ").pop()
  jwt.verify(token,JWT_SECRET,function(err,decoded){
    if(err){
      res.status(500).send({error:"Authentication Failed"})
    }
    else{
      req.isAuth = true;
      req.username = decoded.username;
      req.userData = decoded;
      return next();
    }

  })
}