const jwt = require('jsonwebtoken');

const express = require('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");
require('../db/conn');
const User=require("../model/userSchema");
router.get('/',(req,res)=>{
    res.send(`Bismillah From the server router js`);
});
//Using Promisses
// router.post('/register',(req,res)=>{
//     const {name, email, phone, work, password, cpassword} =req.body;
//     if(!name || !email || !phone ||!work || !password || !cpassword)
//     {
//         return res.status(422).json({error:"Plz filled the field property"})
//     }
//     User.findOne({ email:email})
//         .then((userExist)=>{
//             if(userExist){
//             return res.status(422).json({error: "Email already Exist"});
//             }
      

//         const user=new User({name, email, phone, work, password, cpassword});
//         user.save().then(()=>{
//             res.status(201).json({message: "user registered successfuly"});

//         }).catch((err)=>res.status(500).json({error: "Failed to registerd"}));
//     }).catch((err)=>{console.log(err);})
// });

//register route
//Using Async-Await
router.post('/register',async (req,res)=>{
    const {name, email, phone, work, password, cpassword} =req.body;
    if(!name || !email || !phone ||!work || !password || !cpassword)
    {
        return res.status(422).json({error:"Plz filled the field property"})
    }
    try{
        const userExist= await User.findOne({ email:email})
        if(userExist){
            return res.status(400).json({error:"Email already exist"})

        }else if(password != cpassword){
            return res.status(422).json({error:"Password are not matching"})

        }else{
        const user=  new User({name, email, phone, work, password, cpassword});

        //yeha pe
        await user.save();

       
        res.status(201).json({message: "user registered successfuly"});
        }
    
    }catch(err){
        console.log(err)
    }

     
    
});

//login route

router.post('/signin',async(req,res)=>{
    try{
        let token;
        const {email,password} =req.body;
        if(!email || !password){
            return res.status(400).json({error:"Plz Filled the data"})
        }
        const userLogin = await User.findOne({email: email});
        if(userLogin){
            const  isMatch = await bcrypt.compare(password,userLogin.password)

            token = await userLogin.generateAuthToken();

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+2589200000),
                httpOnly:true
            });

            console.log(token);

            if(!isMatch){
                res.status(400).json({error:"Invalid Credientials"});
            }
            else{
                res.json({message:"user Signin Successfully"});
    
            }
        }else{
            res.status(400).json({error:"Invalid Credientials"});

        }
        
    }catch(err){

    }
});

//about us page
router.get('/about',authenticate,(req,res)=>{
    console.log("Hello my about")
    res.send(req.rootUser);
});

//contact us page home
router.get('/getdata',authenticate,(req,res)=>{
    console.log("hellow my contact")
    res.send(req.rootUser);
});

// //--------------contact token 17:17
// router.get('/contact',authenticate,(req,res)=>{
//     console.log("Hello my about")
//     res.send(req.rootUser);
// });
// //-------------

//contact uspage
router.post('/contact',authenticate,async(req,res)=>{
    try{
        const {name,email,phone,message} = req.body;
        if(!name || !email || !phone || !message)

        {
            console.log("error in contact form");
            return res.json({error:"plz filled the contact form"});
        }
        const userContact = await User.findOne({_id:req.userID});
        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message);
            await userContact.save();
            res.status(201).json({message: "user contact sucessfully"});


        }


    }catch(error){
        console.log(error)

    }

   
});

//logout

router.get('/logout',(req,res)=>{
    console.log("hellow logout page");
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('User Loggout');
});



module.exports=router;