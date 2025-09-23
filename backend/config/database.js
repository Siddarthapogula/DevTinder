// require('dotenv').config();
const mongoose = require('mongoose');

const connectDb = async () => {
  console.log(process.env.DB_URI);
  await mongoose.connect(process.env.DB_URI);
};
module.exports = connectDb;
