const mysql = require("mysql2");

//used pool instead to reuse the connections instead of creating and killing the connection over and over
const pool = mysql.createPool({
  user: "root",
  host: "localhost",
  password: "password",
  database: "coffee_expresso",
  connectionLimit: 10,
});

module.exports = pool;

exports.escape = pool.escape;
