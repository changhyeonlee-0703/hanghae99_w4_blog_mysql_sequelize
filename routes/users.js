const express = require("express");
const { User } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

router.get("/", (req, res) => {
  res.send("Hello, This is my homework page main.");
});


// 회원가입
router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;
  const regNickname = /^[A-Za-z0-9]{3,}$/;
  const regPassword = /^.{4,}$/;
  if (!regNickname.test(nickname)) {
    return res
      .status(400)
      .send({ errorMessage: "닉네임 앙식이 맞지 않습니다." });
  }
  if (!regPassword.test(password) || password.search(nickname) > -1) {
    return res
      .status(400)
      .send({ errorMessage: "비밀번호 양식이 맞지 않습니다." });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .send({ errorMessage: "패스워드가 패스워드 확인란과 다릅니다." });
  }

  const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { nickname }],
    },
  });
  if (existsUsers.length) {
    return res
      .status(400)
      .send({ errorMessage: "이메일 또는 닉네임이 이미 사용중입니다." });
  }

  await User.create({ email, nickname, password });
  res.status(201).send({});
});


// 로그인
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user || password !== user.password) {
    return res
      .status(400)
      .send({ errorMessage: "이메일 또는 패스워드가 틀렸습니다." });
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, SECRET_KEY),
  });
});


// 유저 인증
router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals; // 구조 분해 할당
  res.send({
    user: {
      email: user.email,
      nickname: user.nickname,
    },
  });
});

module.exports = router;
