const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { sequelize } = require("../util/db");
const { SECRET } = require("../util/config");

const { Blog, User, ReadingList } = require("../models");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      console.log(authorization.substring(7));
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

router.get("/", async (req, res) => {
  const readingLists = await sequelize.query("SELECT * FROM readinglists", {
    model: ReadingList,
  });
  res.json(readingLists);
});

router.post("/", async (req, res) => {
  const input = req.body;
  console.log("input", input);
  const blog = await Blog.findByPk(req.body.blogId);
  const user = await User.findByPk(req.body.userId);
  const newReadingList = await sequelize.query(
    `INSERT INTO READINGLISTS (user_id, blog_id, read) values (${user.id}, ${blog.id}, false)`,
    { model: ReadingList }
  );
  // const newReadingList = await ReadingList.create({
  //   userId: user.id,
  //   blogId: blog.id,
  //   read: false,
  res.json(newReadingList);
  // });
});

router.put("/:id", tokenExtractor, async (req, res) => {
  console.log(req.params.id);
  const user = await User.findByPk(req.decodedToken.id);
  const readlist = await sequelize.query(
    `SELECT * FROM READINGLISTS WHERE ID = ${req.params.id}`,
    {
      model: ReadingList,
    }
  );

  if (!readlist) {
    return res.status(400).json({ error: "undefined readinglist" });
  }
  if (readlist[0].dataValues.user_id !== user.id) {
    return res
      .status(401)
      .json({ error: "Readinglist user different from requesting user" });
  }
  await sequelize.query(
    `UPDATE READINGLISTS SET read = true WHERE ID = ${req.params.id}`
  );
  res.status(200).send();
});

module.exports = router;
