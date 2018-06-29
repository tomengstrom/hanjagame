/*
* Talks with the database
*/
define([
  'Debug',
  'jquery'
], function(
  Debug,
  $
) {

  Debug.enable_scope('Transfer');

  function Transfer() {
    var self = this;
    self.__deferreds = {};
    return;
  };

  Transfer.prototype = {

    analyze: function(sentence_data) {
      var self = this;
      var extract_def = $.Deferred();

      $.ajax({
        url: '/analyze',
        type: 'POST',
        data: {
          sentence: sentence_data
        },
        success: function(data) {
          Debug.log('Transfer', 'analyze: success', data);
          extract_def.resolve(data);
        }
      })

      return extract_def;
    },

    get_hanja_data: function() {
      var self = this;

      if(self.__deferreds['hanja']) return self.__deferreds['hanja'];

      self.__deferreds['hanja'] = $.Deferred();
      $.ajax({
        url: '/hanja',
        success: function(data) {
          Debug.log('Transfer', 'got hanja data', data);
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
          Debug.log('Transfer', 'got hanja definition data', data);
          self.__deferreds['hanja_def'].resolve(data);
        }
      });
      return self.__deferreds['hanja_def'];
    }

  };

  return Transfer;
})
