const express = require("express");
const app = express();
const service = require("./Service");

const StockModel = require("../models/StockModel");

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

    ProductModel.hasMany(StockModel, { foreignKey: "productId" });
    ProductModel.hasMany(BillSaleDetailModel, { foreignKey: "productId" });

    let arr = [];
    const result = await ProductModel.findAll({
      include: [
        {
          model: StockModel,
          where: { userId: userId },
          required: false,
        },
        {
          model: BillSaleDetailModel,
          where: { userId: userId },
          required: false,
        },
      ],
    });

    result.forEach((product) => {
      const stocks = product.StockModels || [];
      const billSaleDetails = product.BillSaleDetailModels || [];

      let stockIn = 0;
      let stockOut = 0;

      stocks.forEach((stock) => {
        stockIn += parseInt(stock.qty);
      });

      billSaleDetails.forEach((billSaleDetail) => {
        stockOut += parseInt(billSaleDetail.qty);
      });

      arr.push({
        product: product,
        stockIn: stockIn,
        stockOut: stockOut,
      });
    });

    res.send({ message: "success", result: arr });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
