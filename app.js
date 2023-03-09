const dotenv = require('dotenv'); //using for securing password
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
app.use(cookieParser())

dotenv.config({path:'./config.env'}); 
const path = require("path");//for deploy
app.use(express.static(path.join(__dirname,'./client/build'))) //static file deploy
app.get('*',function(req,res){ //desploy
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
})


const PORT=process.env.PORT;
// const User = require('./model/userSchema');

require('./db/conn');
app.use(express.json());

//to link the router file to make our route easy
app.use(require('./router/auth'));



// app.get('/contact',(req,res)=>{
//     res.send(`Hello Contact World from the server`);
// });



app.listen(PORT,()=>{
    console.log(`Server is runing at port no ${PORT}`);
});
