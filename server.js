require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('./config.json')
const port = process.env.PORT;
const User = require('./models/user');


app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

router.get("/",function(req,res){
  res.json({"error" : false, "message" : "Hello World"});
});

router.route("/users")
.get((req, res) => {
  let response = {};
  User.find({}, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"}
    }
    response = {"error" : false, "users" : data}

    res.json(response)
  })
})
.post((req, res) => {
  let newUser = User({
    username : req.body.username,
    password : req.body.password
  });

  let response = {};

  newUser.save((err) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to add User"}
    }
    response = {"error" : false, "message" : "User added successfully"}
    res.json(response)
  })
})

router.route("/users/:id")
.get((req,res) => {
  let response = {};
  User.findById(req.params.id, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
    } else {
      response = {"error" : false, "user" : data};
    }
    res.json(response);
  })
})
.put((req,res) => {
  let response = {};
  User.findById(req.params.id, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
    } else {
      if(req.body.username !== undefined) {
        data.username = req.body.username;
      }
      if(req.body.password !== undefined) {
        data.password = req.body.password;
      }
      data.save((err) => {
        if(err) {
          response = {"error" : true, "message" : "Failed to update data"};
        } else {
          response = {"error" : false, "message" : "Data is updated for " + req.params.id};
        }
        res.json(response);
      })
    }
  })
})
.delete((req,res) => {
  let response = {};
  User.findById(req.params.id, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
    } else {
      User.remove({_id : req.params.id}, (err) => {
        if(err) {
          response = {"error" : true, "message" : "Failed to delete data"};
        } else {
          response = {"error" : true, "message" : "Data associated with " + req.params.id + "is deleted"};
        }
        res.json(response);
      })
    }
  })
})

app.use('/', router);

app.listen(port, (err) => {
  if(err) {
    return console.log('Something went wrong!...')
  }
  console.log('Server is listening on http://localhost:' + port)
})
