require("dotenv").load();

// dependecies and global variables
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const port = process.env.PORT || 3000;

// db connection info
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

// setting inputs to json and setting views directory shortcut
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// GET all friends
app.get("/friends", (req, res) => {
  pool.query("SELECT * FROM friends", (err, results) => {
    check(err);
    res.json(results.rows);
  });
});

// Get a friend by id
app.get("/friends/:id", (req, res) => {
  let friendId = parseInt(req.params.id);
  pool.query(
    "SELECT * FROM friends where id = $1",
    [friendId],
    (err, results) => {
      check(err);
      res.json(results.rows);
    }
  );
});

// Post a friend
app.post("/friends", (req, res) => {
  let body = req.body;
  if (
    !isString(body.name) ||
    !isString(body.phone) ||
    !isString(body.birthday) ||
    !isNum(body.userId)
  ) {
    res.status(400).send();
  }

  pool.query(
    "INSERT INTO friends (id, name, phone, birthday, user_id) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id",
    // TODO: replace body.userId with user id from localstorage.
    [body.name, body.phone, body.birthday, body.userId],
    (err, results) => {
      check(err);
      let newPerson = {
        id: results.rows[0].id,
        name: body.name,
        phone: body.phone,
        birthday: body.birthday,
        userId: body.userId
      };
      res.json(newPerson);
    }
  );
});

// Delete /friends/:id
app.delete("/friends/:id", (req, res) => {
  let friendId = parseInt(req.params.id);
  pool.query(
    "DELETE FROM friends where id = $1",
    [friendId],
    (err, results) => {
      check(err);
      res.json(req.params.id);
    }
  );
});

// Put /friends/:id
app.put("/friends/:id", (req, res) => {
  let body = req.body;
  if (
    !isString(body.name) ||
    !isString(body.phone) ||
    !isString(body.birthday)
  ) {
    res.status(400).send();
  }
  let friendId = parseInt(req.params.id);
  pool.query(
    "UPDATE friends SET name = $1, phone = $2, birthday = $3 where id = $4 RETURNING id, user_id",
    [body.name, body.phone, body.birthday, friendId],
    (err, results) => {
      check(err);
      let newPerson = {
        id: results.rows[0].id,
        name: body.name,
        phone: body.phone,
        birthday: body.birthday,
        userId: results.rows[0].user_id
      };
      res.json(newPerson);
    }
  );
});

// user routes

// GET all users
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    check(err);
    res.json(results.rows);
  });
});

// Get a user by id
app.get("/users/:id", (req, res) => {
  let userId = parseInt(req.params.id);
  pool.query("SELECT * FROM users where id = $1", [userId], (err, results) => {
    check(err);
    res.json(results.rows);
  });
});

//Post a user
app.post("/users", (req, res) => {
  let body = req.body;
  if (!isString(body.name) || !isString(body.phone)) {
    res.status(400).send();
  }

  pool.query(
    "INSERT INTO users (id, name, phone) VALUES (DEFAULT, $1, $2) RETURNING id",
    [body.name, body.phone],
    (err, results) => {
      check(err);
      let newUser = {
        id: results.rows[0].id,
        name: body.name,
        phone: body.phone
      };
      res.json(newUser);
    }
  );
});

// Delete /users/:id
app.delete("/users/:id", (req, res) => {
  let userId = parseInt(req.params.id);
  pool.query("DELETE FROM users where id = $1", [userId], (err, results) => {
    check(err);
    res.json(req.params.id);
  });
});

// Put /users/:id
app.put("/users/:id", (req, res) => {
  let body = req.body;
  if (!isString(body.name) || !isString(body.phone)) {
    res.status(400).send();
  }
  let userId = parseInt(req.params.id);
  pool.query(
    "UPDATE users SET name = $1, phone = $2 where id = $3 RETURNING id",
    [body.name, body.phone, userId],
    (err, results) => {
      check(err);
      let newUser = {
        id: results.rows[0].id,
        name: body.name,
        phone: body.phone
      };
      res.json(newUser);
    }
  );
});

//telling app which port to run on
app.listen(port, () => console.log(`Listening on port ${port}`));

// helper funcs
function check(err) {
  if (err) {
    throw err;
  }
}
function isString(value) {
  return typeof value === "string";
}

function isNum(value) {
  return typeof value === "number";
}
