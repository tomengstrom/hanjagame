var express = require('express');
var sqlite3 = require('sqlite3');

var app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

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

// Koala NLP stuff
// var koalanlp = require('koalanlp'); // Import
// var API = koalanlp.API; // Tagger/Parser Package 지정을 위한 목록
// var POS = koalanlp.POS; // 품사 관련 utility

var tagger_promise = null;

var init_tagger = function() {
  if(tagger_promise) return tagger_promise;
  tagger_promise = new Promise(function(resolve, reject) {
    koalanlp.initialize({
        packages: [API.EUNJEON, // 품사분석(POS Tagging)을 위해서, 은전한닢 사용
                   API.KKMA], // 의존구문분석(Dependency Parsing)을 위해서, 꼬꼬마 사용
        version: "1.9.2", // 사용하는 KoalaNLP 버전 (1.9.2 사용)
        javaOptions: ["-Xmx4g"],
        debug: true // Debug output 출력여부
    }).then(function() {
      var tagger = new koalanlp.Tagger(API.EUNJEON);
      var parser = new koalanlp.Parser(API.KKMA);

      // Do a non-empty tag run to force dictionary load
      tagger.tag('나')
        .catch(function(error) {
          console.error(error);
          reject(error)
        })
        .then(function(result) {
          parser.parse(result)
            .catch(function(error) {
              console.error(error);
              reject(error);
            })
            .then(function(result) {
              resolve({
                tagger: tagger,
                parser: parser
              });
            });
        });
    });
  })
  return tagger_promise;
};

var parse_sentence = function(sentence) {
  return new Promise(function(resolve, reject) {
    init_tagger().then(function(r) {
      var tagger = r.tagger;
      var parser = r.parser;
      // Tagging / parsing
      console.log('processing sentence ' + sentence);
      tagger
        .tagSentence(sentence)
        .catch(function(error) {
            console.error(error);
            reject(error);
        }).then( function(tagged_sentence) {

          parser
          .parseSentence(tagged_sentence)
          .catch(function(error) {
            console.error(error);
            reject(error);
          })
          .then(function(parsed_sentence) {
            // we need to parse the sentence here and return
            // json in desired format
            console.log('parsing sentence');

            // Words
            for ( var j = 0; j < parsed_sentence.words.length; j++) {
              var word = parsed_sentence.words[j];

              // Morphemes
              for ( var k = 0; k < word.morphemes.length; k++) {
                var m = word.morphemes[k];

                m.is_noun         = POS.isNoun(m);
                if (m.is_noun) word.is_noun = true;

                m.is_ending       = POS.isEnding(m);
                if (m.is_ending) word.is_ending = true;

                m.is_modifier     = POS.isModifier(m);
                if (m.is_modifier) word.is_modifier = true;

                m.is_predicate    = POS.isPredicate(m);
                if (m.is_predicate) word.is_predicate = true;

                m.is_suffix       = POS.isSuffix(m);
                if (m.is_suffix) word.is_suffix = true;

                m.is_affix        = POS.isAffix(m);
                if (m.is_affix) word.is_affix = true;

                m.is_postposition = POS.isPostposition(m);
                // Postposition if
                if (m.is_postposition) {
                  word.is_postposition = true;

                  if (m.surface == '가' || m.surface == '이' ) {
                    word.is_subject = true;
                  }
                  if( m.surface == '는' || m.surface == '은' ) {
                    word.is_topic = true;
                  }
                  if( m.surface == '를' || m.surface == '을' ) {
                    word.is_object = true;
                  }
                }
                // Close Postposition if

              }
              // End morpheme loop
            }
            // End word loop
            resolve({
              parsed: parsed_sentence,
              tagged: tagged_sentence,
              verbs: parsed_sentence.verbs(),
              nouns: parsed_sentence.verbs()
            });
          });
        });
    });
  });
};

// Preload Koala NLP tagger
// init_tagger().then(function() {
//   console.log('tagger initialized');
// });
//parse_sentence('나 행복해요');


// Init open Korean text node
//var okt = require('open-korean-text-node').default;

app.post( "/analyze", function( req, res ) {
  console.log('analyze: got request sentence: ' + req.body.sentence );
  // okt.tokenize(req.body.sentence).then( function( /*IntermediaryTokensObject*/ tokenized_result ) {
  //   var tokens_json = tokenized_result.toJSON();
  //   console.log('analyze: setting request json');
  //   res.json(tokens_json);
  // } );

  // parse_sentence(req.body.sentence).then(function(result) {
  //   console.log('analyze: setting request json');
  //   res.json(result);
  // });
} );
