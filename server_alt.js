require('dotenv').config();

// const path = require('path');
// const exhbs = require('express-handlebars');
// const MongoClient = require('mongodb').MongoClient;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('./config.json')
const port = process.env.PORT;

//Connection to db Promise
// const mongoConnected = new Promise((res, rej) => {
//     MongoClient.connect(config.mongodb_url, (err, db) => {
//         if (err) rej(err)
//         console.log('Connected correctly to server')
//         res(db)
//     })
// })
//
// mongoConnected.catch(err => console.error(err.stack))
// module.exports = mongoConnected
//separate file

// app.engine('.hbs', exhbs({
//     defaultLayout: 'main',
//     extname: '.hbs',
//     layoutsDir: path.join(__dirname, 'views/layouts')
// }))
//
// app.set('view engine', '.hbs')
// app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

//mongo db Route requests
mongoConnected.then((db) => {
    db.collection('users').find({}).toArray((err, msg) => {
        console.log(msg)
    })
})

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/home', (req, res) => {
    // res.render('home', {
    //     message: 'Welcome to Home page!'
    // })
    mongoConnected.then(db => {
		db.collection('users').insert({'username':'test', 'pass':'testpass'})
        db
          .collection('users')
          .find({}).toArray((err, msg) => {
            res.render('home', {
                message: msg[0].username
            })
           })
      })
})

app.get('/about', (req, res) => {
    mongoConnected.then(db => {
        db
          .collection('users')
          .remove({"username":"test"})
      })
     res.render('about', {
         message: 'Welcome to About page!'
     })
})

app.get('/delete/:username', (req, res) => {
    mongoConnected.then(db => {
        db
          .collection('users')
          .remove({"username": req.params.username})
      })
     res.render('about', {
         message: req.params.username + ' Deleted'
     })
})

app.get('*', (req, res) => {
    res.end('404...')
})

app.listen(port, (err) => {
    if(err) {
        return console.log('Something went wrong!...')
    }
    console.log('Server is listening on http://localhost:' + port)
})
