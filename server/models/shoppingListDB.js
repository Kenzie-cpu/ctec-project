const db = require("../db-config/db-connections");

class ShoppingList {
  /*  Get user's shopping list  */
  getAllProduct() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT shopping_product_id, shopping_product_qty 
      FROM shopping_list 
      WHERE shopping_user_id = ?`;

      db.query(sql, [], (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }
}
