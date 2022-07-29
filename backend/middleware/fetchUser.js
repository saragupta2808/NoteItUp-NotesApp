const jwt = require("jsonwebtoken");
const JWT_SECRET = "thisismysecretkeyforsignature";

//next here means ki after fetch user async function in auth.js will be implemented
const fetchuser=(req,res,next)=>{
    //get the user from the jwt token and add id toh the request object
    const token= req.header('auth-token'); //see thunderclient header 
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const data= jwt.verify(token, JWT_SECRET);  
        req.user=data.user;
        next();
        
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
   
}

module.exports= fetchuser;