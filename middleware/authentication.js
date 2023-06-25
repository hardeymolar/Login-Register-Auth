const jwt = require('jsonwebtoken')

const auth = async (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({error:'Unauthorized'})
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token,process.env.JWTSECRET)
        req.email = {email:payload.email};
        next()
    } catch (error) {
        res.json(error.message)
    }
}


module.exports = {auth}