const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

const { User, Session } = require("../models");
const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.delete("/", tokenExtractor, async (req, res, next) => {
  console.log(req.decodedToken);
  await Session.destroy({ where: { user_id: req.decodedToken.id } });
  return res.status(204).end();
});

module.exports = router;
