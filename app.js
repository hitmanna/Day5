const express = require('express')

const app = express()

const { db } = require('./DB')

const path = require('path')

app.use(express.urlencoded( { extended: true}))

app.set('views',path.join(__dirname, 'src', 'views'))

app.set('view engine', 'hbs')

app.get('/',  (req, res) => {
  const catsQuery = req.query.limit
  res.render('index.hbs', {kotiki: db.cats.slice(0, catsQuery)})
  
 })

 app.get('/',  (req, res) => {
  const catsReverse = req.query.reverse
  if (catsReverse == true)
    {res.render('index.hbs', {kotiki: db.cats.reverse()})}
 })

app.get('/', function (req, res) {
  res.render('index.hbs', {kotiki: db.cats})
})


app.post('/catslist', (req, res) => {
  const dataFromForm = req.body

  db.cats.push(dataFromForm)

  res.redirect('/')
})


app.listen(3000)