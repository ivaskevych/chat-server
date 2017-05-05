const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const router = express.Router();
const router = require("./router");
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");
mongoose.connect("mongodb://test_api:111111@ds029381.mlab.com:29381/react-chat_db");
// mongoose.connect("mongodb://127.0.0.1:27017/react-chat_db");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// router.use(routes)
app.use('/api', router);

app.listen(port, (err) => {
  if(err) {
    return console.log('Something went wrong!...')
  }
  console.log('Server is listening on http://localhost:' + port)
})
