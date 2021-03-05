const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const productsController = require("../controllers/products");
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

router.get("/", productsController.products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productsController.products_create_product
);

router.get("/:productId", productsController.product_get_single_product);

router.patch(
  "/:productId",
  checkAuth,
  productsController.product_update_product
);

router.delete(
  "/:productId",
  checkAuth,
  productsController.product_delete_product
);

module.exports = router;
