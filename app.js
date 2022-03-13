const express = require('express')

const app = express()

const path = require('path')

app.set('views',path.join(__dirname, 'src', 'views'))

app.set('view engine', 'hbs')

app.get('/', function (req, res) {
  res.render('index.hbs')
})

app.listen(3000)