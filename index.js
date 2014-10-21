#!/usr/local/bin/node --harmony

var conf = require('./config.json')
  , request = require('request')
  , xmlParser = require('xml2json')
  , GitHubEntry = require('./lib/githubrss')
  , GitHubJS = require('./lib/github')
  , GHClient = require('./lib/client')
  // , growl = require('growl')
  , RssData = require('./lib/db.js')
  , spawn = require('child_process').spawn


var db = new RssData()

var url = conf.url
var ghjs = new GitHubJS(new GHClient(conf.token))
/*
 *
 * TODO: check published vs updated dates
 *
 * Looks like maybe a given id may be "updated".
 * check if they are equal - if not the entry is an update?
 */


ghjs.getTeamRepos(function(err, repos) {

  if (err) {
    return console.log("we haz error: %", err)
  }

  request.get(url, function(err, response, body) {
    if (err) {
      throw err; 
    }
    var json = xmlParser.toJson(response.body);
    var entries = JSON.parse(json).feed.entry;
    entries.forEach(function(entry) {
     var gh = new GitHubEntry(entry)
      gh.parseEntry()
      var id = gh.id
      // console.dir(gh)
      db.idExists(id, function(err,bThere) {
        if (err) {  throw err }
        if(!bThere) {
          if (gh.hasComment) {
            spawn("/usr/local/bin/growlnotify", [ '-s', '-m', 
            gh.comment, '--url', gh.link, '-a', 'GitHub'])
          } else {
            spawn("/usr/local/bin/growlnotify", [ '-s', '-m', 
            gh.title, '--url', gh.link, '-a', 'GitHub'])
          }

          db.insert(id)
        } else {
          console.log("Already exists: %s", id)
        }

      })
    });
    db.close();
  });
})



