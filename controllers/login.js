const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");
const Session = require("../models/session");
const { sequelize } = require("../util/db");

router.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === "s3cr3t";

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);
  await Session.create({ token, userId: userForToken.id });
  // await sequelize.query(
  //   `INSERT INTO SESSIONS (user_id, token, is_disabled) values (${user.id}, ${token}, false)`,
  //   { model: Session }
  // );

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
