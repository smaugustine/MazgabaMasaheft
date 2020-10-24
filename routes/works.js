const express = require('express')
const router = express.Router()

const GitHub = require('../github')

router.get('/', function(req, res, next) {
  res.json({"path": "works"})
})

router.get('/:id/xml', function(req, res, next) {
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
    
    res.render('xml', {
      xml: xmlContent
    })
  })
})

module.exports = router