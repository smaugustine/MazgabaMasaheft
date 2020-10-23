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

// GitHub API //
const { Octokit } = require("@octokit/rest")
var GitHub = new Octokit()

// Routes //
app.get('/', function(req, res, next) {
  res.json({"path": "index"})
})

app.get('/works/', function(req, res, next) {
  res.json({"path": "works"})
})

app.get('/works/:id/xml', function(req, res, next) {
  const id = req.params.id
  const clavis = parseInt(id.substring(3))
  const dir = (Math.floor(clavis/1000) * 1000 + 1) + '-' + (Math.ceil(clavis/1000) * 1000)

  GitHub.repos.getContent({
    owner: 'BetaMasaheft',
    repo: 'Works',
    branch: 'master',
    path: dir+'/'+id+'.xml'
  })
  .then(({ data }) => {
    return GitHub.git.getBlob({
      owner: 'BetaMasaheft',
      repo: 'works',
      file_sha: data.sha
    })
  })
  .then(({ data }) => {
    var xmlContent = new Buffer.from(data.content, 'base64')
    xmlContent = xmlContent.toString()
    
    res.render('xmlviewer', {
      xml: xmlContent
    })
  })
})

// Serve //
app.listen(port)