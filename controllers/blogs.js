const router = require("express").Router();
const { Blog } = require("../models");
const { requestLogger } = require("../util/middleware");

//middleware for findbyPK
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log("blogs retrieved", blogs);
  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  res.json(req.blog);
});

router.get("/lol", async (req, res) => {
  res.send("LOL");
});

router.post("/", async (req, res) => {
  const blog = await Blog.create(req.body);
  return res.json(blog);
});

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).send({ error: "no id found in database" });
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
