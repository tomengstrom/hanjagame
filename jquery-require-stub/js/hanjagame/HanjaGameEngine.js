/*
* Engine that contains the model level logic of the game.
*/
define([
  'jquery',
  'Debug',
  'Transfer',
  'Session',
  'HanjaGameUI'
], function(
  $,
  Debug,
  Transfer,
  Session,
  UI
) {

  Debug.enable_scope('HanjaGameEngine');

  function HanjaGameEngine(args) {
    var self = this;

    Debug.log('HanjaGameEngine', 'constructed');

    self.__ui = new UI({
      container: args.container,
      engine: self
    });


    // Controller for the language
    self.__transfer = new Transfer({});

    // Input for adding "known words"
    self.__hanjas = [];

    // Session
    // TODO store the player's progress
    self.__session = new Session({});

    // FIXME need two game modes
    // 1 deck builder and strengthener - build a list of known words
    // 2 combat mode - fight based on deck

    // These are kind of minigames inside the hanja game
    // and they ALL have to feed back up to the language learning core

    return;
  };

  HanjaGameEngine.prototype = {
    /*
    * Adds a Hanja to the learner's encountered list
    */
    add_hanja: function(hanja_word) {
        var self = this;
        Debug.log('HanjaGameEngine', '__add_hanja ' + hanja_word);
        var added_hanjas = hanja_word.split('');
        for(var i=0; i < added_hanjas.length; i++) {
          var hanja = added_hanjas[i];
          if ( $.inArray( hanja, self.__hanjas ) < 0 ) {
            self.__hanjas.push(hanja);
            Debug.log('HanjaGameEngine', '__add_hanja: adding hanja: ' + hanja);
          }
        }
        self.__ui.refresh();
        return;
    },
    get_hanjas: function() {
      return this.__hanjas;
    },

    get_all_data: function() {
      return this.__data;
    },

    get_word_data: function() {
      // FIXME this should return something fitting the context
      return this.__data;
    },

    has_hanjas: function() {
      return this.__hanjas || this.__hanjas.length;
    },

    get_def_data: function() {
      return this.__def_data;
    },

    get_definitions: function(hanja_word) {
      var self = this;
      var hanjas = hanja_word.split('');
      var definitions = [];
      $.each( hanjas, function(i, hanja) {
        for ( var i = 0; i < self.__def_data.length; i++) {
          var def = self.__def_data[i];
          if ( def.hanjas == hanja ) {
            definitions.push( def.definition );
            break;
          }
        }
      });

      return definitions;
    },

    start: function() {
      var self = this;

      var get_defs = self.__transfer.get_hanja_definitions();
      self.__transfer.get_hanja_data().then(function(data) {
        self.__data = data;

        // FIXME replace with queue
        get_defs.then(function(def_data) {
          Debug.log('HanjaGameEngine', 'got hanja definitions: ', def_data);
          self.__def_data = def_data;

          self.__ui.init();
        });

      });

      return;
    }
  };

  return HanjaGameEngine;
});
