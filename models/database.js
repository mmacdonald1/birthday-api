require("dotenv").load();

const { Client } = require("pg");
const DB_URL = process.env.DB_URL;
const client = new Client(DB_URL);

// connect to postgresql instance using pg library
async function doStuff() {
  await client.connect();
  var res = await client.query(
    // "CREATE DATABASE foo"
    `CREATE TABLE friends (
      id	INTEGER,
      name	TEXT,
      phone	TEXT,
      birthday	TEXT,
      user_id	INTEGER,
      PRIMARY KEY(id)
    );
    `
    // CREATE TABLE users (
    //   id	INTEGER,
    //   name	TEXT,
    //   phone	TEXT
    // )
    // "CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)"
  );
  res.rows.forEach(row => {
    console.log(row);
  });
  console.log("has run");
  await client.end();
  //   client.connect();
  //   const query = client.query(
  //     "CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)"
  //   );
  //   query("end", () => {
  //     client.end();
  //   });
}
doStuff();
