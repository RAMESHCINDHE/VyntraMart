const express = require("express");
const Product = require("../models/product"); // assuming you have a Product model

const productRouter = express.Router();

// Route handler for adding a new product
productRouter.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// Route handler for getting all products
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// Route handler for getting a single product
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// Route handler for updating a product's quantity
productRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { countInStock } = req.body;

    if (countInStock === 0) {
      // If the quantity is zero, remove the product
      await Product.findByIdAndRemove(id);
      res.status(204).send();
    } else {
      // Otherwise, update the quantity
      const product = await Product.findByIdAndUpdate(
        id,
        { countInStock },
        { new: true }
      );
      res.send(product);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = productRouter;
