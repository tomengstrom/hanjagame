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

    $('.loader').remove();

    // DOM element; where we add graphics on the HTML page
    self.__element = $('.content');

    // Controller for the language
    self.__langcore = new LanguageCore({});

    return;
  };

  Game.prototype = {

  };

  return Game;
});
