const router = require("express").Router();
const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log("blogs retrieved", blogs);
  res.json(blogs);
});

router.get("/lol", async (req, res) => {
  res.send("LOL");
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    await blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", async (req, res) => {
  const body = req.body;
  const blog = await Blog.findByPk(req.params.id);

  if (blog) {
    blog.likes = body.likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
