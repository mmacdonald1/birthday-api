// dependecies and global variables
const express = require('express')
const app =  express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

// data
let nextBirthdayId = 3
const birthdays = [{
  'id':1,
  'name':'Kevin',
  'phone':'222-222-2222',
  'birthday':'03-11-1994'
},
{
  'id':2,
  'name':'Melanie',
  'phone':'222-722-2222',
  'birthday':'08-01-1994'
},
{
  'id':3,
  'name':'Chris',
  'phone':'222-222-2422',
  'birthday':'05-21-1994'
},
]

// setting inputs to json and setting views directory shortcut
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

// GET all birthdays
app.get('/birthdays', (req,res)=>{
  res.json(birthdays)
})

// Get a birthday by id
app.get('/birthdays/:id', (req,res)=>{
  let birthdayId =  parseInt(req.params.id)
  let birthdayPerson = birthdays.filter(birthday => birthday.id === birthdayId)
  birthdayPerson ? res.json(birthdayPerson) :  res.status(404).send()
})

//Post a birthday
app.post('/birthdays', (req,res)=>{
  let body = req.body;
  body.id = nextBirthdayId++
  birthdays.push(body)
  res.json(body)
})

//telling app which port to run on 
app.listen(port, ()=>console.log(`Listening on port ${port}`))
