// require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/user');
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile');
const authRouter = require('./routes/auth');
app.use(
  cors({
    // origin: "https://devtinder-7ade.onrender.com",
    origin: 'http://localhost:4173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/getDetails', async (req, res) => {
  return res.json({
    message: 'hi there',
    status: 201,
    name: 'siddarth pogula',
    address: 'beeravelli, nirmal, telangana',
  });
});

app.use('/', userRouter);
app.use('/', requestRouter);
app.use('/', profileRouter);
app.use('/', authRouter);

connectDb()
  .then((data) => {
    console.log('Changed-Database succcessfully connected');
    app.listen(port, () => {
      console.log('app is listening at port no', port);
    });
  })
  .catch((e) => {
    console.log('error occured', e.message);
  })
