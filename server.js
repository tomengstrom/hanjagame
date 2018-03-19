var express = require('express');
var sqlite3 = require('sqlite3');

var app = express();

var pathUtils = require('path');
var appDir = pathUtils.resolve( __dirname, "jquery-require-stub" );


var db = new sqlite3.Database( 'hanja-dictionary/hanjadic.sqlite', sqlite3.OPEN_READONLY );

//, function() {
  //db.each("SELECT english AS en, hanja FROM hanjas", function(err, row) {
  //     console.log(row.en + ": " + row.hanja);
  //});
//} );

app.use( express.static( appDir ) );

app.get( "/", function( req, res ) {
    res.sendfile( pathUtils.resolve( appDir, "index.html" ) );
} );

app.get( "/hanja", function( req, res ) {
  var data = [];
  db.each("SELECT english, hanja, hangul FROM hanjas", function(err, row){
    data.push({ "english" : row.english, "hanja": row.hanja, "hangul": row.hangul });
  }, function(e, rows) {
    res.json(data);
  });
} );

app.listen( 8000, function () {
  console.log('listening on port 8000')
} );
