const router = require("express").Router();
const { Op } = require("sequelize");
const { sequelize } = require("../util/db");
const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await sequelize.query(
    "SELECT author, count(title) blogs, SUM(LIKES)likes FROM BLOGS GROUP BY AUTHOR ORDER BY likes DESC",
    {
      model: Blog,
    }
  );
  res.json(blogs);
});

module.exports = router;
