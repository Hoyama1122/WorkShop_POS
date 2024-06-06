const express = require("express");
const app = express();
const ProductModel = require("../models/ProductModel");
const service = require("./Service");
const cors = require("cors");

app.use(cors());
app.use(express.json());

//! insert Prodcut
app.post("/product/insert", service.isLogin, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId = service.getMemberId(req);

    const result = await ProductModel.create(payload);
    res.send({ result: result, message: "success" });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});

//! update Product
app.post("/product/update", service.isLogin, async (req, res) => {
  try {
    let payload = req.body;
    payload.userId= service.getMemberId(req)
    await ProductModel.update(payload, {
      where: {
        id: req.body.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});

// ! list ProducT
app.get("/product/list", service.isLogin, async (req, res) => {
  try {
    const result = await ProductModel.findAll({
      order: [["id", "DESC"]],
    });
    res.send({ result: result, message: "success" });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});

//! delete Product
app.delete("/product/delete/:id", service.isLogin, async (req, res) => {
  try {
    await ProductModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send({ message: "success" });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
});

//! info List product
app.get("/product/listForSale", service.isLogin, async (req, res) => {
  const ProductImageModel = require("../models/ProductImangeModel");
  ProductModel.hasMany(ProductImageModel);

  try {
    const result = await ProductModel.findAll({
      order: [["id", "desc"]],
      include: {
        model: ProductImageModel,
        where: {
          isMain: true,
        },
      },
    });
    res.send({ message: "success", result: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
module.exports = app;
