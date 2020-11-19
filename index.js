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

// XPath //
const xpath = require('xpath')
const dom = require('xmldom').DOMParser

// GitHub API //
const { Octokit } = require("@octokit/rest")
const GitHub = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
})

// Route - Index //
app.get('/', function(req, res, next) {
  res.locals.title = "Mazgaba Maṣāḥǝft"
  res.render('index')
})

// Route - Search //
app.get('/search', function(req, res, next) {
  res.locals.title = "Mazgaba Maṣāḥǝft"
  res.locals.subtitle = "Search Records"

  res.locals.query = false
  if(typeof req.query.q !== 'undefined') res.locals.query = req.query.q

  if(typeof req.query.type !== 'undefined') {
    res.locals.recordTypes = req.query.type.split('-')

    var repos = res.locals.recordTypes.map(type => 'repo:BetaMasaheft/'+capitalize(type))
    repos = repos.join('+')
  }

  if(typeof req.query.p !== 'undefined') var page = req.query.p

  if(res.locals.query) {
    GitHub.search.code({
      headers: {
        accept: "application/vnd.github.v3.text-match+json",
      },
      q: res.locals.query + '+in:file+'+repos,
      per_page: 50,
      page: page
    })
    .then(({ data }) => {
      
      res.locals.pagination = {
        currentPage: page,
        lastPage: Math.ceil(data.total_count / 50),
      }
      res.locals.pagination.pages = Array.from(Array(res.locals.pagination.lastPage).keys())

      res.locals.checked = {}
      res.locals.recordTypes.forEach(type => res.locals.checked[type] = true)

      res.locals.resultString = data.total_count + ' results for "' + res.locals.query + '" in ' + res.locals.recordTypes.join(' and ') + ':'
      
      res.locals.results = data.items
      res.locals.results = res.locals.results.map(item => ({
        id: item.name.slice(0, -4),
        type: decapitalize(item.repository.name),
        text_matches: item.text_matches
      }))

      res.render('search', res.locals)
  })
  .catch(err => {
    next(err)
  })

  }

  else res.render('search', res.locals)

})

// Redirect - Record //
app.get('/:type/:id', function(req, res, next) {
  res.redirect('/'+req.params.type+'/'+req.params.id+'/main')
})

// Middleware - Type //
app.get('/:type*', function(req, res, next) {

  res.locals.recordType = req.params.type
  if( (!['works', 'manuscripts', 'persons'].includes(res.locals.recordType)) ) throw new Error('Invalid record type. Valid types are: "works", "manuscripts", and "persons".')
  res.locals.recordType = capitalize(res.locals.recordType)

  GitHub.paginate("GET /repos/:owner/:repo/branches", {
    owner: 'BetaMasaheft',
    repo: res.locals.recordType
  })
  .then(( branches ) => {
    branches = branches.map(branch => branch.name)
    branches.splice(branches.indexOf('master'), 1)
    branches.unshift('master')

    res.locals.branches = branches
    res.locals.title = res.locals.recordType
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
  res.locals.branches = res.locals.branches.map(branch => ({ name: branch, current: (branch == res.locals.branch) }) )

  res.locals.path = getPath(res.locals.recordId, res.locals.recordType)

  GitHub.repos.getContent({
    owner: 'BetaMasaheft',
    repo: res.locals.recordType,
    ref: res.locals.branch,
    path: res.locals.path
  })
  .then(({ data }) => {
    return GitHub.git.getBlob({
      owner: 'BetaMasaheft',
      repo: res.locals.recordType,
      file_sha: data.sha
    })
  })
  .then(({ data }) => {
    var xmlDoc = new Buffer.from(data.content, 'base64')
    xmlDoc = xmlDoc.toString()
    
    res.locals.subtitle = res.locals.recordId
    res.locals.xmlDoc = xmlDoc

    if(res.locals.recordType == 'Manuscripts') {
      const xmlDom = new dom().parseFromString(xmlDoc)
      var select = xpath.useNamespaces({"tei": "http://www.tei-c.org/ns/1.0"})
      var manifest = select('//tei:idno/@facs', xmlDom)[0]
      var imagesUrl = select('//tei:graphic/@url', xmlDom)[0]

      if(typeof manifest != 'undefined') {
        if(manifest.value.includes('gallica')) res.locals.images = { "iiif": manifest.value.replace('ark', 'iiif/ark') + '/manifest.json' }
        else res.locals.images = { "iiif": manifest.value }
      }
      else if(typeof imagesUrl != 'undefined') res.locals.images = { "url": imagesUrl.value }
      else res.locals.images = { "noImages": true }
    }
    else res.locals.images = false

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
    images: res.locals.images,
    github: 'https://github.com/BetaMasaheft/'+res.locals.recordType+'/blob/'+res.locals.branch+'/'+res.locals.path,
    betamasaheft: 'https://betamasaheft.eu/'+decapitalize(res.locals.recordType)+'/'+res.locals.recordId+'/main'
  }

  if(res.locals.branch == 'master') res.locals.branch = false
  res.locals.recordType = decapitalize(res.locals.recordType)

  res.render('data', res.locals)

})

// Route - Record Images //
app.get('/:type/:id/viewer', function(req, res, next) {
  if(res.locals.recordType != 'Manuscripts') res.redirect('/'+req.params.type+'/'+req.params.id+'/main')

  else{
    res.locals.tabs = {
      active: { "images": true },
      images: res.locals.images,
      github: 'https://github.com/BetaMasaheft/Manuscripts/blob/'+res.locals.branch+'/'+res.locals.path,
      betamasaheft: 'https://betamasaheft.eu/manuscripts/'+res.locals.recordId+'/viewer'
    }

    if(res.locals.branch == 'master') res.locals.branch = false

    res.render('images', res.locals)
  }

})

// Route - Record XML //
app.get('/:type/:id/xml', function(req, res, next) {

  res.locals.tabs = {
    active: { "xml": true },
    images: res.locals.images,
    github: 'https://github.com/BetaMasaheft/'+res.locals.recordType+'/blob/'+res.locals.branch+'/'+res.locals.path,
    betamasaheft: 'https://betamasaheft.eu/tei/'+decapitalize(res.locals.recordId)+'.xml'
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

// Utility functions //
function getPath(id, type) {
  if(type == 'Works') return getWorkPath(id)
  else if(type == 'Manuscripts') return getManuscriptPath(id)
  else if(type == 'Persons') return getPersonPath(id)
  else return false
}

function getWorkPath(id) {
  const clavis = parseInt(id.substring(3))
  return (Math.floor(clavis/1000) * 1000 + 1) + '-' + (Math.ceil(clavis/1000) * 1000) + '/' + id + '.xml'
}

function getManuscriptPath(id) {
  const collection = id.replace(/\d/g, '')
  var dir = ''

  if(collection.startsWith('BAV')) {
    dir = 'VaticanBAV/'+collection.substr(3)
  }

  else if(collection.startsWith('Ber')) {
    dir = 'Berlin/'
  }

  else if(collection.startsWith('BL')) {
    dir = 'LondonBritishLibrary/'+collection.substr(2)
  }

  else if(collection.startsWith('BNF')) {
    dir = 'ParisBNF/'+collection.substr(3)
  }
  
  else if(collection.startsWith('EMIP')) {
    if(collection.substring(4) == 'ms') dir = 'EMIP/magicscrolls'
    else {
      var idno = parseInt(id.substring(4))
      var subdir = (Math.floor(idno/1000) * 1000 + 1) + '-' + (Math.ceil(idno/1000) * 1000)
      dir = 'EMIP/'+subdir
    }
  }

  else if(collection.startsWith('EMML')) {
    var idno = parseInt(id.substring(4))
    var subdir = (Math.floor(idno/1000) * 1000 + 1) + '-' + (Math.ceil(idno/1000) * 1000)
    dir = 'EMML/'+subdir
  }

  else if(collection.startsWith('ES')) dir = 'ES'

  return dir + '/' + id + '.xml'
}

function getPersonPath(id) {
  const idno = parseInt(id.substring(3))
  return 'PRS' + (Math.floor(idno/1000) * 1000 + 1) + '-' + (Math.ceil(idno/1000) * 1000) + '/' + id + '.xml'
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function decapitalize(string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}