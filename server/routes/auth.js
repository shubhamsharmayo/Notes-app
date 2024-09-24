import express, { Router } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Signup } from '../models/Signup.js'
import jwt from 'jsonwebtoken'
const router = express.Router()
import dotenv from 'dotenv'

dotenv.config()



router.use(cors())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get('/',(req,res)=>{
  res.json({message:"hello"})
})


router.post('/', async(req, res) => {
  const email = req.body.email
  const password = req.body.password
    console.log(req.body)
    
    try {
      const user = await Signup.findOne({email})
      if (!user || user.password !== password){
        return res.json({username:"not found"})
      }
      const payload = { id: user._id, email: user.email, username: user.username };
     jwt.sign(payload,process.env.KEY,{expiresIn:'1h'},(err,token)=>{
      if (err) {
        return res.status(500).json({ message: "Error generating token" });
      }
        // console.log(token)
        res.json({
          message: "Login successful",
          username: user.username,
          token: token  // The token sent to browser
        });
      })
       
        
    
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