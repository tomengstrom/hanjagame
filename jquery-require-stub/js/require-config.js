requirejs.config({
	baseUrl : 'js',
	shim : {

	},
	paths: {

		// Hanja game modules
		'HanjaGameEngine':  'hanjagame/HanjaGameEngine',
		'HanjaGameUI':			'hanjagame/ui/UI',

		// Interface independent modules
    'Transfer':					'Transfer',
		'GameLoader':				'GameLoader',
		
		'LearningCore':			'LearningCore',

		'Session':					'Session',

    // Libs
    'jquery':         	'lib/jquery-3.3.1.min',

    // Utilities
		'Debug':		    		'utils/Debug'
	},

	urlArgs: "cachebust=" + ( new Date() ).getTime()
} );

require( ['GameLoader'], function(GameLoader) {
	new GameLoader({});
} );
