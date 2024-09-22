import express from 'express'
import cors from 'cors'
import Auth from '../routes/auth.js'
import mongoose from 'mongoose'
import Profile from '../routes/profile.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = 3045
app.use(express.json())

app.use(cors())


mongoose.connect("mongodb://localhost:27017/page")

app.use('/',Auth)
app.use('/profile',Profile)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
