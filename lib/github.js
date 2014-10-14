var conf = require('../config.json')
  , request = require('request')
  , GitHubJS




var GitHubJS = function (client) {
  this.client = client
  this.teamID = conf.teamId
  this.baseUrl = 'https://api.github.com'
  // define repose on "this" here, for later reference in closure
  this.repos = []
}


GitHubJS.prototype.getTeamRepos = function(cb) {
  this.client.options.url = this.baseUrl + '/teams/' + this.teamID + '/repos'
  //  http://howtonode.org/why-use-closure
  var self = this
  var requestCb = function(err,repoJson) {
    if (err) {
      return  cb(err,null)
    } 
    var aryRepos = JSON.parse(repoJson) 
    if (aryRepos.length === 0) {
      err = new Error('No repos found or bad return value!')
      return  cb(err,null)
    }
    aryRepos.forEach(function(repo) {
      self.repos.push(repo.name)
    })
    cb(null, self.repos)
  };
  this.client.get(requestCb)
}

GitHubJS.prototype.teamOwns = function(repo) {
  return this.repos.indexOf(repo) > -1
}

module.exports = GitHubJS
