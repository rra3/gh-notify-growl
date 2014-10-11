  var conf = require('../config.json')
    , request = require('request')
    , GitHubJS



    
    var GitHubJS = function () {
      this.options = {
        "headers":  {"User-Agent": "Thagomizer v1.0"},
        "qs": { "access_token": conf.token}
      }
      this.teamID = conf.teamId
      this.baseUrl = 'https://api.github.com'
      this.get = get
      // define repose on "this" here, for later reference in closure
      this.repos = []
    }


  GitHubJS.prototype.listTeamRepos = function(cb) {
    this.options.url = this.baseUrl + '/teams/' + this.teamID + '/repos'
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
    this.get(requestCb)
  }

  GitHubJS.prototype.teamOwns = function(repo) {
    return this.repos.indexOf(repo) > -1
  }

  // TODO client code should be extracted to a client class that is injected in.
  var get = function(cb) {
     request.get(this.options, function(err, response, body) {
      if (err) {
        return cb(err, null)
      }
      if (response.statusCode !== 200) {
        err = new Error('bad response code: ' + response.statusCode)
        return cb(err, null)
      }
      cb(null, body)
    })
  }


  module.exports = GitHubJS
