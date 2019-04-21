/*
* Handles translations and definitions
*/
define([
  'jquery',
  'utils/Debug',
  'Transfer'

], function(
  $,
  Debug,
  Transfer
) {

  // FIXME better name
  Debug.enable_scope('HanjaHandler');

  function HanjaHandler(args) {
    var self = this;
    self.__transfer = new Transfer({});
    self.__init_def = null;

    // Contains English, Korean and Chinese translations
    self.__hanja_data = null;

    // Contains character definitions
    self.__hanja_definition_data = null;

    return;
  };

  HanjaHandler.prototype = {

    get_words_containing_hanjas: function(args) {
      var self = this;
      var hanjas = args.hanjas;
      var excludes = args.exclude;

      Debug.log('HanjaHandler', 'get_words_containing_hanjas', args);

      var words = self.__hanja_data;

      // Limit to words that include at least one of the hanja provided
      if (hanjas && hanjas.length) {
        words = $.grep( words, function(data) {
          for ( var i=0; i < hanjas.length; i++ ) {
            if ( data.hanja.includes(hanjas[i]) ) {
              return true;
            }
          }
          return false;
        });
      }

      Debug.log('HanjaHandler', 'get_words_containing_hanjas: words after hanja grep is ', words);

      // Exclude words in the list
      if (excludes && excludes.length) {
        words = $.grep( words, function(word) {
          return !excludes.includes(word);
        });
      }

      Debug.log('HanjaHandler', 'get_words_containing_hanjas: words after excludes is ', words);

      return words;
    },

    get_words_by_starting_hanja: function(args) {
      var self = this;
      var hanja = args.hanja;
      var excludes = args.exclude;

      Debug.log('HanjaHandler', 'get_words_by_starting_hanja', args);

      var words = self.__hanja_data;
      if (hanja) {
        words = $.grep( words, function(data) {
          return data.hanja.startsWith(hanja);
        });
      }

      Debug.log('HanjaHandler', 'get_words_by_starting_hanja: words after hanja grep is ', words);

      if (excludes && excludes.length) {
        words = $.grep( words, function(word) {
          return excludes.includes(word);
        });
      }

      Debug.log('HanjaHandler', 'get_words_by_starting_hanja: words after excludes is ', words);

      // Remove singletons
      words = $.grep( words, function(word) {
        return word.hanja.length > 1;
      });

      return words;
    },

    get_words_by_hangul: function( hangul_word ) {
      var self = this;
      var words = [];
      // FIXME pretty crazy going through the whole table
      return $.grep( self.__hanja_data, function(data) {
        return data.hangul == hangul_word;
      } );
    },

    get_hanja_data: function() {
      return this.__hanja_data;
    },
    get_hanja_definition_data: function() {
      return this.__hanja_definition_data;
    },

    /*
    * Get the definition of a hanja character
    *
    * @param {string} hanja_character    A single hanja character
    *
    * @return {string} definition        A definition of the character
    */
    get_hanja_definition: function(hanja_character) {
      var self = this;
      var definitions = [];
      // Find the definition of this character from the data
      for ( var i = 0; i < self.__hanja_definition_data.length; i++) {
        var def = self.__hanja_definition_data[i];
        if ( def.hanjas == hanja_character ) {
          return def.definition;
        }
      }
      return null;
    },

    /*
    * Get the definitions of the hanja characters contained in a word
    *
    * @param {string} hanja_word    A word written in hanja, containing 1 or more characters
    *
    * @return {array} definitions   Array containing the definitions
    */
    get_hanja_definitions: function(hanja_word) {
      var self = this;
      var hanjas = hanja_word.split('');
      var definitions = [];
      $.each( hanjas, function(i, hanja_character) {
        var def = self.get_hanja_definition(hanja_character);
        if (def) {
          definitions.push(def);
        }
      });
      return definitions;
    },

    init_hanja_data: function() {
      var self = this;

      if (self.__init_def) return self.__init_def;
      self.__init_def = $.Deferred();

      var get_defs = self.__transfer.get_hanja_definitions();
      self.__transfer.get_hanja_data().then(function(data) {
        // FIXME replace with queue?
        get_defs.then(function(def_data) {
          self.__hanja_data = data;
          self.__hanja_definition_data = def_data;
          self.__init_def.resolve();
        });

      });
      return self.__init_def;
    }
  };

  return HanjaHandler;
});
