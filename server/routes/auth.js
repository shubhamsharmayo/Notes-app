import express, { Router } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import { dirname } from "path";
import { fileURLToPath } from "url";
import { Signup } from '../models/Signup.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router()

router.use(cors())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())


router.post('/', async(req, res) => {
  const email = req.body.email
  const password = req.body.password
    // console.log(req.body)
    try {
      const user = await Signup.findOne({email})
      if (!user || user.password !== password){
        return res.json("not found")
      }else{
        // console.log("Welcome")
        // console.log(user.username)
        return res.json(user.username)
    }
    } catch (error) {
      res.status(400).json(error)
    }
    
    
  })

router.post('/signup', async(req,res)=>{
  try {
   
    const existingUser = await Signup.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username }
      ]
    });

    if (existingUser) {
     res.json("Email or username Already Exist")
     console.log(existingUser)
    }
    
    
    else{
      const register = new Signup({
        name:req.body.name,
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
      })
      await register.save()
      res.json("done")
     
    }
  } catch (error) {
    res.status(400).json(error)
  }

})



  export default router