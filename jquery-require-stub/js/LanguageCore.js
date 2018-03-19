
define([
  'Debug'
], function(
  Debug
) {

  Debug.enableScope('LanguageCore');

  function LanguageCore() {
    var self = this;

    // Load the translations
    self.__data_deferred = $.Deferred();
    $.ajax({
      url: '/hanja',
      success: function(data) {
        Debug.log('LanguageCore', 'got hanja data', data);
        self.__data_deferred.resolve(data);
      }
    });
    return;
  };

  LanguageCore.prototype = {
    get_data: function() {
      return this.__data_deferred;
    }
  };

  return LanguageCore;
})
