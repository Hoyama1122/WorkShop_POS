const express = require("express");
const app = express();
const service = require("./Service");
const UserModel = require("../models/UserModel");

app.get("/user/list", service.isLogin, async (req, res) => {
  try {
    const users = await UserModel.findAll({
      where: {
        userId: service.getMemberId(req),
      },
      attributes: ["id", "level", "name", "usr"],
      order: [["id", "DESC"]],
    });
    res.send({ message: "success", result: users });
  } catch (e) {
    res.statu(500).send({ message: e.message });
  }
});

app.post("/user/insert", service.isLogin, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = service.getMemberId(req);
    await UserModel.create(payload);
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/user/delete/:id", service.isLogin, async (req, res) => {
  try {
    const Userid = req.params.id;
    await UserModel.destroy({
      where: {
        id: Userid,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/user/edit", service.isLogin, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = service.getMemberId(req);
    await UserModel.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
