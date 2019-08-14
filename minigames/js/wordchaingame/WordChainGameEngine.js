/*
* Engine that contains the model level logic of the game.
*/
define([
  'jquery',
  'utils/Debug',
  'Session',
  'HanjaHandler',
  'worchaingame/ui/UI',
  'worchaingame/WordChainConstants'
], function(
  $,
  Debug,
  Session,
  HanjaHandler,
  UI,
  WordChainConstants
) {

  Debug.enable_scope('WordChainGameEngine');


  function WordChainGameEngine(args) {
    var self = this;

    Debug.log('WordChainGameEngine', 'constructed');

    // controller for the language
    self.__hanja_handler = new HanjaHandler({});

    // Session
    self.__session = new Session({});

    self.__ui = new UI({
      container: args.container,
      engine: self
    });

    self.__used_words = [];

    self.__latest_word = null;
    self.__latest_last_syllable = null;
    self.__latest_last_character = null;

    return;
  };

  WordChainGameEngine.prototype = {

    __get_random_image: function(keyword) {
      var self = this;
      $.getJSON(
        "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
           tags: keyword,
           tagmode: "any",
           format: "json"
        },
        function(data) {
           var rnd = Math.floor(Math.random() * data.items.length);
           var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
           $('body').css('background-image', "url('" + image_src + "')");
         }
      );

     },

    __get_remaining_words: function() {
      var self = this;

      var excludes = $.map( self.__used_words, function(used_word) {
        return used_word.word;
      });

      var hanjas = self.__latest_word ? self.__latest_word.word.hanja.split('') : [];

      var words = self.__hanja_handler.get_words_containing_hanjas( {
        hanjas: hanjas,
        exclude: excludes
      } );

      return words;
    },

    __get_word: function() {
      var self = this;

      var words = self.__get_remaining_words();
      Debug.log('WordChainGameEngine', '__get_word: got words', words );
      var random_index = Math.floor( Math.random() * words.length );
      Debug.log('WordChainGameEngine', '__get_word ' + random_index );
      return words[random_index];
    },

    next: function() {
      var self = this;
      var word = self.__get_word();

      self.__status = {};
      self.__status.word_changed = false;

      if (word) {
        self.__status.word_changed = true;
        self.__add_word( word, WordChainConstants.OPPONENT );
        self.__status.remaining_words = self.__get_remaining_words();
        self.__ui.refresh();
      }

      return;
    },

    validate: function(hangul_word) {
      var self = this;

      self.__status = {};
      self.__status.word_changed = false;

      var is_already_used = self.__used_words.some( function(used_word) {
        return used_word.word.hangul == hangul_word;
      });

      if (is_already_used) {
        self.__status.message = WordChainConstants.ERROR_WORD_ALREADY_USED;
        return;
      }

      // Find data representation
      var data_words = self.__hanja_handler.get_words_by_hangul(hangul_word);
      if(!data_words || !data_words.length) {
        self.__status.message = WordChainConstants.ERROR_NOT_FOUND;
        return;
      }

      // Get submitted characters
      var submitted_hanja_characters = [];
      $.each( data_words, function(i, data_word) {
        // FIXME remove duplicates
        $.merge( submitted_hanja_characters, data_word.hanja.split('') );
      });

      // Check if any characters match the characters in the last word
      var latest_hanja_characters = self.__latest_word.word.hanja.split('');
      var used_same_hanja = latest_hanja_characters.some(function(latest_hanja) {
        return submitted_hanja_characters.some( function(submitted_hanja) {
          return submitted_hanja == latest_hanja;
        });
      });

      Debug.log('WordChainGameEngine', 'validate', {
        latest_hanja: latest_hanja_characters,
        submitted_hanja: submitted_hanja_characters,
        used_same: used_same_hanja
      });


      // Forcing to use the same hanja
      if (!used_same_hanja) {
        self.__status.message = WordChainConstants.ERROR_WRONG_HANJA;
        return;
      }

      // // Check if first syllable matches our last syllable / character
      // if ( first_hangul_syllable != self.__latest_last_syllable ) {
      //   self.__status.message = WordChainConstants.ERROR_WRONG_SYLLABLE;
      //   return;
      // }
      // if ( first_hanja_character != self.__latest_last_character ) {
      //   self.__status.message = WordChainConstants.ERROR_WRONG_HANJA;
      // }

      // FIXME no way to know which word the user meant
      // At least make sure the word has valid characters
      var valid_words = $.grep( data_words, function(data_word) {
        return latest_hanja_characters.some( function(latest_hanja) {
          return data_word.hanja.includes(latest_hanja);
        });
      });
      self.__add_word( valid_words[0], WordChainConstants.PLAYER );
      self.__status.word_changed = true;

      return;
    },

    get_latest_last_character: function() {
      return this.__latest_last_character;
    },
    get_latest_last_syllable: function() {
      return this.__latest_last_syllable;
    },

    get_latest_word: function() {
      return this.__latest_word;
    },

    __add_word: function( word, player ) {
      var self = this;

      Debug.log('WordChainGameEngine', '__add_word', {
        word: word,
        player: player
      });

      // Update last syllable
      var syllables = word.hangul.split('');

      // Update last character
      var chars = word.hanja.split('');
      self.__latest_last_character = chars[chars.length - 1];

      // Add hanja definitions
      var hanja_definitions = [];
      $.each( chars, function(index, char) {
        hanja_definitions.push({
          hanja: char,
          definition: self.__hanja_handler.get_hanja_definition(char)
        })
      });

      var added_word = {
        word: word,
        hangul_syllables: syllables,
        hanja_definitions: hanja_definitions,
        player: player
      };
      Debug.log('WordChainGameEngine', '__add_word', added_word);

      self.__latest_word = added_word;
      self.__used_words.push(added_word);

     //self.__get_random_image(added_word.hangul);

      return;
    },

    get_status: function() {
      return this.__status;
    },

    get_hanja_handler: function() {
      return this.__hanja_handler;
    },

    start: function() {
      var self = this;

      // Load definitions and translations and start UI
      self.__hanja_handler.init_hanja_data().then( function() {
        self.__ui.init();
        self.next();
      });
      return;
    }
  };

  return WordChainGameEngine;
});
