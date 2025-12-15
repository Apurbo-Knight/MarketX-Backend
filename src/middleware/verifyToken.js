const { errorResponse, successResponse} = require("../utils/responseHandeler")
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req,res,next) => {
    try{
        const token = req.cookies.token ; 
        // const token =  req.headers.authorization?.split(' ')[1]
        // console.log("Token from cookies:",token)
        if(!token){
           return successResponse(res,401,"Unauthorized access")
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        console.log(decoded)

        if(!decoded.userId) {
            return res.status(403).send({message:"Access denied"})
        }
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    }catch(error){
        errorResponse(res,500,"Invalid Token", error);
    }
}

module.exports = verifyToken;