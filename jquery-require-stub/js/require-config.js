requirejs.config({
	baseUrl : 'js',
	shim : {

	},
	paths: {

		// Chat modules
		'Chat':	'chat/Chat',

		// Hanja game modules
		'HanjaGameEngine':  'hanjagame/HanjaGameEngine',
		'HanjaGameUI':			'hanjagame/ui/UI',

		// Word chain game modules
		'WordChainGameEngine':	'wordchaingame/WordChainGameEngine',
		'WordChainGameUI':			'wordchaingame/ui/UI',
		'WordChainConstants':		'wordchaingame/WordChainConstants',

		// Interface independent modules
		'HanjaHandler':			'HanjaHandler',

    'Transfer':					'Transfer',
		'ModuleLoader':				'ModuleLoader',

		'LearningCore':			'LearningCore',

		'Session':					'Session',

    // Libs
    'jquery':         	'lib/jquery-3.3.1.min',

    // Utilities
		'Debug':		    		'utils/Debug'
	},

	urlArgs: "cachebust=" + ( new Date() ).getTime()
} );

require( ['ModuleLoader'], function(ModuleLoader) {
	new ModuleLoader({});
} );
