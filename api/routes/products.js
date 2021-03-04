const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const mongoose = require("mongoose");
const { read } = require("fs");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false);
};
// const upload = multer({ dest: "uploads/" });
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", (req, res, next) => {
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
});

router.post("/", checkAuth, upload.single("productImage"), (req, res, next) => {
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
});

router.get("/:productId", (req, res, next) => {
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
});

router.patch("/:productId", checkAuth, (req, res, next) => {
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
});

router.delete("/:productId", checkAuth, (req, res, next) => {
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
});

module.exports = router;
