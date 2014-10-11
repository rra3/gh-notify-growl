var request = require("request")


var GHClient = function(token) {
    this.options = {
      "headers":  {"User-Agent": "Thagomizer v1.0"},
      "qs": { "access_token": token}
    }
}


GHClient.prototype.get = function(cb) {
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


module.exports = GHClient
