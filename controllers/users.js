const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: { model: Blog },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  return res.json(user);
});

router.get("/:id", async (req, res) => {
  let where = {};

  if (req.query.read === "true") {
    console.log(req.query.read);
    where = { read: true };
  } else if (req.query.read === "false") {
    where = { read: false };
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      { model: Blog, attributes: { exclude: ["userId"] } },
      {
        model: Blog,
        as: "user_reading",
        attributes: { exclude: ["userId"] },
        through: { attributes: ["id", "read"], where },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    user.name = req.body.name;
    await user.save();
    res.json(user);
  } else {
    res.status(404).send({ error: "user doesn't exist in database" });
  }
});

module.exports = router;
