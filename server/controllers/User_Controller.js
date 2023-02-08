const bcrypt = require('bcrypt');
const UserModel = require('../models/User_Model')

const register = async (req,res) => {
    try{
        const {name,email, password} = req.body;

        let user = await UserModel.findOne({ email });
        if(user) {
            return res.status(400).json({
                success:false,
                message:"user already exist"
            })
        }

        user = await UserModel.create({
            name, 
            email, 
            password,
            avatar:{
                public_id: "sample id", 
                url:"smple Url"
            }
        })

        //Token generate: using custom method as generateToken()=>define in userSchema
        const token = await user.generateToken();
        const options = {
            expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000 ),
            httpOnly:true
        } 
        res.status(200).cookie("token", token, options).json({
            message:"Register successfully",
            user,
            token
        })

    }catch (err){
        res.status(500).json({
            success:false,
            message:err.message,
            status:"User document is not created"
        })
    }
}


const login = async (req, res) => {
    const { email, password } = req.body
    try{
        let existUser = await UserModel.findOne({email}).select("+password")

        //user validation
        if(!existUser){
            return res.status(401).json({
                message:"User does not exist"
            })
        }

        //password validation
        // const isPasswordCorrect = await bcrypt.compare(password, existUser.password);
        //or using custom method as matchPassword()=>define in userSchema
        const isPasswordCorrect = await existUser.matchPassword(password) 
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Wrong password"
            })
        }

        //Token generate: using custom method as generateToken()=>define in userSchema
        const token = await existUser.generateToken();
        const options = {
            expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000 ),
            httpOnly:true
        } 
        res.status(200).cookie("token", token, options).json({
            message:"login successfully",
            existUser,
            token
        })

    } catch (err){
        res.status(500).json({
            success:false,
            message:err.message,
            status:"Something wrong"
        })
    }
}

module.exports = { register, login }