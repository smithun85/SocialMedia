const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

//Connect to mongodb
const connectDatabase = () =>{
    mongoose.connect(process.env.MONGO_URI)
    .then( (con) => {
    console.log(`Connection established: ${con.connection.host}`)
    })
    .catch((err)=>{
        console.log(`Connection not established, Error: ${err}`)
    })
}

module.exports = connectDatabase