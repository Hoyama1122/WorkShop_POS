const express = require("express");
const MemberModel = require("../models/MemberModel");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const PackageModel = require("../models/PackageModel");
const service = require("./Service");

app.post("/member/signin", async (req, res) => {
  try {
    const member = await MemberModel.findAll({
      where: {
        phone: req.body.phone,
        pass: req.body.pass,
      },
    });

    if (member.length > 0) {
      let token = jwt.sign({ id: member[0].id }, process.env.secret);
      return res.send({ token: token, message: "success" });
    }
    return res.status(404).send({ message: "not found" });
  } catch (e) {
    return res.status(401).send({ msg: e.message });
  }
});

app.get("/member/info", service.isLogin, async (req, res) => {
  try {
    MemberModel.belongsTo(PackageModel);

    const payload = jwt.decode(service.getToken(req));
    const member = await MemberModel.findByPk(payload.id, {
      attributes: ["id", "name"],
      include: [
        {
          model: PackageModel,
          attributes: ["name", "bill_amount"],
        },
      ],
    });
    res.send({ result: member, message: "success" });
    // res.send(service.getToken(req))
  } catch (e) {
    return res.status(401).send({ msg: e.message });
  }
});

app.put("/member/changeProfile", service.isLogin, async (req, res) => {
  try {
    const memberId = service.getMemberId(req);
    const payload = {
      name: req.body.memberName,
    };
    const result = await MemberModel.update(payload, {
      where: {
        id: memberId,
      },
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    return res.status(401).send({ msg: e.message });
  }
});

app.get('/member/list', service.isLogin, async (req, res) => {
  try {
    const PackageModel = require('../models/PackageModel')
    MemberModel.belongsTo(PackageModel)

    const result = await MemberModel.findAll({
      order: [['id', 'desc']],
      attributes: ["id", 'name', 'phone', 'createdAt'],
      include: {
        model: PackageModel
      }
    })
    res.send({ message: "success", result: result })
  } catch (e) {
    return res.status(401).send({ msg: e.message });
  }
}
)

module.exports = app;
