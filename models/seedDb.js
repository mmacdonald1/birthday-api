require("dotenv").load();

const { Pool } = require("pg");
const DB_URL = process.env.DB_URL;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

// seed tables with mock data
function seedData() {
  pool.query(
    "INSERT INTO users (id, name, phone) VALUES (DEFAULT, $1, $2)",
    ["Eric", "240-666-4765"],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(`User added with `, results);
    }
  );
  pool.query(
    "INSERT INTO friends (id, name, phone, birthday, user_id) VALUES (DEFAULT, $1, $2, $3, $4)",
    ["Evan", "240-666-4765", "02-02-1994", 1],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(`Friend added with `, results);
    }
  );
}
seedData();
