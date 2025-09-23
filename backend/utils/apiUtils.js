const User = require('../models/user');
const getUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { found: false, data: user, message: 'user not found' };
    }
    return { found: true, data: user, message: 'user found' };
  } catch (e) {
    return { found: false, data: null, message: 'something went wrong' };
  }
};

module.exports = { getUser };
