const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  sendErrorResponseForNotFound,
  sendServerErrorResponse,
  sendCustomErrorResponse,
  sendSuccessBodyResponse,
  validateUser,
} = require('../utils/helper');
const { userAuth } = require('../middlewares/auth');

authRouter.post('/signup', async (req, res) => {
  validateUser(req.body);
  const { firstName, lastName, password, emailId } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    password: hashed,
    emailId,
  });
  try {
    await user.save();
    res.status(201).json(sendSuccessBodyResponse('user created successfully'));
  } catch (e) {
    res
      .status(400)
      .json(sendServerErrorResponse('user creation failed' + e.message));
  }
});

authRouter.post('/login', async (req, res) => {
  const { emailId, password } = req.body;
  let user;
  try {
    const curUser = await User.findOne({ emailId: emailId });
    if (curUser == null) {
      return res
        .status(401)
        .json(sendErrorResponseForNotFound('user not found'));
    }
    user = curUser;
  } catch (e) {
    return res.status(500).json(sendServerErrorResponse(e));
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json(sendCustomErrorResponse('incorrect password'));
  }
  const token = await user.getJWT();
  res.cookie('token', token, {
    expires: new Date(Date.now() + 1 * 3600000),
    sameSite: 'None',
    secure: true, // Add this line
  });
  return res.status(200).json(sendSuccessBodyResponse(user));
});

authRouter.post('/logout', userAuth, async (req, res) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
    });
    return res
      .status(200)
      .json(sendSuccessBodyResponse('user logged out success fully'));
  } catch (e) {
    return res.status(500).json(sendServerErrorResponse(e));
  }
});

module.exports = authRouter;
