var cheerio = require('cheerio')
  , htmlStr = require('html-strings')

var unescape = htmlStr.unescape

var GitHubEntry = function(entry) {
  var self = this;
  this.entry = entry
  this.parseEntry = parseEntry
  this.parseComment = parseComment
  this.hasComment = false
}

var parseEntry = function() {
  this.content = unescape(this.entry.content.$t)
  this.title = scrubJunk(unescape(this.entry.title.$t))
  // console.log(this.title)
  // if (!this.title) {
  //   console.dir(this.entry)
  // }
  this.id = this.entry.id
  this.author = this.entry.author.name
  this.link = this.entry.link.href
  this.thumbUrl = this.entry['media:thumbnail'].url
  this.parseComment()
  this.repo = this.title.match(/cbdr\/(.+)/)[1]
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

// some sort of escaped html rubbish that html-strings doesn't catch
var scrubJunk = function(str) {
 return  str.replace(/&[#;0-9]+/, '');
}



module.exports = GitHubEntry
