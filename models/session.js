const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_disabled: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    created_at: { type: DataTypes.DATE },
  },
  { sequelize, underscored: true, modelName: "session", timestamps: false }
);

module.exports = Session;
