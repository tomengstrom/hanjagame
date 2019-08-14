define([
  'jquery',
  'utils/Debug',
  'Transfer'
], function(
  $,
  Debug,
  Transfer
) {

  Debug.enable_scope('HanjaSaver');

  function HanjaSaver(args) {
    var self = this;

    Debug.log('HanjaSaver', 'constructed');

    self.__container = args.container;

    self.__transfer = new Transfer({});

    self.__element = $('<div></div>');

    // Output
    self.__output_container = $('<div></div>');
    self.__element.append(self.__output_container);

    // Input
    var input_container = $('<div></div>');
    input_container.addClass('input-container');

    self.__word_input = $('<input type="text"></input>');
    var submit = $('<button>></button>');
    submit.on('click', function() {
      var hangul = self.__word_input.val();
      self.__transfer.get_data_by_hangul_syllable(hangul_syllable).then(function(results) {
          self.__show_results(results);
      })
    });
    self.__word_input.keypress(function(e) {
      if(e.key == 'Enter') {
        submit.click();
        self.__word_input.empty();
      }
    });
    input_container.append(self.__word_input);
    input_container.append( submit);
    self.__element.append( input_container );

    self.__container.append( self.__element );

    return;
  };

  var COLOR_OF = {
    predicate: 'red',
    modifier: 'blue',
    noun: 'green'
  };

  Chat.prototype = {

    __save_row: function(row_data) {
      var self = this;
      var set_name = self.__set_name_input.val();
      self.__transfer.save_to_set({
        set: set_name,
        data: row_data
      });
      return;
    },

    __show_results: function(results) {
      var self = this;
      Debug.log('HanjaSaver', '__show_results', results);

      self.__output_container.empty();

      $.each( results, function(i, result) {
        var row = $('<div></div>');

        var save = $('<button>Save</button>');
        save.on('click', function() {
          self.__save_row(result);
        });
      });

      return;
    },
    start: function() {
      var self = this;
      $('.loader').remove();
      return;
    }
  };

  return Chat;

});
