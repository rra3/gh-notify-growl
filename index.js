#!/usr/local/bin/node --harmony

var conf = require('./config.json')
  , request = require('request')
  , xmlParser = require('xml2json')
  , GitHubEntry = require('./lib/githubrss')
  , GitHubJS = require('./lib/github')
  , GHClient = require('./lib/client')


var url = conf.url
var ghjs = new GitHubJS(new GHClient(conf.token))


ghjs.getTeamRepos(function(err, repos) {

  if (err) {
    console.log("we haz error: %", err)
    return
  }

  request.get(url, function(err, response, body) {
    if (err) {
      throw err; 
    }
    var json = xmlParser.toJson(response.body);
    entries = JSON.parse(json).feed.entry;
    entries.forEach(function(entry) {
      gh = new GitHubEntry(entry)
      gh.parseEntry()

      // console.log(gh.repo)

      // if (ghjs.repos.indexOf(gh.repo) > -1) {
      if (ghjs.teamOwns(gh.repo)) {
        console.log('%s: %s', gh.author, gh.comment)
      }
    });
  });
})
