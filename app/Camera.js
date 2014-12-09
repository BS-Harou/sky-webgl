define(['backbone'], function(Backbone) {

	var camTransition = {
		enabled: false,
		step: 0,
		from: [],
		to: [],
		start: function(vecFrom, vecTo) {
			this.enabled = true;
			this.from = vecFrom;
			this.to = vecTo;
		},
		stop: function() {
			this.step = 0;
			this.enabled = false;
		},
		getStep: function(n) {
			var x = 10;
			var to = this.to;
			var from = this.from;
			return [
				[from[0][0] - (from[0][0] - to[0][0]) * n / x, from[0][1] - (from[0][1] - to[0][1]) * n / x, from[0][2] - (from[0][2] - to[0][2]) * n / x],
				[from[1][0] - (from[1][0] - to[1][0]) * n / x, from[1][1] - (from[1][1] - to[1][1]) * n / x, from[1][2] - (from[1][2] - to[1][2]) * n / x],
				[from[2][0] - (from[2][0] - to[2][0]) * n / x, from[2][1] - (from[2][1] - to[2][1]) * n / x, from[2][2] - (from[2][2] - to[2][2]) * n / x],
			];
		}
	};

	var Camera = Backbone.Model.extend({
		x: 0,
		y: 0,
		z: 0,
		center: null,
		up: null,
		rotateX: 0,
		rotateY: 0,
		transition: camTransition,
		initialize: function(x, y, z) {
			this.center = { x: 0, y: 0, z: 0};
			this.up = { x: 0, y: 0, z: 0};
			this.setPosition(x, y, z);
		},
		setPosition: function(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
		},
		getPosition: function() {
			return [this.x, this.y, this.z];
		},
		setCenter: function(x, y, z) {
			this.center.x = x;
			this.center.y = y;
			this.center.z = z;
		},
		setUp: function(x, y, z) {
			this.up.x = x;
			this.up.y = y;
			this.up.z = z;
		},
		computeUp: function() {
			var lookVector = [this.center.x - this.x, this.center.y - this.y, this.center.z - this.z];

			var norm = vec3.create();
			vec3.normalize(norm, lookVector);

			var rightVector = vec3.create();
			vec3.cross(rightVector, lookVector, [0, 0, 1]);

			var upVector = vec3.create();
			vec3.cross(upVector, rightVector, lookVector);

			this.setUp(upVector[0], upVector[1], upVector[2]);
		},
		getMatrix: function() {
			var arr = [
				[this.x, this.y, this.z],
				[this.center.x, this.center.y, this.center.z],
				[this.up.x, this.up.y, this.up.z]
			];
			var mat = mat4.create();
			return mat4.lookAt(mat, arr[0], arr[1], arr[2]);
		}

	});

	return Camera;
});