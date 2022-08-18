const express = require("express");
const router = express.Router();

const {
  getAllProduct,
  getProductById,
} = require("../controllers/productController");

router.get("/getAllProduct", getAllProduct);
router.get("/:productId", getProductById);

module.exports = router;
