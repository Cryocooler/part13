const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { response } = require("../app");
const { Blog, User } = require("../models");
const { SECRET } = require("../util/config");

// middleware for findbyPK
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

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
  const blogs = await Blog.findAll({ include: { model: User } });
  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  res.json(req.blog);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blogToDelete = await Blog.findByPk(req.params.id);

  if (!blogToDelete) {
    return res.status(400).json({ error: "undefined blog" });
  }
  if (blogToDelete.userId !== user.id) {
    return res.status(401).json({ error: "unauthorized deletion" });
  }
  await blogToDelete.destroy();
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
  const body = req.body;

  if (req.blog) {
    req.blog.likes = body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).send({ error: "id doesn't exist in database" });
  }
});

module.exports = router;
