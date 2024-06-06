const conn = require("../connect");
const { DataTypes } = require("sequelize");
const BillSaleDetail = conn.define("billsaledetail", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  billSaleId: {
    type: DataTypes.BIGINT,
  },
  productId: {
    type: DataTypes.BIGINT,
  },
  qty: {
    type: DataTypes.BIGINT,
  },
  price: {
    type: DataTypes.BIGINT,
  },
  userId:{
    type:DataTypes.BIGINT
  }
});

//BillSaleDetail.sync({ alter: true });

module.exports = BillSaleDetail;
