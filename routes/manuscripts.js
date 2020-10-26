const express = require('express')
const router = express.Router()

const GitHub = require('../github')

router.get('/', function(req, res, next) {
  res.render('manuscripts/index', {
    title: 'Manuscripts'
  })
})

router.get('/:id', function(req, res, next) {
  res.redirect(req.params.id+'/main')
})

router.get('/:id/:type', function(req, res, next) {
  const responseType = req.params.type

  const id = req.params.id
  const dir = getDir(id)

  var branch = 'master'
  if(typeof req.query.branch == 'string' && req.query.branch !== '') branch = req.query.branch

  GitHub.repos.getContent({
    owner: 'BetaMasaheft',
    repo: 'Manuscripts',
    ref: branch,
    path: dir+'/'+id+'.xml'
  })
  .then(({ data }) => {
    return GitHub.git.getBlob({
      owner: 'BetaMasaheft',
      repo: 'Manuscripts',
      file_sha: data.sha
    })
  })
  .then(({ data }) => {
    var xmlContent = new Buffer.from(data.content, 'base64')
    xmlContent = xmlContent.toString()

    const ghUrl = 'https://github.com/BetaMasaheft/Manuscripts/blob/'+branch+'/'+dir+'/'+id+'.xml'
    const bmUrl = 'https://betamasaheft.eu/manuscripts/'+id+'/'+(responseType == 'xml' ? '' : responseType)

    if(responseType == 'main') {
      res.render('manuscripts/data', {
        title: 'Manuscripts',
        subtitle: id,
        tabs: {
          active: {"data": true},
          images: true,
          github: ghUrl,
          betamasaheft: bmUrl
        },
        id: id,
        branch: (branch == 'master' ? false : branch),
        xml: xmlContent
      })
    }

    else if(responseType == 'viewer') {
      res.render('manuscripts/images', {
        title: 'Manuscripts',
        subtitle: id,
        tabs: {
          active: {"images": true},
          images: true,
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
        title: 'Manuscripts',
        subtitle: id,
        tabs: {
          active: {"xml": true},
          images: true,
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

function getDir(id) {
  const collection = id.replace(/\d/g, '')

  if(collection.startsWith('BAV')) {
    return 'VaticanBAV/'+collection.substr(3)
  }

  else if(collection.startsWith('BL')) {
    return 'LondonBritishLibrary/'+collection.substr(2)
  }
  
  else if(collection.startsWith('EMIP')) {
    if(collection.substring(4) == 'ms') return 'EMIP/magicscrolls'
    else {
      var idno = parseInt(id.substring(4))
      var dir = (Math.floor(idno/1000) * 1000 + 1) + '-' + (Math.ceil(idno/1000) * 1000)
      return 'EMIP/'+dir
    }
  }

  else if(collection.startsWith('EMML')) {
    var idno = parseInt(id.substring(4))
    var dir = (Math.floor(idno/1000) * 1000 + 1) + '-' + (Math.ceil(idno/1000) * 1000)
    return 'EMML/'+dir
  }
}

module.exports = router