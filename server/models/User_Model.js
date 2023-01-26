//Using ES6 module
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type:String,
        required:[true,"Please enter a name"]
    },

    email: {
        type:String,
        required:[true,"Please enter an email"],
        unique:[true, "Email already exist"]
    },

    password: {
        type:String,
        required:[true,"Please enter password"],
        minlength:[true,"Password must be atleast 6 characters"],
        select:false
    },

    posts:[{
        type:Schema.Types.ObjectId,
        ref:Post
    }]
})

//Create Model for schema
const userModel = mongoose.model("User", userSchema)

//export the model
module.exports = userModel