//used pool instead to reuse the connections instead of creating and killing the connection over and over
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "ctec-db.cy3ewmbvdtri.ap-southeast-1.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "ctec-db",
  connectionLimit: 10,
});

module.exports = pool;

exports.escape = pool.escape;
