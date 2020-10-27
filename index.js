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
const GitHub = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
})

// Route - Index //
app.get('/', function(req, res, next) {
  res.render('index')
})

// Redirect - Record //
app.get('/:type/:id', function(req, res, next) {
  res.redirect('/'+req.params.type+'/'+req.params.id+'/main')
})

// Middleware - Type //
app.get('/:type*', function(req, res, next) {

  res.locals.recordType = req.params.type
  if( (!['works', 'manuscripts', 'persons'].includes(res.locals.recordType)) ) throw new Error('Invalid record type. Valid types are: "works", "manuscripts", and "persons".')
  res.locals.RecordType = res.locals.recordType.charAt(0).toUpperCase() + res.locals.recordType.slice(1)

  GitHub.paginate("GET /repos/:owner/:repo/branches", {
    owner: 'BetaMasaheft',
    repo: res.locals.RecordType
  })
  .then(( branches ) => {
    branches = branches.map(branch => branch.name)
    branches.splice(branches.indexOf('master'), 1)

    res.locals.branches = branches
    next()
  })
  .catch(err => {
    next(err)
  })

})

// Middleware - Record //
app.get('/:type/:id/:response', function(req, res, next) {

  res.locals.recordId = req.params.id

  res.locals.branch = 'master'
  if(res.locals.branches.indexOf(req.query.branch) > -1) res.locals.branch = req.query.branch

  res.locals.path = getPath(res.locals.recordId, res.locals.recordType)

  GitHub.repos.getContent({
    owner: 'BetaMasaheft',
    repo: res.locals.RecordType,
    ref: res.locals.branch,
    path: res.locals.path
  })
  .then(({ data }) => {
    return GitHub.git.getBlob({
      owner: 'BetaMasaheft',
      repo: res.locals.RecordType,
      file_sha: data.sha
    })
  })
  .then(({ data }) => {
    var xmlDoc = new Buffer.from(data.content, 'base64')
    xmlDoc = xmlDoc.toString()
    
    res.locals.xmlDoc = xmlDoc

    next()
  })
  .catch(err => {
    next(err)
  })

})

// Route - Record Data //
app.get('/:type/:id/main', function(req, res, next) {

  res.locals.tabs = {
    active: { "data": true },
    images: (res.locals.recordType == 'manuscripts'),
    github: 'https://github.com/BetaMasaheft/'+res.locals.RecordType+'/blob/'+res.locals.branch+'/'+res.locals.path,
    betamasaheft: 'https://betamasaheft.eu/'+res.locals.recordType+'/'+res.locals.recordId+'/main'
  }

  if(res.locals.branch == 'master') res.locals.branch = false

  res.render('data', res.locals)

})

// Route - Record Images //
app.get('/:type/:id/viewer', function(req, res, next) {
  if(res.locals.recordType != 'manuscripts') res.redirect('/'+req.params.type+'/'+req.params.id+'/main')

  res.locals.tabs = {
    active: { "images": true },
    images: true,
    github: 'https://github.com/BetaMasaheft/Manuscripts/blob/'+res.locals.branch+'/'+res.locals.path,
    betamasaheft: 'https://betamasaheft.eu/manuscripts/'+res.locals.recordId+'/viewer'
  }

  if(res.locals.branch == 'master') res.locals.branch = false

  res.render('images', res.locals)

})

// Route - Record XML //
app.get('/:type/:id/xml', function(req, res, next) {

  res.locals.tabs = {
    active: { "xml": true },
    github: 'https://github.com/BetaMasaheft/'+res.locals.RecordType+'/blob/'+res.locals.branch+'/'+res.locals.path,
    betamasaheft: 'https://betamasaheft.eu/tei/'+res.locals.recordId+'.xml'
  }

  if(res.locals.branch == 'master') res.locals.branch = false

  res.render('xml', res.locals)

})

// Route - Type //
app.get('/:type', function(req, res, next) {
  res.render('goto', res.locals)
})


// Error handler //
app.use(function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
})

// Serve //
app.listen(port)

function getPath(id, type) {
  if(type == 'works') return getWorkPath(id)
  else if(type == 'manuscripts') return getManuscriptPath(id)
  else if(type == 'persons') return getPersonPath(id)
  else return false
}

function getWorkPath(id) {
  const clavis = parseInt(id.substring(3))
  return (Math.floor(clavis/1000) * 1000 + 1) + '-' + (Math.ceil(clavis/1000) * 1000) + '/' + id + '.xml'
}

function getManuscriptPath(id) {
  const collection = id.replace(/\d/g, '')
  var thedir = ''

  if(collection.startsWith('BAV')) {
    thedir = 'VaticanBAV/'+collection.substr(3)
  }

  else if(collection.startsWith('BL')) {
    thedir = 'LondonBritishLibrary/'+collection.substr(2)
  }
  
  else if(collection.startsWith('EMIP')) {
    if(collection.substring(4) == 'ms') thedir = 'EMIP/magicscrolls'
    else {
      var idno = parseInt(id.substring(4))
      var dir = (Math.floor(idno/1000) * 1000 + 1) + '-' + (Math.ceil(idno/1000) * 1000)
      thedir = 'EMIP/'+dir
    }
  }

  else if(collection.startsWith('EMML')) {
    var idno = parseInt(id.substring(4))
    var dir = (Math.floor(idno/1000) * 1000 + 1) + '-' + (Math.ceil(idno/1000) * 1000)
    thedir = 'EMML/'+dir
  }

  else if(collection.startsWith('ES')) thedir = 'ES'

  return thedir + '/' + id + '.xml'
}

function getPersonPath(id) {
  const idno = parseInt(id.substring(3))
  return 'PRS' + (Math.floor(idno/1000) * 1000 + 1) + '-' + (Math.ceil(idno/1000) * 1000) + '/' + id + '.xml'
}