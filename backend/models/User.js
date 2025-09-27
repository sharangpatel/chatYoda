import mongoose, { model } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    credits:{type:Number,default:20}
})

//Hash the passwrod before saving

// Below 'next' is a callback function provided by Mongoose.
// If you call next() → Mongoose knows “this middleware is done, move on.”

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

const User = model('User',userSchema)

export default User;