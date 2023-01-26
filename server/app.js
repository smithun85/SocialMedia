const express = require('express')

//initialise express
const app = express();

//Parse request body as JSON
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());

//Make public static folder
app.use(express.static('public'));

//Routes



module.exports = app