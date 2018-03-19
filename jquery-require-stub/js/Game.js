/*
*
*/
define([
  'jquery',
  'Debug',
  'LanguageCore'
], function(
  $,
  Debug,
  LanguageCore
) {

  Debug.enableScope('Game');

  function Game(args) {
    var self = this;

    Debug.log('Game', 'constructed');


    // DOM element; where we add graphics on the HTML page
    self.__element = $('.content');

    // Controller for the language
    self.__langcore = new LanguageCore({});

    // Input for adding "known words"
    self.__hanjas = [];

    var hanja_adder = $('<input type="text"></input>');
    var submit = $('<button>Add</button>');
    submit.on('click', function() {
      var hanja = hanja_adder.val();
      self.__add_hanja(hanja);
      self.__update_cards();
    });
    self.__element.append(hanja_adder);
    self.__element.append(submit);

    self.__card_container = $('<div></div>');
    self.__element.append( self.__card_container );

    self.__langcore.get_data().then(function(data) {
      $('.loader').remove();
      self.__data = data;
    });

    return;
  };

  Game.prototype = {

    __create_card: function( e, c, k ) {
      var card = $('<div></div>');
      card.addClass('card');

      var english = $('<span class="english"></span>');
      english.html(e);
      card.append(english);

      var hanja = $('<span class="hanja"></span>');
      hanja.html(c);
      card.append(hanja);

      var hangul = $('<span class="hangul"></span>');
      hangul.html(k);
      card.append(hangul);

      return card;
    },

    __update_cards: function() {
      var self = this;

      Debug.log('Game', '__update_cards: added hanjas are', self.__hanjas);

      // Empty all cards
      self.__card_container.empty();

      // Exit if no hanjas added
      if (!self.__hanjas || !self.__hanjas.length) return;

      // Exit if no data
      if (!self.__data) return;

      // Only show cards that match the hanja we have added
      $.each( self.__data, function( i, tr_pair ) {

        var tr_pair_hanjas = tr_pair.hanja.split('');

        for ( var i = 0; i < tr_pair_hanjas.length; i++) {
          var hanja = tr_pair_hanjas[i];
          if ( $.inArray( hanja, self.__hanjas ) > -1 ) {
            // It's a match, show the card and break
            var card = self.__create_card(tr_pair.english, tr_pair.hanja, tr_pair.hangul);
            self.__card_container.append(card);
            break;
          }
        }
      });

      return;
    },

    __add_hanja: function(hanja_word) {
        var self = this;
        Debug.log('Game', '__add_hanja ' + hanja_word);
        var added_hanjas = hanja_word.split('');
        for(var i=0; i < added_hanjas.length; i++) {
          var hanja = added_hanjas[i];
          if ( $.inArray( hanja, self.__hanjas ) < 0 ) {
            self.__hanjas.push(hanja);
            Debug.log('Game', '__add_hanja: adding hanja: ' + hanja);
          }
        }
        return;
    }
  };

  return Game;
});
