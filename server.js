require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('./config.json')
const port = process.env.PORT;
const User = require('./models/user');
const Message = require('./models/message');

const mongoose = require("mongoose");
mongoose.connect('mongodb://test_api:111111@ds029381.mlab.com:29381/react-chat_db');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

router.get("/",function(req,res){
  res.json({"error" : false, "message" : "Hello World"});
});

router.route("/users")
.get((req, res) => {
  let response = {};
  User.find({}, { __v: 0, password: 0 }, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"}
    }
    response = {"error" : false, "message" : data}

    res.json(response)
  })
})
.post((req, res) => {
  User.findOne({ "username": req.body.username }, (err, user) => {
  let response = {};
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"}
      res.json(response)
    }
    if(user){
      response = {"error" : true, "message" : "Username: '" + req.body.username + "'' already exist"}
      res.json(response)
    } else {
      let password = require('crypto')
                    .createHash('sha1')
                    .update(req.body.password)
                    .digest('base64');

      let newUser = User({
        username : req.body.username,
        password : password
      })

      newUser.save((err) => {
        if(err) {
          response = {"error" : true, "message" : "Failed to add User"}
        }
        response = {"error" : false, "message" : "User: '" + req.body.username + "' added successfully"}
        res.json(response)
      })
    }
  })
})

router.route("/users/:id")
.get((req,res) => {
  let response = {};
  User.findById(req.params.id, { __v: 0, password: 0 }, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
    } else {
      response = {"error" : false, "message" : data};
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
        data.password = require('crypto')
                        .createHash('sha1')
                        .update(req.body.password)
                        .digest('base64');
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
          response = {"error" : false, "message" : "Data associated with " + req.params.id + " is deleted"};
        }
        res.json(response);
      })
    }
  })
})

router.route("/messages")
.get((req, res) => {
  let response = {};
  Message.find({}, { __v: 0 }, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"}
    }
    response = {"error" : false, "message" : data}

    res.json(response)
  })
})
.post((req, res) => {
  //params from body request
  let newMessage = Message({
    msg: req.body.msg,
    user: {
      username: req.body.username
    },
    chatId: req.body.chatId
  });

  let response = {};

  newMessage.save((err) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to add Message"}
    }
    response = {"error" : false, "message" : "Message added successfully"}
    res.json(response)
  })
})

router.route("/messages/:id")
.get((req,res) => {
  let response = {};
  Message.findById(req.params.id, { __v: 0 }, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
    } else {
      response = {"error" : false, "message" : data};
    }
    res.json(response);
  })
})
.put((req,res) => {
  let response = {};
  Message.findById(req.params.id, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
    } else {
      if(req.body.msg !== undefined) {
        data.msg = req.body.msg;
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
  Message.findById(req.params.id, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
    } else {
      Message.remove({_id : req.params.id}, (err) => {
        if(err) {
          response = {"error" : true, "message" : "Failed to delete data"};
        } else {
          response = {"error" : false, "message" : "Data associated with " + req.params.id + " is deleted"};
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
