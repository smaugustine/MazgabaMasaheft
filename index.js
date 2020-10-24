// Express //
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
app.use('/static', express.static('public'))

// Handlebars //
const hbs = require('express-handlebars')
app.engine('.hbs', hbs({extname: '.hbs'}))
app.set('view engine', '.hbs')

// Sass //
const compileSass = require('express-compile-sass')
const root = process.cwd()
app.use(compileSass({
  root: root
}))
app.use(express.static(root))

// Routes //
app.get('/', function(req, res, next) {
  res.json({"path": "index"})
})

const works = require('./routes/works')
app.use('/works', works)

const manuscripts = require('./routes/manuscripts')
app.use('/manuscripts', manuscripts)

// Serve //
app.listen(port)