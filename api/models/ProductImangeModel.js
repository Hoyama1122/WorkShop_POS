const conn = require("../connect"); // Adjust the path as necessary
const { DataTypes } = require("sequelize");

const ProductImageModel = conn.define("productImage", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.BIGINT,
  },
  imageName: {
    type: DataTypes.STRING,
  },
  isMain: {
    type: DataTypes.BOOLEAN,
  },
});

//ProductImageModel.sync({ alter: true });

module.exports = ProductImageModel;
