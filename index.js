#!/usr/local/bin/node --harmony

var conf = require('./config.json')
  , request = require('request')
  , xmlParser = require('xml2json')
  , GitHubEntry = require('./lib/githubrss')


const url = conf.url


request.get(url, function(err, response, body) {
  if (err) {
    throw err; 
  }
  var json = xmlParser.toJson(response.body);
  entries = JSON.parse(json).feed.entry;
  entries.forEach(function(entry) {
    gh = new GitHubEntry(entry)
    if (gh.parseEntry().hasComment) {
      console.log('%s: %s', gh.author, gh.comment)
    }
  });
});
