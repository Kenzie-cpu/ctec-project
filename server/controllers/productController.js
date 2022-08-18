const ProductDB = require("../models/productDB");

var productDB = new ProductDB();

module.exports = {
  getProductById: async (req, res, next) => {
    try {
      const productId = req.params.productId;
      console.log(productId);
      const sqlResult = await productDB.getProductById(productId);
      if (!sqlResult) {
        return res.json({
          success: 0,
          message: "No products found",
        });
      }
      res.locals.result = sqlResult;
      return res.json({
        success: 1,
        result: sqlResult,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllProduct: async (req, res, next) => {
    try {
      console.log("getAllProduct invoked");
      const sqlResult = await productDB.getAllProduct();
      console.log(sqlResult);
      if (!sqlResult) {
        return res.json({
          success: 0,
          message: "No products found",
        });
      }
      res.locals.productResult = sqlResult;
      console.log(sqlResult);
      return res.json({
        success: 1,
        result: sqlResult,
      });
    } catch (error) {
      next(error);
    }
  },
};
