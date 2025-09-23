const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const connectionRequest = require('../models/connectionRequest');
const { getUser } = require('../utils/apiUtils');
const {
  sendErrorResponseForInvFields,
  sendErrorResponseForNotFound,
  sendCustomErrorResponse,
  sendSuccessBodyResponse,
  sendServerErrorResponse,
} = require('../utils/helper');

requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      if (toUserId == fromUserId) {
        return res
          .status(400)
          .json(
            sendErrorResponseForInvFields(
              `both the users are same, so you can't send like this`,
            ),
          );
      }
      const { found, data, message } = await getUser(toUserId);
      if (!found) {
        return res
          .status(404)
          .json(sendErrorResponseForNotFound('receiver user not Found'));
      }
      const allowedStatus = ['interested', 'ignored'];
      if (!allowedStatus.includes(status)) {
        return res
          .status(401)
          .json(sendCustomErrorResponse('invalid status type ' + status));
      }
      const existingRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingRequest) {
        return res
          .status(400)
          .json(
            sendCustomErrorResponse(
              'already there is a request made, among these two',
            ),
          );
      }
      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await request.save();
      return res
        .status(201)
        .json(sendSuccessBodyResponse('connection request sent succesfully'));
    } catch (e) {
      return res
        .status(500)
        .json(sendServerErrorResponse('some thing went wrong' + e.message));
    }
  },
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    const { status, requestId } = req.params;
    const toUserId = req.user._id;
    const request = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: toUserId,
      status: 'interested',
    });
    if (!request) {
      return res
        .status(404)
        .json(sendCustomErrorResponse('request is not at all made actually'));
    }
    const allowedStatus = ['accepted', 'rejected'];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json(sendCustomErrorResponse('review status is not valid'));
    }
    try {
      request.status = status;
      request.save();
      return res
        .status(201)
        .json(sendSuccessBodyResponse('review was successfully'));
    } catch (e) {
      return res
        .status(500)
        .json(sendServerErrorResponse('something went wrong' + e));
    }
  },
);

requestRouter.get('/requests/sent', userAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const response = await ConnectionRequest.find({
      fromUserId: userId,
      status: 'interested',
    }).populate('toUserId', ['firstName', 'lastName']);
    return res.status(200).json(sendSuccessBodyResponse(response));
  } catch (e) {
    return res
      .status(500)
      .json(sendServerErrorResponse('some thing went wrong'));
  }
});

requestRouter.get('/requests/received', userAuth, async (req, res) => {
  const userId = req.user._id;
  try {
    const response = await connectionRequest
      .find({ toUserId: userId, status: 'interested' })
      .populate('fromUserId', ['firstName', 'lastName', 'photoUrl']);
    return res.status(200).json(sendSuccessBodyResponse(response));
  } catch (e) {
    return res
      .status(500)
      .json(sendServerErrorResponse('some thing went wrong'));
  }
});

module.exports = requestRouter;
