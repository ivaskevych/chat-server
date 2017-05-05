const router = require('express').Router();
const User = require('../models/user');

router.route("/users")
.get((req, res) => {
  let response = {};
  User.find({}, { __v: 0, password: 0 }, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"}
    }
    response = {"error" : false, "message" : data}

    return res.json(response)
  })
})
.post((req, res) => {
  User.findOne({ "username": req.body.username }, (err, user) => {
  let response = {};
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"}
      return res.json(response)
    }
    if(user) {
      response = {"error" : true, "message" : "Username: '" + req.body.username + "'' already exist"}
      return res.json(response)
    } else if(!req.body.username || !req.body.password) {
      response = {"error" : true, "message" : "Provide valid username and password"}
      return res.json(response)
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
        return res.json(response)
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
      return res.json(response);
    }
    if(!data) {
      response = {"error" : true, "message" : "No users with ID: " + req.params.id};
    } else {
      response = {"error" : false, "message" : data};
    }
    return res.json(response);
  })
})
.put((req,res) => {
  let response = {};
  User.findById(req.params.id, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
      return res.json(response);
    }
    if(!data) {
      response = {"error" : true, "message" : "No users with ID: " + req.params.id};
      return res.json(response);
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
        return res.json(response);
      })
    }
  })
})
.delete((req,res) => {
  let response = {};
  User.findById(req.params.id, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
      return res.json(response);
    }
    if(!data) {
      response = {"error" : true, "message" : "No user with ID: " + req.params.id + " to delete"};
      return res.json(response);
    } else {
      User.remove({_id : req.params.id}, (err) => {
        if(err) {
          response = {"error" : true, "message" : "Failed to delete data"};
        } else {
          response = {"error" : false, "message" : "Data associated with " + req.params.id + " is deleted"};
        }
        return res.json(response);
      })
    }
  })
})

module.exports = router;