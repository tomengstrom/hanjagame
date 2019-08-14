const path = require('path'),
   express = require('express'),
   app = express(),
   port = process.env.PORT || 3000;

app.listen(port, () => { console.log(`App is listening on port ${port}`) });

// Allows requests from module-specific servers
   app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
   })

// Static folders
   app.use( '/static', express.static( 'static') );
   app.use( '/builder', express.static( __dirname + '/builder/dist') );

// File handling
   const fs = require('fs');
   app.use(express.json());       // to support JSON-encoded bodies

   var send_json_file = function(json_filename, res) {
      fs.readFile( json_filename, 'utf8', (err, data) => {
         if(err) {
            console.log("An error occured while reading JSON from file.");
            res.json( {
               message: 'failed',
               error: err
            } );
         }
         console.log('read json data');
         console.log(data);
         var parsed_json = JSON.parse(data);
         console.log('json parsed');
         console.log(parsed_json);

         res.json(parsed_json);
      } )
   }

// Builder
   app.post('/builder/save_diagram', (req, res) => {
      var json_filename = "stored_models/diagram.json";
      fs.writeFile( json_filename, JSON.stringify(req.body), 'utf8', (err) => {
         if (err) return res.json({ message: 'file saving failed', error: err });
         res.json({ message: "file saved successfully" })
      })
   })
   app.get('/builder/get_diagram', (req, res) => {
      send_json_file("stored_models/diagram.json", res );
   })

// Viewer
   app.get('/viewer/get_sample_data', (req, res) => {
      send_json_file("stored_models/sample.json", res );
   })

// NLP
   var koalanlp = require('koalanlp'); // Import
   var API = koalanlp.API; // Tagger/Parser Package 지정을 위한 목록
   var POS = koalanlp.POS; // 품사 관련 utility

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
            tagger.tagSentence(sentence)
               .catch( function(error) { console.error(error); reject(error); } )
               .then( function(tagged_sentence) {

               parser.parseSentence(tagged_sentence)
                  .catch(function(error) { console.error(error); reject(error); })
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
                           // END Postposition if
                        }
                        // END Morphemes
                     }
                     // End Words

                     resolve({
                        parsed: parsed_sentence,
                        tagged: tagged_sentence,
                        verbs: parsed_sentence.verbs(),
                        nouns: parsed_sentence.nouns()
                     });
               });
            });
         });
      });
   };

   // Preload Koala NLP tagger
   init_tagger().then(function() {
      console.log('tagger initialized');
   });
   parse_sentence('나는 행복해요').then(function(result) {
      console.log('result from 나는 행복해요:');
      console.log(result);
   });
   parse_sentence('저는 행복합니다').then(function(result) {
      console.log('result from 저는 행복합니다:');
      console.log(result);
   });

   // Init open Korean text node
   //var okt = require('open-korean-text-node').default;

   app.post( "/analyze", function( req, res ) {
      console.log('analyze: got request sentence:' + req.body.sentence);

      // okt.tokenize(req.body.sentence).then( function( /*IntermediaryTokensObject*/ tokenized_result ) {
      //   var tokens_json = tokenized_result.toJSON();
      //   console.log('analyze: setting request json');
      //   res.json(tokens_json);
      // } );

      if ( req.body.sentence.length < 1 ) {
         res.json({});
         return;
      }

      parse_sentence(req.body.sentence).then(function(result) {
         console.log('analyze: setting request json');
         res.json(result);
      });
   } );