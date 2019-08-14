define([
  'jquery',
  'utils/Debug',
  'Transfer',
  'magic/analyzer'
], function(
  $,
  Debug,
  Transfer,
  analyzer
) {

  Debug.enable_scope('Magic');

  var CSS_OF = {
    '적색이': {
      'background-color': 'red'
    },
    '파란색이': {
      'background-color': 'blue'
    },
    '녹색이': {
      'background-color': 'green'
    },

    '뚱뚱하': {
      'width': '300px'
    },

    '날씬하': {
      'width': '100px'
    },

    '크': {
      'width': '200px',
      'height': '200px',
      'font-size': '45px'
    },

    '작': {
      'width': '50px',
      'height': '50px',
      'font-size': '15px'
    }
  };


  var COLOR_OF = {
    predicate: 'red',
    modifier: 'blue',
    noun: 'green'
  };


  function Magic(args) {
    var self = this;

    Debug.log('Magic', 'constructed');

    self.__container = args.container;

    self.__transfer = new Transfer({});

    self.__element = $('<div></div>');

    // Sandbox
    self.__object_container= $('<div></div>');
    self.__element.append(self.__object_container);


    // Input
    var input_container = $('<div></div>');
    input_container.addClass('input-container');

    self.__word_input = $('<input type="text"></input>');
    var submit = $('<button>></button>');
    submit.on('click', function() {
      var sentence = self.__word_input.val();
      self.__transfer.analyze(sentence).then(function(result) {
        Debug.log('Magic', 'analysis result is ', result);

        self.__show_result({
          analyzed_sentences: result,
          sentence: sentence
        });
      });
    });
    self.__word_input.keypress(function(e) {
      if(e.key == 'Enter') {
        submit.click();
        self.__word_input.empty();
      }
    });
    input_container.append(self.__word_input);
    input_container.append( submit);
    self.__element.append( input_container );

    // Output
    self.__output_container = $('<div></div>');
    self.__element.append(self.__output_container);

    self.__container.append( self.__element );

    self.__objects = [];

    var initial_objects = ['여자'];

    $.each( initial_objects, function(i, kr_label) {
      self.__create_object(kr_label);
    });

    // Message container
    self.__message_container = $('<div></div>');
    self.__element.append( self.__message_container );

    // Display available commands
    var command_container = $('<div></div>');
    self.__element.append( command_container );
    for (var key in CSS_OF) {
      var command_el = $('<div></div>');
      command_el.append( $('<p>'+ key +'</p>' ) );
      var css_ul = $('<ul></ul>');
      command_el.append(css_ul);
      for (var css_key in CSS_OF[key] ) {
        css_ul.append( $('<li>' + css_key + ': ' + CSS_OF[key][css_key] + '</li>'));
      }
      command_container.append(command_el);
    }

    return;
  };




  Magic.ACTIONS = {
    'create': 'CREATE',
    'transform': 'TRANSFORM'
  };


  Magic.prototype = {

    __create_object: function(kr_label) {
      var self = this;

      var element = $('<div><p>'+kr_label+'</p></div>');
      element.addClass('magic_element');
      self.__object_container.append( element );
      self.__objects.push({
        kr: [kr_label],
        element: element
      });

      return;
    },

    __word_to_css: function(word) {
      var self = this;

      Debug.log('Magic', '__word_to_css:: word is', word);

      // Collapse morphemes
      var noun = '';
      $.each( word.morphemes, function(i, morpheme) {
        if( morpheme.is_noun || morpheme.is_predicate ) {
          noun += morpheme.surface;
        };
      });

      Debug.log('Magic', '__word_to_css:: noun is', noun);


      return CSS_OF[noun];
    },

    __get_subject_stem: function(word) {
      var self = this;
      for( var i = 0; i < word.morphemes.length; i++) {
        var morpheme = word.morphemes[i];
        if ( morpheme.is_noun ) {
          return morpheme.surface;
        }
      }
      return null;
    },

    // Apply CSS changes to target element
    __transform: function(target_id, css) {
      var self = this;
      Debug.log('Magic', '__transform::', {
        target_id: target_id,
        css: css
      });

      $.each( self.__objects, function(i, object) {
        if (object.kr == target_id) {
          Debug.log('Magic', '__transform:: found matching object with id');
          object.element.css(css);
        }
      });

      return;
    },

    __handle_error: function(message) {
      var self = this;
      Debug.log('Magic', '__handle error', message);
      self.__message_container.empty();
      self.__message_container.html(message);
      return;
    },

    __show_result: function(args) {
      var self = this;
      Debug.log('Magic', '__show_result', args);

      self.__message_container.empty();
      self.__output_container.empty();

      var target_id, transform_css, action;

      Debug.log('Magic', '__show_result:: analyzing sentence ' + args.sentence );

      $.each( args.analyzed_sentences.parsed.words, function( word_i, word ) {
        var word_el = $('<span></span>');
        word_el.addClass('word');
        word_el.html(word.surface);

        // Predicate determines action
        if (word.is_predicate) {
          Debug.log('Magic', '__show_result:: found predicate: ', word );

          var stem = '';
          $.each( word.morphemes, function(i, morpheme) {
            if(morpheme.is_predicate) {
              stem += morpheme.surface;
            }
            word_el.addClass('word--predicate');
          });

          switch(stem) {
            case '있':
              Debug.log('Magic', '__show_result:: creation action detected', word);
              action = Magic.ACTIONS.create;
              break;

            case '이':
            default:
              Debug.log('Magic', '__show_result:: transform action detected', word);
              action = Magic.ACTIONS.transform;
              transform_css = $.extend( transform_css, self.__word_to_css(word) );
              break;  
          }

        }

        // Subject or topic is the target
        if(word.is_subject) {
          Debug.log('Magic', '__show_result:: found subject: ', word );
          word_el.addClass('word--subject');
          target_id = self.__get_subject_stem(word);
        }
        if(word.is_topic) {
          Debug.log('Magic', '__show_result:: found topic: ', word );
          word_el.addClass('word--topic');
          target_id = self.__get_subject_stem(word);
        }

        // Not used yet
        if(word.is_object) {
          Debug.log('Magic', '__show_result:: found object: ', word );
          word_el.addClass('word--object');
        }

        self.__output_container.append(word_el);
      } );

      Debug.log('Magic', '__show_result', {
        target_id: target_id,
        css: transform_css,
        action: action
      });

      if (action) {
        switch (action) {

          case Magic.ACTIONS.create:
            if(target_id) {
              self.__create_object(target_id);
            }
            break;

          case Magic.ACTIONS.transform:
          default:
            if(!target_id) {
              // Target not found
              var error_message = '';
              if( !analyzer.contains_subject(args.analyzed_sentences.parsed.words ) &&
                  !analyzer.contains_topic(args.analyzed_sentences.parsed.words ) ) {
                error_message += 'No subject (~이/가) or topic marker (~은/는) found in sentence.';
              }
              self.__handle_error(error_message);
            }

            if ( target_id && transform_css ) {
              Debug.log('Magic', '__show_result:: found target and tranform predicate, transforming' );
              self.__transform( target_id, transform_css );
            }

            break;

        }
      }


      return;
    },

    start: function() {
      var self = this;
      $('.loader').remove();
      return;
    }
  };

  return Magic;

});
