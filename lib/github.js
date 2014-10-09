var conf = require('../config.json')
  , request = require('request')



var GitHubJS = function() {
  this.options = {
    "headers":  {"User-Agent": "Thagomizer v1.0"},
    "qs": { "access_token": conf.token}
  }
  this.teamID = conf.teamId
  this.baseUrl = 'https://api.github.com'
  this.get = get
}

GitHubJS.prototype.listTeamRepos = function(err,callback) {
  this.path = this.teamID + '/' + 'repos'
  this.get(err, this.path, function(err, body){
    if (err) {
      throw err
    }
    body.forEach(function(thing) {
      console.dir(thing)
    })
  })
}

var get = function(err,path,callback) {
  this.options.url = this.baseUrl + '/teams/' + this.path
  
   request.get(this.options, function(err, response,body) {
    if (err) {
      callback(err, null)
    }

    if (response.statusCode !== 200) {
      err = 'bad response code: ' + response.statusCode
      callback(err, null)
    }
    callback(null, JSON.parse(response.body))
  })
}

module.exports = GitHubJS
