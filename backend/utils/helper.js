const validateUser = ({ firstName, lastName, emailId, password }) => {
  if (!firstName || !lastName) {
    throw new Error('name is not valid');
  }
};

const validateUserProfileUpdateData = (body) => {
  const forbiddenFields = ['emailId', 'password', '_id'];
  function isForbiddenBody() {
    return Object.keys(body).some((key) => forbiddenFields.includes(key));
  }
  if (isForbiddenBody()) {
    return false;
  }
  return true;
};

const sendErrorResponseForInvFields = (fields) => {
  return {
    status: 'error',
    error: 'provide correct fields',
    message: 'provide correct fields',
  };
};

const sendSuccessBodyResponse = (data) => {
  return {
    status: 'success',
    data: data,
  };
};

const sendServerErrorResponse = (e = '') => {
  return {
    status: 'error',
    error: 'something went wrong' + e,
    message: 'something went wrong',
  };
};

const sendErrorResponseForNotFound = (data) => {
  return {
    status: 'error',
    error: ' not found',
    message: data,
  };
};

const sendCustomErrorResponse = (data) => {
  return {
    status: 'error',
    error: data,
    message: data,
  };
};

module.exports = {
  validateUser,
  validateUserProfileUpdateData,
  sendErrorResponseForInvFields,
  sendSuccessBodyResponse,
  sendServerErrorResponse,
  sendErrorResponseForNotFound,
  sendCustomErrorResponse,
};
