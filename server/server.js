import express from 'express'
import cors from 'cors'
import Auth from './routes/auth.js'
import mongoose from 'mongoose'
import Profile from './routes/profile.js'

const app = express()
const port = 3000
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://shubham:qmPmj57GZjzMEMDn@cluster0.k6hoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

app.use('/',Auth)
app.use('/profile',Profile)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})