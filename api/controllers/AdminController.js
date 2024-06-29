const express = require("express");
const app = express();
const AdminModel = require("../models/AdminModel");
const jwt = require('jsonwebtoken');
const service = require('./Service');

app.use(express.json());

app.post("/admin/signin", async (req, res) => {
  try {
    const admin = await AdminModel.findOne({
      where: {
        usr: req.body.usr,
        psd: req.body.psd,
      },
    });

    if (admin) {
      let token = jwt.sign({ id: admin.id }, process.env.SECRET);
      return res.send({ token: token, message: "success" });
    }
    return res.status(404).send({ message: "not found" });
  } catch (e) {
    return res.status(500).send({ msg: e.message });
  }
});

app.get('/admin/info', service.isLogin, async (req, res) => {
  try {
    const adminId = service.getadminId(req);
    const admin = await AdminModel.findByPk(adminId, {
      attributes: ["id", "name", "level"], 
    });
    if (admin) {
      return res.send({ admin: admin, message: "success" });
    }
    return res.status(404).send({ message: "not found" });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});

module.exports = app;
