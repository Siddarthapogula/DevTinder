require("dotenv").config();
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const { sendCustomErrorResponse, sendServerErrorResponse } = require('../utils/helper');
const jwt_secret = process.env.JWT_SECRET;


const userAuth =  async (req, res, next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.status(400).send(sendCustomErrorResponse('no token found, please login'))
    }
    try{
        const {_id} = await  jwt.verify(token, jwt_secret);
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).json(sendCustomErrorResponse('user not found'))
        }
        req.user = user;
        next();
        return;
    }catch(err){
        return res.status(500).send(sendServerErrorResponse(err));
    }
}


module.exports = {userAuth};