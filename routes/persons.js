const express = require('express')
const router = express.Router()

const GitHub = require('../github')

router.get('/', function(req, res, next) {
  res.render('persons/index', {
    title: 'Persons'
  })
})

router.get('/:id', function(req, res, next) {
  res.redirect(req.params.id+'/main')
})

router.get('/:id/:type', function(req, res, next) {
  const responseType = req.params.type

  const id = req.params.id
  const idno = parseInt(id.substring(3))
  const dir = 'PRS' + (Math.floor(idno/1000) * 1000 + 1) + '-' + (Math.ceil(idno/1000) * 1000)

  var branch = 'master'
  if(typeof req.query.branch == 'string' && req.query.branch !== '') branch = req.query.branch

  GitHub.repos.getContent({
    owner: 'BetaMasaheft',
    repo: 'Persons',
    ref: branch,
    path: dir+'/'+id+'.xml'
  })
  .then(({ data }) => {
    return GitHub.git.getBlob({
      owner: 'BetaMasaheft',
      repo: 'Persons',
      file_sha: data.sha
    })
  })
  .then(({ data }) => {
    var xmlContent = new Buffer.from(data.content, 'base64')
    xmlContent = xmlContent.toString()

    const ghUrl = 'https://github.com/BetaMasaheft/Persons/blob/'+branch+'/'+dir+'/'+id+'.xml'
    const bmUrl = 'https://betamasaheft.eu/persons/'+id+'/'+(responseType == 'xml' ? '' : responseType)

    if(responseType == 'main') {
      res.render('persons/data', {
        title: 'Persons',
        subtitle: id,
        tabs: {
          active: {"data": true},
          github: ghUrl,
          betamasaheft: bmUrl
        },
        id: id,
        branch: (branch == 'master' ? false : branch),
        xml: xmlContent
      })
    }
    
    else if(responseType == 'xml') {
      res.render('xml', {
        title: 'Persons',
        subtitle: id,
        tabs: {
          active: {"xml": true},
          github: ghUrl,
          betamasaheft: bmUrl,
        },
        id: id,
        branch: (branch == 'master' ? false : branch),
        xml: xmlContent
      })
    }

  })
  .catch(err => {
    next(err)
  })
})

module.exports = router