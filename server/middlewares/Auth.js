const UserModel = require('../models/User_Model')
const jwt = require('jsonwebtoken')

const isAuthenticated = async (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({
            message:"token is not find,so please login first"
        })
    }

   try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.user_id)
    next()

   }catch (err){
    res.status(501).json({message:"request is not Authorized"})
   }
}


module.exports = isAuthenticated