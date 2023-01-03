const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readinglist");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);
Session.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "user_reading" });
Blog.belongsToMany(User, { through: ReadingList, as: "blog_reading" });

// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = { Blog, User, ReadingList, Session };
