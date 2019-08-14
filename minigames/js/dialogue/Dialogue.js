define([
  'jquery',
  'utils/Debug',
  'Transfer',
  'tag-highlighter'
], function(
  $,
  Debug,
  Transfer,
  tag_highlighter
) {

  // Example dialogue
  /*
    스티브: 안녕하세요 린다 씨?
    뭐 하세요?

    린다: 어, 스티브 씨. 아침 먹어요.
    앉으세요.
    요즘 어떻게 지내세요?

    스티브: 잘 지내요. 린다 씨는 어때요?

    린다: 저도 잘 지내요.
    참, 인사하세요, 제 친구예요.

    스티브: 안녕하세요? 처음 뵙겠습니다.
    스티브 윌슨입니다.

    샌디: 안녕하세요? 샌디 왕이에요.
    반갑습니다.

  */

  Debug.enable_scope('Dialogue');

  function Dialogue(args) {
    var self = this;

    Debug.log('Dialogue', 'constructed');

    self.__container = args.container;

    self.__transfer = new Transfer({});

    self.__element = $('<div></div>');

    // Dialogue input
    self.__dialogue_input = $('<textarea></textarea>');
    self.__element.append( self.__dialogue_input );
    var dialogue_submit = $('<button>Parse</button>');
    dialogue_submit.on('click', function() {
      self.__init( self.__parse( self.__dialogue_input.val() ) );
    });
    self.__element.append(dialogue_submit);

    // Output
    self.__output_container = $('<div></div>');
    self.__output_container.addClass('dialogue_output');
    self.__element.append(self.__output_container);

    self.__container.append( self.__element );

    return;
  };

  var COLOR_OF = {
    predicate: 'red',
    modifier: 'blue',
    noun: 'green'
  };

  Dialogue.prototype = {

    __parse: function(string) {
      var self = this;

      Debug.log('Dialogue', '__parse::', string );

      var lines = string.split("\n");
      var characters = [];
      var current_character = '';
      var dialogue = [];
      $.each( lines, function(i, line) {
        if ( !line.length ) return;

        if ( line.includes(':') ) {
          var line_parts = line.split(':');
          var character = line_parts[0];
          line = line_parts[1];
          current_character = character;
        }
        dialogue.push({
          character: current_character,
          line: line
        });
      });

      return dialogue;
    },

    __init: function(dialogue) {
      var self = this;
      Debug.log('Dialogue', '__init::', dialogue);

      self.__output_container.empty();

      var current_index = 0;
      var current_character;

      var next = $('<button>></button>');

      var dialogue_step = function() {
        var bubble = $('<div></div>');
        bubble.addClass('dialogue_bubble');
        if ( dialogue[current_index].character != current_character ) {
          var avatar = $('<div>' + dialogue[current_index].character + '</div>');
          avatar.addClass('dialogue_avatar');
          bubble.append(avatar);
          current_character = dialogue[current_index].character;
          bubble.addClass('dialogue_bubble--avatar');
        }

        tag_highlighter.highlight( dialogue[current_index].line ).then( function(highlighted_line) {
          Debug.log( 'Dialogue', '__init:: got highlighted line', highlighted_line );
          bubble.append( highlighted_line );
        } );

        current_index++;
        self.__output_container.append(bubble);
      }

      next.on('click', function() {
        dialogue_step();
        if ( current_index == dialogue.length ) {
          next.remove();
        }
      });
      $(window).keypress( function(e) {
        if(e.key == 'Enter') {
          next.click();
        }
      });
      self.__output_container.after(next);

      dialogue_step();

      return;
    },

    start: function() {
      var self = this;
      $('.loader').remove();
      return;
    }
  };

  return Dialogue;

});
