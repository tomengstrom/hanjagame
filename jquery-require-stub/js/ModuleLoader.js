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

  'WordChainGameEngine',
  'HanjaGameEngine',

  'Chat'
], function(
  $,
  Debug,

  WordChainGame,
  HanjaGame,
  Chat
) {

  Debug.enable_scope('ModuleLoader');

  function ModuleLoader(args) {
    var self = this;
    // var module = new HanjaGame({
    //   container: $('.content')
    // });

    var module = new WordChainGame({
      container: $('.content')
    });

    // var module = new HanjaSaver({
    //   container: $('.content')
    // });

    // var module = new Chat({
    //   container: $('.content')
    // });

    module.start();
    return;
  };
  return ModuleLoader;
});
