import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
  user: "postgres",
  password: "H5WEAHYYH53AM44E",
  host: "localhost",
  port: "3000",
  database: "D4C",
});

export default pool;
