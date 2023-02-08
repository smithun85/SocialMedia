//Using ES6 module
const mongoose = require('mongoose');  

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true," Please enter the name"]
    },
        
    email:{
        type:String,
        required:[true,"Please enter the email id"],
        unique:[true,"email already exist"]
    },
    password:{
        type: String,
        required:[true,"please enter password"],
        minlength:[6,"Password must be 6 character"],
        select:false   //we access all userData except then password
    },               //when we have to require password to find() then use=> findOne({...}).select("+password")
    avatar:{
        public_id:String,
        url:String
    }, 
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
     
},{ timestamps:true });

//encrypted password
UserSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(this.password, salt);
    if(this.isModified("password")){
        this.password = hashedpassword
    }
    
    next()
});

//compare password b/w user data & in dataBase: =>CREATE CUSTOM METHOD-1
UserSchema.method("matchPassword", async function(password) { //this password is given by user in front-end
    return await bcrypt.compare(password, this.password)
}); 

//Generate token: =>CREATE CUSTOM METHOD-2
UserSchema.methods.generateToken = async function() {
const token = jwt.sign({ user_id:this._id }, process.env.JWT_SECRET, { expiresIn:"60days" })
return token;
} ;

const UserModel = mongoose.model("User",UserSchema);
module.exports =  UserModel