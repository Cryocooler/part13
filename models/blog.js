const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Blog extends Model {}

// const yearConstraints(value) => {
//   if (value < 1991) {
//     throw new Error("year must be greater than 1991")
//   } else if (value >= new Date().getFullYear()) {
//     throw new Error("year must be less than current year")
//   }
// }

Blog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1991,
        max: new Date().getFullYear(),
      },
      default: false,
    },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

module.exports = Blog;
