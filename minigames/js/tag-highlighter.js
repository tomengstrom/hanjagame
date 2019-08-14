/*
* Highlights tags in text lines
*/
define([
  'jquery',
  'utils/Debug',
  'Transfer'

], function(
  $,
  Debug,
  Transfer
) {

  Debug.enable_scope('tag-highlighter');

  var tag_highlighter = {

    highlight: function(sentence) {
      var self = this;

      var deferred = $.Deferred();
      var transfer = new Transfer({});
      transfer.analyze(sentence).then( function(result) {
        Debug.log( 'tag-highlighter', 'highlight:: got result', {
          result: result,
          analyzed_sentence: sentence
        } );
        var html_sentence = $('<p></p>');
        $.each( result.parsed.words, function(word_i, word ) {
          var word_el = $('<span></span>');
          word_el.addClass('word');
          word_el.html(word.surface);

          if( word.is_predicate) {
            word_el.addClass('word--predicate');
          }
          if(word.is_subject) {
            word_el.addClass('word--subject');
          }
          if(word.is_topic) {
            word_el.addClass('word--topic');
          }
          if(word.is_object) {
            word_el.addClass('word--object');
          }

          html_sentence.append(word_el);

        } );

        deferred.resolve(html_sentence);
      } );

      return deferred;
    }
  };

  return tag_highlighter;
});
