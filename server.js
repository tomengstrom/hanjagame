var express = require('express');
var sqlite3 = require('sqlite3');

var app = express();

var pathUtils = require('path');

// Directory to game
var appDir = pathUtils.resolve( __dirname, "jquery-require-stub" );


// Hanja dictionary database
var db = new sqlite3.Database( 'hanja-dictionary/hanjadic.sqlite', sqlite3.OPEN_READONLY );

app.use( express.static( appDir ) );

// Return the index
app.get( "/", function( req, res ) {
    res.sendfile( pathUtils.resolve( appDir, "index.html" ) );
} );

// Return entire hanja table as json
app.get( "/hanja", function( req, res ) {
  var data = [];
  db.each("SELECT english, hanja, hangul FROM hanjas", function(err, row){

    // TODO the data structure should probably be wrapped inside a class
    data.push({ "english" : row.english, "hanja": row.hanja, "hangul": row.hangul });

  }, function(e, rows) {
    res.json(data);
  });
} );

// Return entire hanja definitions table as json
app.get( "/hanja_def", function( req, res ) {
  var data = [];
  db.each("SELECT hanjas, definition FROM hanja_definition", function(err, row){

    // TODO the data structure should probably be wrapped inside a class
    data.push({ "definition" : row.definition, "hanjas": row.hanjas });

  }, function(e, rows) {
    res.json(data);
  });
} );

// Start server
app.listen( 8000, function () {
  console.log('listening on port 8000')
} );
