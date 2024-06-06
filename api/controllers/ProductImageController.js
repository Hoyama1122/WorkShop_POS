const express = require("express");
const app = express();
const service = require("./Service");
const ProductImageModel = require("../models/ProductImangeModel");
const fileUpload = require("express-fileupload");
const fs = require("fs");
app.use(fileUpload());
app.use(express.json()); // Add this to handle JSON payloads properly


app.get("/productImage/list/:productId", service.isLogin, async (req, res) => {
  const { productId } = req.params;
  if (!productId || productId === "undefined") {
    return res
    .status(400)
    .send({ message: "Product ID is required and cannot be undefined" });
  }
  
  try {
    const results = await ProductImageModel.findAll({
      where: { productId },
      order: [["id", "desc"]],
    });
    res.send({ message: "success", results });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.get( "/productImage/choseMainImage/:id/:productId",
  service.isLogin,
  async (req, res) => {
    try {
      const { id, productId } = req.params;
      if (!id || !productId) {
        return res
        .status(400)
        .send({ message: "ID and Product ID are required" });
      }
      
      await ProductImageModel.update(
        { isMain: false },
        {
          where: { productId },
        }
      );
      
      await ProductImageModel.update(
        { isMain: true },
        {
          where: { id },
        }
      );
      
      res.send({ message: "success" });
    } catch (e) {
      res.status(500).send({ message: e.message || "An error occurred" });
    }
  }
);

app.delete("/productImage/delete/:id", service.isLogin, async (req, res) => {
  try {
    const row = await ProductImageModel.findByPk(req.params.id);
    if (!row) {
      return res.status(404).send({ message: "Product image not found" });
    }
    const imageName = row.imageName;
    await ProductImageModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    fs.unlinkSync("uploads/" + imageName);
    
    res.send({ message: "success" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/productImage/insert", service.isLogin, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).send({ message: "Product ID is required" });
    }

    const myDate = new Date();
    const y = myDate.getFullYear();
    const m = myDate.getMonth() + 1;
    const d = myDate.getDate();
    const h = myDate.getHours();
    const mm = myDate.getMinutes();
    const s = myDate.getSeconds();
    const ms = myDate.getMilliseconds();
    const random = Math.random() * 1000;

    const productImage = req.files.productImage;
    const newName = `${y}-${m}-${d}-${h}-${mm}-${s}-${ms}-${random}`;
    const arr = productImage.name.split(".");
    const ext = arr[arr.length - 1];
    const fullNewName = `${newName}.${ext}`;

    const uploadPath = `${__dirname}/../uploads/${fullNewName}`;

    productImage.mv(uploadPath, async (err) => {
      if (err) return res.status(500).send({ message: err.message });

      try {
        await ProductImageModel.create({
          isMain: false,
          imageName: fullNewName,
          productId: productId,
        });
        res.send({ message: "success" });
      } catch (dbErr) {
        res.status(500).send({ message: dbErr.message });
      }
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = app;
