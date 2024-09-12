import mongoose from 'mongoose';

const SignupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique:true},
    password: { type: String, required: true }
    
});

export const Signup =  mongoose.model('Signup', SignupSchema);