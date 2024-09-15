import express from 'express'
import cors from 'cors'
import Auth from '../routes/auth.js'
import mongoose from 'mongoose'
import Profile from '../routes/profile.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT
app.use(express.json())

app.use(cors())


mongoose.connect(process.env.DATABASE_CO)

app.use('/',Auth)
app.use('/profile',Profile)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
