/*
* Entry point from index.
* Loads a game and starts it.
*
* TODO might be smarter to do this selection on the server level
* with urls
*/
define([
  'jquery',
  'Debug',

  'HanjaGameEngine'
], function(
  $,
  Debug,

  HanjaGame
) {

  Debug.enable_scope('GameLoader');

  function GameLoader(args) {
    var self = this;
    var game = new HanjaGame({
      container: $('.content')
    });
    game.start();
    return;
  };
  return GameLoader;
});
