const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const Product = require("../models/products");
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth')
// Handle incoming GET requests to /orders
router.get("/",checkAuth, (req, res, next) => {
  Order.find({})
    .populate({ path: "product", select: { name: 1 } })
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
});

router.post("/", checkAuth,(req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "product in not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
      console.log(err);
    })
    .then((result) => {
      res.status(201).json({
        message: "Order was created",
        order: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:orderId",checkAuth, (req, res, next) => {
  //   res.status(200).json({
  //     message: "Order details",
  //     orderId: req.params.orderId,
  //   });
  const id = req.params.orderId;

  Order.findById(id)
    .populate("product")
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
});

router.delete("/:orderId",checkAuth, (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
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
});

module.exports = router;
