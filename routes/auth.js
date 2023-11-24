require("dotenv").config()

const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')


module.exports = (User) =>{

    //Get all users

    router.get("/users", async(req, res)=>{

        try{
            const users = await User.find();
            res.json(users)
        }catch(err){
            res.status(500).json({message: err.message})
        }

    })

    //Post logging in

    router.post("/login", async(req, res) =>{
        try{
            const user = await User.findOne({"name": req.body.name})
            if(!user){
                return res.status(400).send("Cannot find user")
            }
            //Checking password
            if(await bcrypt.compare(req.body.password, user.password)){
                
                //Plain object for jwt access token creation
                const userPayload={
                    name: user.name,
                    password: user.password
                }

                const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET)
                res.status(200).json({accessToken: accessToken})
            }
            else{
                res.send("Login Failed")
            }
        }catch(err){
            res.status(500).json({message: err.message})
        }


    })

    //Post signing up

    router.post("/signup", async(req, res)=>{
        try{
            //Encryption
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                name: req.body.name,
                password: hashedPassword
            })
            const newUser = await user.save()
            res.status(201).send()

        }catch(err){
            res.status(500).json({message: err.message})
        }


    })

    return router
}