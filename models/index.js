const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readinglist");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "user_reading" });
Blog.belongsToMany(User, { through: ReadingList, as: "blog_reading" });
ReadingList.belongsToMany(User, { through: ReadingList });

// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = { Blog, User, ReadingList };
