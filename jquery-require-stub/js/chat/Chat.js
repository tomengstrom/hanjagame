define([
  'jquery',
  'utils/Debug',
  'Transfer'
], function(
  $,
  Debug,
  Transfer
) {

  Debug.enable_scope('Chat');

  function Chat(args) {
    var self = this;

    Debug.log('Chat', 'constructed');

    self.__container = args.container;

    self.__transfer = new Transfer({});

    self.__element = $('<div></div>');

    // Output
    self.__output_container = $('<div></div>');
    self.__element.append(self.__output_container);

    // Input
    var input_container = $('<div></div>');
    input_container.addClass('input-container');

    self.__word_input = $('<input type="text"></input>');
    var submit = $('<button>></button>');
    submit.on('click', function() {
      var sentence = self.__word_input.val();
      self.__transfer.analyze(sentence).then(function(result) {
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

    self.__container.append( self.__element );

    return;
  };

  var COLOR_OF = {
    predicate: 'red',
    modifier: 'blue',
    noun: 'green'
  };

  Chat.prototype = {

    __show_result: function(args) {
      var self = this;
      Debug.log('Chat', '__show_result', args);

      self.__output_container.empty();

      $.each( args.analyzed_sentences, function(sentence_i, sentence) {
        $.each( sentence.words, function(word_i, word ) {
          var word_el = $('<span></span>');
          word_el.addClass('word');
          word_el.html(word.surface);
          if(word.is_predicate) {
            word_el.addClass('word--predicate');
          }
          if(word.is_subject) {
            word_el.addClass('word--subject');
          }
          if(word.is_topic) {
            word_el.addClass('word--topic');
          }
          if(word.is_object) {
            word_el.addClass('word--object');
          }
          self.__output_container.append(word_el);
        } );
      } );

      return;
    },
    start: function() {
      var self = this;
      $('.loader').remove();
      return;
    }
  };

  return Chat;

});
