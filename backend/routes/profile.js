const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateUserProfileUpdateData, sendErrorResponseForInvFields, sendSuccessBodyResponse, sendServerErrorResponse, sendCustomErrorResponse } = require("../utils/helper");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  return res.status(200).json(sendSuccessBodyResponse(req.user));
});

profileRouter.get('/profile/:userId', async (req, res)=>{
  const userId = req.params.userId.toString();
  if(!userId){
    return res.status(400).json(sendErrorResponseForInvFields('userid not provided'));
  }
  try{
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json(sendCustomErrorResponse('user not found, provide correct userId'));
    }
    return res.status(200).json(sendSuccessBodyResponse(user));
  }catch(e){
    return res.status(500).json(sendServerErrorResponse(e));
  }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const body = req.body;
  if (!validateUserProfileUpdateData(body)) {
    res.status(400).json((sendErrorResponseForInvFields('update body')));
  }
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndUpdate(userId, body, {new : true});
    return res.status(203).json(sendSuccessBodyResponse(user));
  } catch (e) {
    return res.status(400).json(sendServerErrorResponse(e));
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  const newPassword = req.body.password;
  const userId = req.user._id;
  const hashPassword = await bcrypt.hash(newPassword, 10);
  try {
    await User.findByIdAndUpdate(userId, { password: hashPassword });
    return res.status(203).json(sendSuccessBodyResponse("password changed successfully"));
  } catch (e) {
   return  res.status(500).send(e);
  }
});

module.exports = profileRouter;
