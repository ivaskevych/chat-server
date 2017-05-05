const router = require('express').Router();
const Message = require('../models/message');

router.route("/messages")
.get((req, res) => {
  let response = {};
  Message.find({}, { __v: 0 }, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"}
    }
    response = {"error" : false, "message" : data}
    return res.json(response)
  })
})
.post((req, res) => {
  //params from body request TODO validation
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
    return res.json(response)
  })
})

router.route("/messages/:id")
.get((req,res) => {
  let response = {};
  Message.findById(req.params.id, { __v: 0 }, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
      return res.json(response);
    }
    if(!data) {
      response = {"error" : true, "message" : "Found no message with ID: " + req.params.id};
    } else {
      response = {"error" : false, "message" : data};
    }
    return res.json(response);
  })
})
.put((req,res) => {
  let response = {};
  Message.findById(req.params.id, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
      return res.json(response);
    }
    if(!data) {
      response = {"error" : true, "message" : "Found no message with ID: " + req.params.id};
      return res.json(response);
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
        return res.json(response);
      })
    }
  })
})
.delete((req,res) => {
  let response = {};
  Message.findById(req.params.id, (err, data) => {
    if(err) {
      response = {"error" : true, "message" : "Failed to fetch data"};
      return res.json(response);
    }
    if(!data) {
      response = {"error" : true, "message" : "Found no message with ID: " + req.params.id};
      return res.json(response);
    } else {
      Message.remove({_id : req.params.id}, (err) => {
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