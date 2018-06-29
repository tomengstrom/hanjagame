define([], function() {
  var Constants = {};
  Constants.ERROR_WRONG_SYLLABLE = 'wrong_syllable';
  Constants.ERROR_WRONG_HANJA = 'wrong_hanja';
  Constants.ERROR_WORD_ALREADY_USED = 'already_used';
  Constants.ERROR_NOT_FOUND = 'word_not_found';

  Constants.MESSAGE_OF = {};
  Constants.MESSAGE_OF[Constants.ERROR_WRONG_HANJA] = 'Incorrect hanja.';
  Constants.MESSAGE_OF[Constants.ERROR_WORD_ALREADY_USED] = 'Word already used.';
  Constants.MESSAGE_OF[Constants.ERROR_NOT_FOUND]         = 'Word not found in corpus.';

  Constants.OPPONENT = 'opponent';
  Constants.PLAYER = 'player';
  return Constants;
})
