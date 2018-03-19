/*
* Debug utility object.
* Allows disabling/enabling different scopes
* for logging messages to the console.
*
* (c) 2018 Tom Engström
*
*/
define(
	[],
	function() {


		var Debug;
		Debug = {

			__isDisabled: false,
			__isScopeEnabled: {},

			/*
			* Disables the Debug object.
			* All logging is muted.
			*/
			__disable: function() {
				this.__isDisabled = true;
			},

			isScopeEnabled: function(scope) {
				return this.__isScopeEnabled[scope];
			},

			/*
			* Enables a scope. Logging to this scope is visible in console log.
			* By default, no scope is enabled.
			*
			* @param {string} scope			A unique identifier for a scope.
			* @return null
			*/
			enableScope: function(scope) {
				this.__isScopeEnabled[scope] = true;
				return;
			},

			/*
			* Internal function; displays a message and an optional object.
			*
			* @param {string} message			A log message.
			* @param {object} object			(optional) An object.
			* @return null
			*/
			__log: function( message, object ) {
				if(this.__isDisabled) return;
				console.log(message);
				if ( object ) {
					console.log(object);
				}
				return;
			},

			/*
			*	Logs a line to the Debug.SCOPE_WARN scope. Used for "global" important
			* warning log messages that shouldn't be hidden for convenience.
			*
			* @param {string} message			A log message.
			* @param {object} object			(optional) An object.
			* @return null
			*/
			warn: function(message, object) {
				this.log( Debug.SCOPE_WARN, message, object );
			},

			/*
			*	Logs a line to the Debug.SCOPE_FATAL_ERROR scope and throws an error.
			* Used to report and fail in fatal situations.
			*
			* @param {string} message			A log message.
			* @param {object} object			(optional) An object.
			* @return null
			*/
			fatal: function(message, object) {
				this.log( Debug.SCOPE_FATAL_ERROR, object);
				throw (message);
			},

			/*
			*	Logs a message, if the specified scope has been enabled with
			* Debug.enableScope. Prepends the scope name to the message.
			*
			* @param {string} scopes			A unique identifier for a scope.
			* @param {string} message			A log message.
			* @param {object} object			(optional) An object.
			* @return null
			*/
			log: function( scope, message, object ) {
				var self = this;
				if ( !self.__isScopeEnabled[scope] ) return;
				return self.__log( scope + ':: ' + message, object);
			}
		};

		// Enable WARN and FATAL_ERROR scopes
		Debug.SCOPE_WARN = 'WARNING';
		Debug.SCOPE_FATAL_ERROR = 'FATAL ERROR';
		Debug.enableScope(Debug.SCOPE_WARN);
		Debug.enableScope(Debug.SCOPE_FATAL_ERROR);

		/* Uncomment this line to disable the Debug logger */
//		Debug.__disable();

		return Debug;
} );
