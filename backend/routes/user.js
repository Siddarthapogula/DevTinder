const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const {
  sendSuccessBodyResponse,
  sendServerErrorResponse,
  sendErrorResponseForNotFound,
  sendCustomErrorResponse,
} = require('../utils/helper');
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');

userRouter.post('/user', userAuth, async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length == 0)
      return res.status(400).json(sendCustomErrorResponse('no user found '));
    return res.status(200).json(sendSuccessBodyResponse(user));
  } catch (e) {
    return res.status(500).json(sendServerErrorResponse(e));
  }
});

userRouter.delete('/user', userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(400)
        .json(sendErrorResponseForNotFound('user not found'));
    }
    user.save();
    return res
      .status(201)
      .json(sendSuccessBodyResponse('deleted successfully'));
  } catch (e) {
    return res
      .status(500)
      .json(sendServerErrorResponse('something went wrong'));
  }
});

userRouter.patch('/user', userAuth, async (req, res) => {
  const body = req.body;
  const userId = req.body.userId;
  try {
    await User.findByIdAndUpdate(userId, body);
    return res
      .status(201)
      .json(sendSuccessBodyResponse('user updated successfully'));
  } catch (err) {
    return res
      .status(500)
      .json(sendServerErrorResponse('some thing went wrong', err.message));
  }
});

userRouter.get('/users', userAuth, async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(sendSuccessBodyResponse(users));
  } catch (err) {
    return res.status(500).json(sendServerErrorResponse(err));
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  const userId = req.user._id;

  try {
    const users = await connectionRequest
      .find({
        $or: [
          { fromUserId: userId, status: 'accepted' },
          { toUserId: userId, status: 'accepted' },
        ],
      })
      .populate('fromUserId', ['firstName', 'lastName', 'photoUrl'])
      .populate('toUserId', ['firstName', 'lastName', 'photoUrl']);
    const friends = users.map((con) => {
      if (con.fromUserId._id.toString() == userId.toString()) {
        return con.toUserId;
      } else {
        return con.fromUserId;
      }
    });
    return res.status(200).json(sendSuccessBodyResponse(friends));
  } catch (e) {
    return res
      .status(500)
      .json(sendServerErrorResponse('something went wrong' + e));
  }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedUserId = req.user._id.toString();
    let limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    limit = limit > 100 ? 10 : limit;
    const skip = (page - 1) * limit;
    const seenUsers = await connectionRequest.find({
      $or: [{ fromUserId: loggedUserId }, { toUserId: loggedUserId }],
    });
    let redundantUserIds = seenUsers.map(({ fromUserId, toUserId }) => {
      if (fromUserId === loggedUserId) {
        return toUserId;
      }
      return fromUserId;
    });
    redundantUserIds.push(loggedUserId);
    const feedUsers = await User.find({
      _id: { $nin: redundantUserIds },
    })
      .skip(skip)
      .limit(limit);
    return res.status(200).json(sendSuccessBodyResponse(feedUsers));
  } catch (e) {
    return res
      .status(500)
      .json(sendServerErrorResponse('some thing went wrong' + e));
  }
});

module.exports = userRouter;
