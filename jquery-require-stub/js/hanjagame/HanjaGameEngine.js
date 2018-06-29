/*
* Engine that contains the model level logic of the game.
*/
define([
  'jquery',
  'Debug',
  'HanjaHandler',
  'Session',
  'HanjaGameUI'
], function(
  $,
  Debug,
  HanjaHandler,
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


    // Handler for the language
    self.__hanja_handler = new HanjaHandler({});

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

    has_hanjas: function() {
      return this.__hanjas || this.__hanjas.length;
    },

    get_hanja_handler: function() {
      return this.__hanja_handler;
    },

    start: function() {
      var self = this;
      // Load definitions and translations and start UI
      self.__hanja_handler.init_hanja_data().then( function() {
        self.__ui.init();
      });
      return;
    }
  };

  return HanjaGameEngine;
});
