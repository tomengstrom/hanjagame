/*
* Entry point from index.
* Loads a game and starts it.
*
* TODO might be smarter to do this selection on the server level
* with urls
*/
define([
  'jquery',
  'utils/Debug'
], function(
  $,
  Debug
) {

  Debug.enable_scope('ModuleLoader');

  function ModuleLoader(args) {
    var self = this;
    var container = $('.content');
    var module_id = container.attr('data-module') || 'Dialogue';

    require( [module_id], function(Module) {
      var module = new Module({
        container: container
      });
      module.start();
    });

    return;
  };
  return ModuleLoader;
});
