const express = require('express')

//initialise express
const app = express();

//Parse request body as JSON
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//use for req.cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// //Make public static folder
// app.use(express.static('public'));

//importing Routes
const Post_Routes = require('./routes/Post_Routes')
const User_Routes = require('./routes/User_Routes')

// //using Routes
app.use("/api/posts", Post_Routes)    //http://localhost:5000/api/posts/upload
app.use("/users",User_Routes)          //http://localhost:5000/users/register


module.exports = app