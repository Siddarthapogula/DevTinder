const body = {
  emailID: 'siddarth@gmail.com',
  password: '123456',
  firstName: 'siddarth',
  lastName: 'pogula',
  skills: ['node', 'fullstack', 'ml', 'gen-ai'],
  age: '21',
  gender: 'M',
  photoURL: 'google.com/siddarth.jpg',
  usrId: '23456',
};

const notAllowedFieldsForUpdation = ['emailId', 'password', 'firstName', '_id'];

function hasForbiddenFields() {
  return Object.keys(body).some((key) =>
    notAllowedFieldsForUpdation.includes(key),
  );
}

if (hasForbiddenFields()) {
  console.log('unable to move forward, coz of presence of forbidden fields');
} else {
  console.log('updation success');
}
