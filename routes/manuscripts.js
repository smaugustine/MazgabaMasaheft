const express = require('express')
const router = express.Router()

const GitHub = require('../github')

router.get('/', function(req, res, next) {
  res.json({"path": "manuscripts"})
})

router.get('/:id/:type', function(req, res, next) {
  const responseType = req.params.type
  const id = req.params.id
  const collection = id.replace(/\d/g, '')
  var dir = ''

  if(collection.startsWith('BAV')) {
    dir = 'VaticanBAV/'+collection.substr(3)
  }

  GitHub.repos.getContent({
    owner: 'BetaMasaheft',
    repo: 'Manuscripts',
    branch: 'master',
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

    if(responseType == 'main') {
      res.render('data', {
        activeTab: {"data": true},
        xml: xmlContent
      })
    }
    
    if(responseType == 'xml') {
      res.render('xml', {
        activeTab: {"xml": true},
        xml: xmlContent
      })
    }

  })
})

module.exports = router