const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const service = require("./Service");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone to Thailand
dayjs.tz.setDefault("Asia/Bangkok");

const BillSaleModel = require("../models/BillsaleModel");
const BillSaleDetailModel = require("../models/BillSaleDetailModel");
const { now } = require("sequelize/lib/utils");

//  !check login status
app.get("/billSale/openBill", service.isLogin, async (req, res) => {
  try {
    const userId = service.getMemberId(req);
    const status = "open";

    let result = await BillSaleModel.findOne({
      where: {
        userId: userId,
        status: status,
      },
    });

    if (result == null) {
      result = await BillSaleModel.create({ userId: userId, status: status });
    }

    res.send({ message: "success", result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

//  !item sale
app.post("/billSale/sale", service.isLogin, async (req, res) => {
  try {
    const userId = service.getMemberId(req);
    const status = "open";

    const currentBill = await BillSaleModel.findOne({
      where: { userId: userId, status: status },
    });

    const item = {
      price: req.body.price,
      productId: req.body.id,
      billSaleId: currentBill.id,
      userId: userId,
    };

    const BillSaleDetail = await BillSaleDetailModel.findOne({
      where: item,
    });

    if (!BillSaleDetail) {
      item.qty = 1;
      await BillSaleDetailModel.create(item);
    } else {
      BillSaleDetail.qty++;
      await BillSaleDetailModel.update(
        { qty: BillSaleDetail.qty },
        {
          where: { id: BillSaleDetail.id },
        }
      );
    }

    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// !Fetch current bill info
app.get("/billSale/currentBillinfo", service.isLogin, async (req, res) => {
  try {
    const ProductModel = require("../models/ProductModel");

    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const result = await BillSaleModel.findOne({
      where: {
        status: "open",
        userId: service.getMemberId(req),
      },
      include: {
        model: BillSaleDetailModel,
        order: [["id", "desc"]],
        include: {
          model: ProductModel,
          attributes: ["name"],
        },
      },
    });
    res.send({ result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// !Delete bill item
app.delete("/billSale/deleteItem/:id", service.isLogin, async (req, res) => {
  try {
    await BillSaleDetailModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// !Update bill quantity
app.post("/billSale/updateQty", service.isLogin, async (req, res) => {
  try {
    await BillSaleDetailModel.update(
      {
        qty: req.body.qty,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// !End sale
app.get("/billSale/EndSale", service.isLogin, async (req, res) => {
  try {
    const userId = service.getMemberId(req);
    const updated = await BillSaleModel.update(
      {
        status: "pay",
      },
      {
        where: {
          status: "open",
          userId: userId,
        },
      }
    );
    if (updated[0] > 0) {
      res.send({ message: "success" });
    } else {
      res.status(400).send({ message: "No open bill found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// !Fetch last bill
app.get("/billSale/lastBill", service.isLogin, async (req, res) => {
  try {
    const ProductModel = require("../models/ProductModel");
    const userId = service.getMemberId(req);
    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const result = await BillSaleModel.findOne({
      where: {
        status: "pay",
        userId: userId,
      },
      order: [["id", "desc"]],
      limit: 1,
      include: {
        model: BillSaleDetailModel,
        attributes: ["qty", "price"],
        include: {
          model: ProductModel,
          attributes: ["barcode", "name"],
        },
      },
    });
    if (result) {
      res.send({ message: "success", result: result });
    } else {
      res.send({ message: "success", result: [] });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// !Fetch today bills
app.get("/billSale/billToday", service.isLogin, async (req, res) => {
  try {
    const ProductModel = require("../models/ProductModel");
    const userId = service.getMemberId(req);

    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const now = dayjs().tz("Asia/Bangkok");
    const startDate = now.startOf("day");
    const endDate = now.endOf("day");

    const { Sequelize } = require("sequelize");
    const Op = Sequelize.Op;

    const result = await BillSaleModel.findAll({
      where: {
        status: "pay",
        userId: userId,
        createdAt: {
          [Op.between]: [startDate.toISOString(), endDate.toISOString()],
        },
      },
      order: [["id", "desc"]],
      include: {
        model: BillSaleDetailModel,
        attributes: ["qty", "price"],
        include: {
          model: ProductModel,
          attributes: ["barcode", "name"],
        },
      },
    });

    res.send({ message: "success", result: result });
  } catch (e) {
    console.error("Error occurred:", e.message);
    res.status(500).send({ message: e.message });
  }
});

// !Fetch List bill
app.get("/billSale/list", service.isLogin, async (req, res) => {
  try {
    const BillSaleDetailModel = require("../models/BillSaleDetailModel");
    const ProductModel = require("../models/ProductModel");

    BillSaleModel.hasMany(BillSaleDetailModel);
    BillSaleDetailModel.belongsTo(ProductModel);

    const result = await BillSaleModel.findAll({
      order: [["id", "desc"]],
      where: {
        status: "pay",
      },
      include: {
        model: BillSaleDetailModel,
        include: {
          model: ProductModel,
        },
      },
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get(
  "/billSale/listByYearAndMonth/:year/:month",
  service.isLogin,
  async (req, res) => {
    try {
      let arr = [];
      let y = req.params.year;
      let m = req.params.month;
      let dayInMonth = new Date(y, m, 0).getDate();

      for (let i = 1; i <= dayInMonth; i++) {
        const result = await BillSaleModel.findAll({
          where: {
                
          },
        });
        arr.push({
          day: i ,
          result:result
        })
      }
      res.send({ message: "success", result: arr });
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  }
);
module.exports = app;
