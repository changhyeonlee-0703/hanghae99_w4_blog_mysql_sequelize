const express = require("express");
const app = express();
const router = express.Router();

require("dotenv").config(); // npm i dotenv
const port = process.env.PORT; //process.env는 내장 함수로 .env파일의 PORT란 변수를 불러와줌.


// routes 폴더 js 파일 연결
const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
const authMiddleware = require("./middlewares/auth-middleware");


// requestMiddleWare 함수 선언식 : 요청 받은 url 및 시간 log
const requestMiddleWare=(req,res,next)=>{
    console.log("request URL: ",req.originalUrl," - ", new Date());
    next();
};


const jwt = require("jsonwebtoken");
const {Op} = require("sequelize");
const {User, Cart, Goods} = require("./models");



// request 시  차례대로 진행
app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleWare);
app.use("/", usersRouter);
app.use("/posts",postsRouter);
app.use("/comments",commentsRouter);



// 서버 오픈 시 발생
app.listen(port, ()=>{
    console.log(port, "포트로 서버가 커졌어요!")
});