/**
 * @overview Handle key strokes. Has keys map to support multikey shortcuts.
 */

define(['backbone'], function(Backbone) {

	var keyMap = {
		'backspace': 8,
		'tab': 9,
		'enter': 12,
		//16: 'shift',
		//17: 'ctrl',
		'capslock': 20,
		'esc': 27,
		'space': 32,
		'pgup': 33,
		'pgdown': 34,
		'end': 35,
		'home': 36,
		'left': 37,
		'up': 38,
		'right': 39,
		'down': 40,
		'insert': 45,
		'del': 46
	};

	var KeyHandler = Backbone.Model.extend({
		keys: null,
		onKeyDown: null,
		/**
		 * @constructor
		 */
		initialize: function() {
			this.keys = [];
			this.handleKeyDown = this.handleKeyDown.bind(this);
			this.handleKeyUp = this.handleKeyUp.bind(this);
		},
		/**
		 * Starts listening on keydown and keyp
		 */
		startListening: function() {
			document.addEventListener('keydown', this.handleKeyDown);
			document.addEventListener('keyup', this.handleKeyUp);
		},
		/**
		 * Stops listening on keydown and keyp
		 */
		stopListening: function() {
			document.removeEventListener('keydown', this.handleKeyDown);
			document.removeEventListener('keyup', this.handleKeyUp);
		},
		handleKeyDown: function(e) {
			this.keys[e.keyCode] = true;
			if (this.onKeyDown) {
				this.onKeyDown();
			}
		},
		handleKeyUp: function(e) {
			this.keys[e.keyCode] = false;
		},
		setKey: function(keyCode, value) {
			keyCode = this.getKeyCode(keyCode);
			this.keys[keyCode] = value;
		},
		/**
		 * @param {number|string} keyCode
		 * @return {number}
		 */
		getKeyCode: function(keyCode) {
			if (typeof keyCode == 'string') {
				keyCode = keyCode.toLowerCase();
				keyCode = keyMap[keyCode] ? keyMap[keyCode] : keyCode.toUpperCase().charCodeAt(0);
			}
			return keyCode;
		},
		/**
		 * Checks if given key is down
		 * @param {number|string} keyCode
		 * @return {boolean}
		 */
		isDown: function(keyCode) {
			keyCode = this.getKeyCode(keyCode);

			return !!this.keys[keyCode];
		},
		reset: function() {
			this.keys = [];
		}
	});


	return KeyHandler;
});