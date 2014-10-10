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

GitHubJS.prototype.listTeamRepos = function(callback) {
  this.options.url = this.baseUrl + '/teams/' + this.teamID + '/repos'
  this.repos =  Array()
  self = this

  this.get(function(err, repos) {
    // repos coming back as string - needs JSON.parse ?
    if (err) {
      callback(err,null)
    } else {
      console.dir("type of repos is: " +  typeof(repos))
      //debugger;
      repos.forEach(function(repo){
          self.repos.push(repo.name)
      })
      callback(null, this.repos)
    }
  })
}

var get = function(callback) {
  
   request.get(this.options, function(err, response, body) {
    if (err) {
      callback(err, null)
    }

    if (response.statusCode !== 200) {
      err = 'bad response code: ' + response.statusCode
      callback(err, null)
    }
    // console.dir(body)
    callback(null, body)
  })
}

module.exports = GitHubJS
