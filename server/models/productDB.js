const db = require("../db-config/db-connections");

class Product {
  /*  Get all products */
  getAllProduct() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT product_name, product_price, product_image_path FROM product_listing`;

      db.query(sql, [], (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }

  /*  Find User by Id */
  getProductById(product_id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT product_region, product_name, product_price, product_flavour_profile, product_type, product_num_visited
        FROM product_listing 
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
