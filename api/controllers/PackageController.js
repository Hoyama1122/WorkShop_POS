const express = require("express");
const app = express();
const PackageModel = require("../models/PackageModel");
const MemberModel = require("../models/MemberModel");
const BankModel = require("../models/BankModel");
const service = require("./Service");

app.get("/package/list", async (req, res) => {
  try {
    const results = await PackageModel.findAll({
      order: ["price"],
    });

    res.send({ results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/package/memberRegister", async (req, res) => {
  try {
    const result = await MemberModel.create(req.body);
    res.send({ message: "success", result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/package/countBill", service.isLogin, async (req, res) => {
  try {
    const BillSaleModel = require("../models/BillsaleModel");
    
    const { Sequelize } = require("sequelize");
    const Op = Sequelize.Op;
  
    const Mydate = new Date();
    const m = Mydate.getMonth() + 1;

    const userId = service.getMemberId(req);

    const result = await BillSaleModel.findAll({
      where: {
        userId: userId,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn(
              "EXTRACT",
              Sequelize.literal('MONTH FROM "createdAt"')
            ),
            m
          ),
        ],
      },
    });
    res.send({ totalBill: result.length });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
