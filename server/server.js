const app = require('./app')

const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'});

const connectDatabase = require('./config/database')
connectDatabase();

const port = process.env.PORT 

//Start the server
app.listen(port, (err)=>{
    if(!err){
        console.log(`Server is running on port ${port}`)
    }else{
        console.log(`Error occurs Error:${err}`)
    }
})