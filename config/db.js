import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "bphshosknse2qu8m8ml3-mysql.services.clever-cloud.com",
  user: "uqjg30curaeyxn4s",
  password: "ErFXcvM3NaieEYlnaPaE",
  database: "bphshosknse2qu8m8ml3",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
export default pool;
