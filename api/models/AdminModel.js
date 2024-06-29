const conn = require("../connect");
const { DataTypes } = require("sequelize");
const AdminModel = conn.define("admin", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
  },
  usr: {
    type: DataTypes.STRING(255),
  },
  psd: {
    type: DataTypes.STRING(255),
  },
  level: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
});
AdminModel.sync({ alter: true });
module.exports = AdminModel;
