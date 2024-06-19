const express = require("express");
const app = express();
const service = require("./Service");

const StockModel = require("../models/StockModel");
const { where } = require("sequelize");

app.post("/stock/save", service.isLogin, async (req, res) => {
  try {
    const userId = service.getMemberId(req);
    let payload = {
      qty: req.body.qty,
      productId: req.body.productId,
      userId: userId,
    };

    await StockModel.create(payload);

    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get("/stock/list", service.isLogin, async (req, res) => {
  try {
    const userId = service.getMemberId(req);

    const ProductModel = require("../models/ProductModel");
    StockModel.belongsTo(ProductModel);

    const result = await StockModel.findAll({
      where: {
        userId: userId,
      },
      order: [["id", "desc"]],
      include: {
        model: ProductModel,
      },
    });

    res.send({ message: "success", result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.delete("/stock/delete/:id", service.isLogin, async (req, res) => {
  try {
    const deleteid = req.params.id;
    await StockModel.destroy({
      where: {
        id: deleteid,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});

app.get("/stock/report", service.isLogin, async (req, res) => {
  try {
    const ProductModel = require("../models/ProductModel");
    const BillSaleDetailModel = require("../models/BillSaleDetailModel");

    const userId = service.getMemberId(req);

    ProductModel.hasMany(StockModel);
    ProductModel.hasMany(BillSaleDetailModel);

    let arr = [];
    const results = await ProductModel.findAll({
      include: [
        {
          model: StockModel,
        },
        {
          model: BillSaleDetailModel,
        },
      ],
      where: {
        userId: userId,
      },
    });

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const stocks = result.stocks || [];
      const billsaledetails = result.billsaledetails || [];

      let stockIn = 0;
      let stockOut = 0;

      for (let j = 0; j < stocks.length; j++) {
        const item = stocks[j];
        stockIn += parseInt(item.qty);
      }
      for (let j = 0; j < billsaledetails.length; j++) {
        const item = billsaledetails[j];
        stockOut += parseInt(item.qty);
      }
      arr.push({
        product: result,
        stockIn: stockIn,
        stockOut: stockOut,
      });
    }

    res.send({ message: "success", result: arr });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
