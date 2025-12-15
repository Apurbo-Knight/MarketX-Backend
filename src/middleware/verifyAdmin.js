const verifyAdmin = (req,res,next) => {
    if(req.role !== 'admin') {
        return res.status(401).send({message:"Unauthorized role, access denied"})
    }
    next();
}

module.exports = verifyAdmin