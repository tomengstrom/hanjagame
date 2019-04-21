/*
* Main container for the graphical representations of the game UI and
* world
*/
define([
  'jquery',
  'utils/Debug'
], function(
  $,
  Debug
) {

  Debug.enable_scope('HanjaGameUI');

  function UI(args) {
    var self = this;

    if(!args.container) throw 'element required';

    self.__container = args.container;
    self.__engine = args.engine;

    // DOM element; where we add graphics
    self.__element = $('<div></div>');

    // Hanja adder for debugging
    var hanja_adder = $('<input type="text"></input>');
    var submit = $('<button>Add</button>');
    submit.on('click', function() {
      var hanja = hanja_adder.val();
      self.__engine.add_hanja(hanja);
      self.__show_definition(hanja);
    });
    self.__element.append(hanja_adder);
    self.__element.append(submit);

    // Container for cards
    self.__card_container = $('<div></div>');
    self.__card_container.addClass('card-container');
    self.__element.append( self.__card_container );

    // Container for definitions
    self.__definition_container = $('<div></div>');
    self.__definition_container.addClass('def-container');
    self.__element.append( self.__definition_container );

    return;
  };

  UI.prototype = {

    /*
    * Creates a card of a word with english, hanja and hangeul
    * translations.
    */
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

    __show_definition: function(hanja_word) {
      var self = this;

      var defs = self.__engine.get_hanja_handler().get_hanja_definitions(hanja_word);
      self.__definition_container.empty();
      $.each( defs, function(i, def) {
        var def_element = $('<span></span>');
        def_element.html(def);
        self.__definition_container.append(def_element);
      });
      return;
    },

    refresh: function() {
      var self = this;
      Debug.log('HanjaGameUI', '__update_cards' );

      var hanja_handler = self.__engine.get_hanja_handler();

      // Exit if no hanjas added
      if ( !self.__engine.has_hanjas() ) return;

      // Exit if no data
      if (!hanja_handler.get_hanja_data() ) return;

      // Get the stored hanjas
      var hanjas = self.__engine.get_hanjas();

      // Get the appropriate word data
      var word_data = hanja_handler.get_hanja_data();
      Debug.log('HanjaGameUI', '__update_cards: added hanjas are', hanjas );

      // Empty all cards
      self.__card_container.empty();

      // Only show cards that match the hanja we have added
      $.each( word_data, function( i, tr_pair ) {

        var tr_pair_hanjas = tr_pair.hanja.split('');

        for ( var i = 0; i < tr_pair_hanjas.length; i++) {
          var hanja = tr_pair_hanjas[i];
          if ( $.inArray( hanja, hanjas ) > -1 ) {
            // It's a match, show the card and break
            var card = self.__create_card(tr_pair.english, tr_pair.hanja, tr_pair.hangul);
            self.__card_container.append(card);
            break;
          }
        }
      });

      return;
    },

    init: function() {
      var self = this;
      $('.loader').remove();
      self.__container.append( self.__element );
      return;
    }
  }

  return UI;

});
