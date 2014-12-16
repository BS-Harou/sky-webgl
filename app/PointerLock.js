/**
 * @overview Handles pointer lock (infinite mouse moving in any direction)
 */
define(['backbone'], function(Backbone) {
	var PointerLock = Backbone.Model.extend({
		el: null,
		/**
		 * @constructor
		 * @param {HTMLElement} el
		 */
		initialize: function(el) {
			this.el = el;

			this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
			this.handleClick = this.handleClick.bind(this);
			this.handlePointerLockChange = this.handlePointerLockChange.bind(this);
			this.handlePointerLockError = this.handlePointerLockError.bind(this);


			document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
			document.getElementById('fullscreen').addEventListener('click', this.handleClick);
			document.addEventListener('pointerlockchange', this.handlePointerLockChange);
			document.addEventListener('pointerlockerror', this.handlePointerLockError);


		},
		handleFullscreenChange: function() {
			if (document.webkitFullscreenElement != this.el) {
				console.log('fullscreen err');
				return;
			}
			this.el.requestPointerLock();
		},
		handleClick: function() {
			this.el.webkitRequestFullscreen();
		},
		handlePointerLockChange: function() {
			var elem = document.getElementById('pointer-lock-element');
			if (document.pointerLockElement === elem) {
				console.log("Pointer Lock was successful.");
			} else {
				console.log("Pointer Lock was lost.");
			}
		},
		handlePointerLockError: function() {
			console.log("Error while locking pointer.");
		}
	});

	return PointerLock;
});