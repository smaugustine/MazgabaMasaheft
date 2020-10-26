// GitHub API //
const { Octokit } = require("@octokit/rest")
const GitHub = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
})

module.exports = GitHub