import express, { Router } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import { Tasks } from '../models/tasks.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

router.use(cors())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())



// Route to handle profile data submission
router.post('/profile/:username', async(req, res) => {
    const options = {
        weekday: 'short',  // Short day name (e.g., Thu)
        year: 'numeric',   // Year (e.g., 2024)
        month: 'short',    // Short month name (e.g., Sep)
        day: 'numeric',    // Day of the month (e.g., 26)
        timeZone: 'Asia/Kolkata'  // Set to Indian time zone
      };
      const date = new Date().toLocaleString('en-IN', options);
     const dateInIndia = date.replace(/,/g, '');
    const { username } = req.params;
    const { title, description } = req.body;
    const task = new Tasks({
        user:req.body.user,
        title:req.body.title,
        description:req.body.description,
        color:req.body.color,
        date: dateInIndia
    })
    await task.save()
    res.json(task._id)
//    console.log(req.params.username)
//    console.log(req.body)
//    res.json(username)

});

router.get('/:user',verifyToken, async(req,res)=>{
    const {user} = req.params
    const found = await Tasks.find({user})
    console.log(user)
    res.json(found)
})

router.delete('/delete/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        const taskid = await Tasks.findByIdAndDelete(req.params.id);
        if (!taskid) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        // res.redirect('/:user')
        res.json('Task deleted');
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
  });

  router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const {title,description,color} = req.body;

    try {
        const Update = await Tasks.findByIdAndUpdate(id, {title,description,color}, { new: true });
        if (!Update) {
            return res.status(404).json({ msg: 'Note not found' });
        }
        res.json(Update);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router