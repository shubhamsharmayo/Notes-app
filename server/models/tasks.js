import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    user:{type:String , unique:false},
    title: { type: String , unique:false},
    description: { type: String, unique:false},
    color:{type:String, unique:false}
    
    
});

export const Tasks =  mongoose.model('Task', TaskSchema);