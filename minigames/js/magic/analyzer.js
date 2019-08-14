define([
  'jquery',
  'utils/Debug'
], function(
  $,
  Debug
) {

  return {

    contains_subject: function(words) {
      return words.some( function(word) {
        return word.is_subject;
      });
    },

    contains_topic: function(words) {
      return words.some( function(word) {
        return word.is_topic;
      });
    }

  }

});