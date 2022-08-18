const db = require("../db-config/db-connections");

class ProductDB {
  getAllProduct() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT product_id, product_name, product_price, product_image_path FROM products`;

      db.query(sql, [], (error, results) => {
        if (error) {
          return reject(error);
        }
        console.log("resolve db");
        return resolve(results);
      });
    });
  }

  getProductById(product_id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT product_region, product_name, product_price, product_flavour, product_type, product_description
        FROM products
        WHERE product_id = ?`;

      db.query(sql, [product_id], (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }
}

module.exports = ProductDB;
