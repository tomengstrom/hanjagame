requirejs.config({
	baseUrl : 'js',
	paths: {

		// // Chat modules
		// 'Chat':	'chat/Chat',
		//
		// // Hanja game modules
		// 'HanjaGameEngine':  'hanjagame/HanjaGameEngine',
		// 'HanjaGameUI':			'hanjagame/ui/UI',
		//
		// // Word chain game modules
		// 'WordChainGameEngine':	'wordchaingame/WordChainGameEngine',
		// 'WordChainGameUI':			'wordchaingame/ui/UI',
		// 'WordChainConstants':		'wordchaingame/WordChainConstants',
		//
		// 'analyzer':					'magic/analyzer',
		// 'Magic': 						'magic/Magic',
		// 'Dialogue': 				'dialogue/Dialogue',
		//
		// // Interface independent modules
		// 'HanjaHandler':			'HanjaHandler',
		//
		// 'tag-highlighter':	'tag-highlighter',
    // 'Transfer':					'Transfer',
		// 'ModuleLoader':			'ModuleLoader',
		//
		// 'LearningCore':			'LearningCore',
		//
		// 'Session':					'Session',


    // Libs
    'jquery':         	'lib/jquery-3.3.1.min'

    // // Utilities
		// 'Debug':		    		'utils/Debug'
	},

	urlArgs: "cachebust=" + ( new Date() ).getTime()
} );

require( ['ModuleLoader'], function(ModuleLoader) {
	new ModuleLoader({});
} );
