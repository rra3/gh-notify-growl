var cheerio = require('cheerio')
  , htmlStr = require('html-strings')

var unescape = htmlStr.unescape



var parseEntry = function() {
  this.content = unescape(this.entry.content.$t)
  this.title = scrubJunk(unescape(this.entry.title.$t))
  // console.log(this.title)
  // if (!this.title) {
  //   console.dir(this.entry)
  // }
  this.id = this.entry.id
  this.published = this.entry.published
  this.updated = this.entry.updated
  if (this.published !== this.updated) {
    console.log("DEBUG: dates don't match")
  }
  this.author = this.entry.author.name
  this.link = this.entry.link.href
  this.thumbUrl = this.entry['media:thumbnail'].url
  this.parseComment()
  var titleMatches = this.title.match(/cbdr\/(.+)/)
  if (titleMatches && titleMatches.length > 0) {
    this.repo = titleMatches[1]
  } else {
    // console.log("DEBUG title: %s", this.title)
  }
  // console.dir(this)
  return this
}

var parseComment = function() {
  $ = cheerio.load(this.content)
  var comment =$('div.message').text()
  if (typeof comment != 'undefined' && comment !== null && comment.length > 0) {
    this.comment = comment
    this.hasComment = true
    // console.log(this.title)
   } else {
     // console.log(this.title)
   }  
}

var GitHubEntry = function(entry) {
  console.dir(entry)
  this.entry = entry
  this.parseEntry = parseEntry
  this.parseComment = parseComment
  this.hasComment = false
}

// some sort of escaped html rubbish that html-strings doesn't catch
var scrubJunk = function(str) {
 return  str.replace(/&[#;0-9]+/, '');
}



module.exports = GitHubEntry
