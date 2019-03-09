require("dotenv").load();
// dependecies and global variables
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
// data
let nextBirthdayId = 3;
let birthdays = [
  {
    id: 1,
    name: "Kevin",
    phone: "222-222-2222",
    birthday: "03-11-1994"
  },
  {
    id: 2,
    name: "Melanie",
    phone: "222-722-2222",
    birthday: "08-01-1994"
  },
  {
    id: 3,
    name: "Chris",
    phone: "222-222-2422",
    birthday: "05-21-1994"
  }
];

// setting inputs to json and setting views directory shortcut
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// GET all birthdays
app.get("/birthdays", (req, res) => {
  res.json(birthdays);
});

// Get a birthday by id
app.get("/birthdays/:id", (req, res) => {
  let birthdayId = parseInt(req.params.id);
  let birthdayPerson = birthdays.filter(birthday => birthday.id === birthdayId);
  birthdayPerson ? res.json(birthdayPerson) : res.status(404).send();
});

function isString(value) {
  return typeof value === "string";
}
//Post a birthday
app.post("/birthdays", (req, res) => {
  let body = req.body;
  if (
    !isString(body.name) ||
    !isString(body.phone) ||
    !isString(body.birthday)
  ) {
    res.status(400).send();
  }
  body.id = nextBirthdayId++;
  birthdays.push(body);
  res.json(body);
});

// Delete /birthdays/:id
app.delete("/birthdays/:id", (req, res) => {
  let birthdayId = parseInt(req.params.id);
  let birthdayPerson = birthdays.filter(birthday => birthday.id === birthdayId);
  birthdays = birthdays.filter(birthday => birthday.id !== birthdayId);
  console.log(birthdays);

  birthdayPerson ? res.json(birthdayPerson) : res.status(404).send();
});

// Put /birthdays/:id
app.put("/birthdays/:id", (req, res) => {
  let birthdayId = parseInt(req.params.id);
  let birthdayPerson = birthdays.filter(birthday => birthday.id === birthdayId);

  let indexToUpdate = birthdays.indexOf(birthdayPerson);
  let updatedPerson = {
    id: req.params.id,
    name: req.body.name,
    phone: req.body.phone,
    birthday: req.body.birthday
  };

  // manipulates birthdays. will not work with postgresql
  birthdays.splice(indexToUpdate, 1, updatedPerson);
});

//telling app which port to run on
app.listen(port, () => console.log(`Listening on port ${port}`));
