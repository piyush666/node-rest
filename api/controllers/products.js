const Product = require("../models/products");
const mongoose = require("mongoose");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .limit()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      read.status(500).json({
        error: err,
      });
    });
  //   res.status(200).json({
  //     message: "Handling GET requests to /products",
  //   });
};

exports.products_create_product = (req, res, next) => {
  //   const product = {
  //     name: req.body.name,
  //     price: req.body.price,
  //   };

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.product_get_single_product = (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "no data found for provided id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  //   if (id === "special") {
  //     res.status(200).json({
  //       message: "You discovered the special ID",
  //       id: id,
  //     });
  //   } else {
  //     res.status(200).json({
  //       message: "You passed an ID",
  //     });
  //   }
};
exports.product_update_product = (req, res, next) => {
  const updateOps = {};
  Object.keys(req.body).forEach((key) => {
    updateOps[key] = req.body[key];
  });
  //   for (const ops of req.body) {
  //     updateOps[ops.name] = ops.value;
  //   }
  Product.updateOne({ _id: req.params.productId }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.product_delete_product = (req, res, next) => {
  Product.remove({ _id: req.params.productId })
    .exec()
    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "no data found for provided id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  //   res.status(200).json({
  //     message: "Deleted product!",
  //   });
};
