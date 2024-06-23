const express = require("express");
const app = express();
const service = require("./Service");

app.get("/bank/list", service.isLogin, async (req, res) => {
  try {
    const BankModel = require("../models/BankModel");
    const results = await BankModel.findAll();
    res.send({ results: results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
