/*
* Main container for the graphical representations of the game UI and
* world
*/
define([
  'jquery',
  'Debug',
  'WordChainConstants'
], function(
  $,
  Debug,
  WordChainConstants
) {

  Debug.enable_scope('WordChainGameUI')

  function UI(args) {
    var self = this;

    if(!args.container) throw 'element required';

    self.__container = args.container;
    self.__engine = args.engine;

    // DOM element; where we add graphics
    self.__element = $('<div></div>');

    // History
    self.__bubble_container = $('<div></div>');
    self.__bubble_container.addClass('bubble-container');

    self.__message_container = $('<div></div>');
    self.__message_container.addClass('message-container');

    // Word input
    var input_container = $('<div></div>');
    input_container.addClass('input-container');
    self.__word_input = $('<input type="text"></input>');
    var submit = $('<button>></button>');
    submit.on('click', function() {
      var answer = self.__word_input.val();
      self.__engine.validate(answer);
      self.refresh();
      if(self.__engine.get_status().word_changed) {
        self.__engine.next();
      }
    });
    self.__word_input.keypress(function(e) {
      if(e.key == 'Enter') {
        submit.click();
        self.__word_input.empty();
      }
    });

    var cheat = $('<button>Cheat :)</button>');
    cheat.on('click', function() {
      var valid_word = self.__engine.get_status().remaining_words[0];
      self.__word_input.val(valid_word.hangul);
      submit.click();
      self.__word_input.empty();
    });


    input_container.append(self.__word_input);
    input_container.append(submit);
    input_container.append(cheat);

    self.__element.append( self.__bubble_container );
    self.__element.append( input_container );

    self.__element.append( self.__message_container );

    return;
  };

  UI.prototype = {

    __create_word_bubble: function( eng, hangul_syllables, hanja_definitions ) {
      var self = this;
      var bubble = $('<div></div>');
      bubble.addClass('bubble');

      // Hangul
      var hangul = $('<p class="hangul"></p>');
      $.each( hangul_syllables, function(index, syllable) {
        var syllable_element = $('<span class="hangul-syllable"></span>');
        syllable_element.html( syllable );
        hangul.append( syllable_element );
      });
      bubble.append(hangul);

      // Chinese characters
      var hanjas = $('<p class="hanja"></p>');
      $.each( hanja_definitions, function(index, hanja_def) {
        var hanja = $('<span class="hanja-character"></span>');
        hanja.html( hanja_def.hanja );
        hanjas.append(hanja);

        var hanja_definition = $('<div class="hanja-character-definition"></div>');
        hanja_definition.html(hanja_def.definition);
        hanjas.append(hanja_definition);
        hanja_definition.hide();

        hanja.on( 'click', function() {
          window.open( 'http://hanjadic.bravender.net/' + hanja_def.hanja, '_hanja' );
        });

        hanja.on( 'mouseover', function() {
          hanja.toggleClass('hanja-hover', true);
          hanja_definition.show();
        });
        hanja.on( 'mouseout', function() {
          hanja.toggleClass('hanja-hover', false);
          hanja_definition.hide();
        });

      });
      bubble.append(hanjas);

      // English translation
      var english = $('<p class="english"></p>');
      english.html( eng );
      bubble.append(english);

      return bubble;
    },

    __add_bubble: function(added_word) {
      var self = this;
      Debug.log('WordChainGameUI', '__add_bubble', {
        word: added_word.word,
        player: added_word.player
      });

      var word = added_word.word;
      var word_player = added_word.player;

      var bubble = self.__create_word_bubble(
        word.english,
        added_word.hangul_syllables,
        added_word.hanja_definitions
      );

      bubble.addClass( 'bubble_' + word_player );
      var bubble_wrapper = $('<div></div>');
      bubble_wrapper.addClass('bubble_wrapper');
      bubble_wrapper.append( bubble );

      self.__bubble_container.append(bubble_wrapper);

      return;
    },

    refresh: function() {
      var self = this;
      Debug.log('WordChainGameUI', 'refresh' );

      // Get status
      var status = self.__engine.get_status();

      self.__message_container.empty();

      // Update status message
      if (status.message) {
        self.__message_container.prepend( $('<p>' + WordChainConstants.MESSAGE_OF[status.message] + '</p>') );
      }
      if (status.remaining_words) {
        self.__message_container.prepend( $('<p>Possible words: ' + status.remaining_words.length + '</p>') );
      }

      // Add new bubble if it changed
      if (status.word_changed) {
        self.__word_input.attr('placeholder', self.__engine.get_latest_last_syllable() );
        self.__add_bubble( self.__engine.get_latest_word() );
      }

      return;
    },

    init: function(first_word) {
      var self = this;
      $('.loader').remove();
      self.__container.append( self.__element );
      return;
    }
  }

  return UI;

});
