const router = require('express').Router();
const users = require('./routes/users');
const messages = require('./routes/messages');

router.get("/",function(req,res){
  res.json({"error" : false, "message" : "Hello World"});
});

router.use(users)
router.use(messages)

module.exports = router;