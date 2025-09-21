const express = require('express');
const app = express();
const port = process.env.PORT;
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userRouter =  require('./routes/user');
const requestRouter = require('./routes/request');
const profileRouter = require('./routes/profile')
const authRouter = require('./routes/auth');
app.use(cors({
    origin : 'https://devtinder-7ade.onrender.com',
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', userRouter);
app.use('/', requestRouter);
app.use('/', profileRouter);
app.use('/', authRouter);

connectDb().then((data)=>{
    console.log('Changed-Database succcessfully connected');
    app.listen(port);
}).catch((err)=>{
    console.log('failed to start server or connect to the database');
})








