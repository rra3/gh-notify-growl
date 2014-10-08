var conf = require('../config.json')
  , request = require('request')



var GitHubJS = function() {
  this.options = {
    "url": "https://api.github.com/notifications",
    "headers":  {"User-Agent": "Thagomizer v1.0"},
    "qs": { "access_token": conf.token}
  }
}

GitHubJS.prototype.get = function() {

  request.get(this.options, function(err, response,body) {
    if (err) {
      throw err; 
    }

    if (response.statusCode !== 200) {
      throw 'bad response code: ' + response.statusCode
    }
    JSON.parse(response.body).forEach(function(entry) {
      if (entry.repository.full_name.match(/cbdr\//)) {
        console.log(entry.repository.full_name)
      } else {
        console.log('not cbdr: %s', entry.repository.full_name)
      }
    })
  })
}

module.exports = GitHubJS
