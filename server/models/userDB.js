const db = require("../db-config/db-connections");

class userDB {
  /*  Create a new user for sign up */
  newUserRegister(data) {
    return new Promise((resolve, reject) => {
      var now = new Date();
      const sql = `INSERT INTO users (username, first_name, last_name, email, password, type, age, created_on) 
      VALUES (?, ?, ?, ?, ?, 'user', ?, ?)`;

      db.query(
        sql,
        [
          data.username,
          data.firstName,
          data.lastName,
          data.email,
          data.password,
          data.age,
          now,
        ],

        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  }

  /*  Find User by Id */
  getUserById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT username, email, first_name, last_name, age, created_on FROM users WHERE id = ?`;

      db.query(sql, [id], (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }

  /*  Update User */
  updateUser(data, id) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users 
      SET username = ?, first_name = ?, last_name = ?, email = ?, age = ? WHERE id = ?`;

      db.query(
        sql,
        [
          data.username,
          data.firstName,
          data.lastName,
          data.email,
          data.age,
          id,
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  }

  /*  Delete User */
  deleteUser(userId) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM users
        WHERE id = ?`;
      return db.query(sql, [userId], (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }

  //Check password before deleting user
  checkUserPassword(userId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT password FROM users WHERE id = ?`;
      return db.query(sql, [userId], (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  }

  /* Get Email for login */
  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT email, password, id, username, is_deactivated, type
        FROM users 
        WHERE email = ?`;
      db.query(sql, [email], (error, results, fields) => {
        if (error) {
          reject(error);
        }
        return resolve(results);
      });
    });
  }
}

module.exports = userDB;
