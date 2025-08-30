require("dotenv").config();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    age : {
        type : Number
    },
    gender : {
        type : String
    },
    photoUrl : {
        type : String,
        default : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
    },
    about : {
        type : String,
        default : "this is the default about of the user"
    },
    skills : {
        type : [String]
    },
},
    {
        timestamps : true
    }
);

userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id : user._id}, jwt_secret);
    return token;
}

module.exports = mongoose.model('User', userSchema);