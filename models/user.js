const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{
        type:String,
        enum:['user','recruter','admin'],
        default:'user'
    }
},{timestamps:true});
profil
module.exports = mongoose.model('User', userSchema);