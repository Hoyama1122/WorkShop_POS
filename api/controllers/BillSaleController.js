const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const service = require("./Service");

const BillSaleModel = require("../models/BillsaleModel");
const BillSaleDetailModel = require("../models/BillSaleDetailModel");

app.get("/billSale/openBill", service.isLogin, async (req, res) => {
  try {
    const userId = service.getMemberId(req);
    const status = "open";


    let result = await BillSaleModel.findOne({
      where: {
        userId: userId,
        status: status
      }
    });

    if (result == null) {
      result = await BillSaleModel.create({ userId: userId, status: status });
    }

    res.send({ message: "success", result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
