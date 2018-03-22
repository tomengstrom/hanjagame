/*
* DB connection and translation center
*/
define([
  'Debug'
], function(
  Debug
) {

  Debug.enable_scope('Transfer');

  function Transfer() {
    var self = this;
    self.__deferreds = {};
    return;
  };

  Transfer.prototype = {

    get_hanja_data: function() {
      var self = this;

      if(self.__deferreds['hanja']) return self.__deferreds['hanja'];

      self.__deferreds['hanja'] = $.Deferred();
      $.ajax({
        url: '/hanja',
        success: function(data) {
          Debug.log('DatabaseConnector', 'got hanja data', data);
          self.__deferreds['hanja'].resolve(data);
        }
      });
      return self.__deferreds['hanja'];
    },

    get_hanja_definitions: function() {
      var self = this;

      if(self.__deferreds['hanja_def']) return self.__deferreds['hanja_def'];

      self.__deferreds['hanja_def'] = $.Deferred();
      $.ajax({
        url: '/hanja_def',
        success: function(data) {
          Debug.log('DatabaseConnector', 'got hanja definition data', data);
          self.__deferreds['hanja_def'].resolve(data);
        }
      });
      return self.__deferreds['hanja_def'];
    }

  };

  return Transfer;
})
