import express, { Router } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Signup } from '../models/Signup.js'
const router = express.Router()
import jwt from 'jsonwebtoken'

const Secret = 'd3d8b5ffb1f83db43b61969af4a037da0889bbcc409501e4fd93b51ff79aa09dc6530759cb7290578b722a57dd8180b7d257f33f671463ea2ee24dd3913bc6d2'

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
        return res.json("not found")
      }else{
        // console.log("Welcome")
        // console.log(user.username)
        const token = jwt.sign(
          { userId: user._id, username: user.username }, // Payload
          Secret, // Secret key
          { expiresIn: '1h' } // Token expiration time
      );
        return res.json({token,username:user.username})
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