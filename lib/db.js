var sqlite3 = require('sqlite3').verbose()



function RSSData() {
  var db = new sqlite3.Database("rss.dat")
  this.db = db
}


RSSData.prototype.getRow = function(id, cb) {

  this.db.get("select * from rss where id = ?", id, function(err, row){
    if (err) { return cb(err,null) }
    return cb(null,row)
  })

}


RSSData.prototype.idExists = function(id,cb) {
  this.getRow(id, function(err,row) {
    if (err) {
      return cb(err,null)
    }
    if (row && row.hasOwnProperty('id')) {
      return cb(null,true)
    } else {
      return cb(null,false)
    }
  })
}

RSSData.prototype.insert = function(id) {
  var stmt = this.db.prepare("insert into rss(id) values(?)")
  stmt.run(id)
  stmt.finalize()
}

RSSData.prototype.close = function() {
  this.db.close()
}


module.exports = RSSData
