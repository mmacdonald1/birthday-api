require("dotenv").load();

const { Client } = require("pg");
const DB_URL = process.env.DB_URL;
const client = new Client(DB_URL);

// create tables
async function createTables() {
  await client.connect();
  var res = await client.query(
    `CREATE TABLE friends (
        ID	SERIAL PRIMARY KEY,
        name	TEXT,
        phone	TEXT,
        birthday	TEXT,
        user_id	INTEGER
      );
    CREATE TABLE users (
      ID	SERIAL PRIMARY KEY,
      name	TEXT,
      phone	TEXT
    );
      `
  );
  await client.end();
}
createTables();
