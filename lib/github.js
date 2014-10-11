(function() {
  var conf = require('../config.json')
    , request = require('request')
    , GitHubJS



  GitHubJS = (function() {
    
    var GitHubJS = function () {
      this.options = {
        "headers":  {"User-Agent": "Thagomizer v1.0"},
        "qs": { "access_token": conf.token}
      }
      this.teamID = conf.teamId
      this.baseUrl = 'https://api.github.com'
      this.get = get
    }


  GitHubJS.prototype.listTeamRepos = function(cb) {
    this.options.url = this.baseUrl + '/teams/' + this.teamID + '/repos'
    // try a closure here. don't refer to "this" here since 
    // nesting functions when using "this" can cause the reference to confusingly shift context.
    var repos =  []
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
        repos.push(repo.name)
      })
      /* Assign repos to global object bc "this" seems ... shifty
       * Even though this is async, repos will be available to
       * the caller since they must first wait for their callback to be called! (cb)
       */
      GitHubJS.repos = repos
      cb(null, repos)
      console.log("callback inside of request.get is finished!")
    };
    this.get(requestCb)
    console.log("line after request.get!")
  }

  GitHubJS.prototype.teamOwns = function(repo) {
    return GitHubJS.repos.indexOf(repo) > -1
  }

  var get = function(cb) {
    // debugger
     request.get(this.options, function(err, response, body) {
      if (err) {
        return cb(err, null)
      }
      if (response.statusCode !== 200) {
        err = new Error('bad response code: ' + response.statusCode)
        return cb(err, null)
      }
      // console.dir(body)
      cb(null, body)
    })
  }

  return GitHubJS;

  } )();
  module.exports = GitHubJS
}).call(this)
