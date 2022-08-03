const jwt = require("jsonwebtoken");
const { User } = require("../models");

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = (authorization || "").split(" ");
  console.log(authorization);
  if (!tokenValue || tokenType !== "Bearer") {
    return res.status(401).send({ errorMessage: "로그인 후 사용하세요" });
  }

  try {
    const { userId } = jwt.verify(tokenValue, SECRET_KEY);
    console.log(userId);
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).send({ errorMessage: "로그인 후 사용하세요." });
  }
};
