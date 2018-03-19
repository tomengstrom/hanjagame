requirejs.config({
	baseUrl : 'js',
	shim : {

	},
	paths: {

    'LanguageCore':     'LanguageCore',
    'Game':           'Game',

    // Libs
    'jquery':         'lib/jquery-3.3.1.min',

    // Utilities
		'Debug':		    'utils/Debug'
	},

	urlArgs: "cachebust=" + ( new Date() ).getTime()
} );

require( ['Game'], function(Game) {
	new Game({});
} );
