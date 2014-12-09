define(['backbone'], function(Backbone) {
	var Light = Backbone.Model.extend({
		x: 0,
		y: 0,
		z: 0,
		ambient: null,
		diffuse: null,
		specular: null,
		attC: 0,
		attL: 2,
		attQ: 0,
		initialize: function() {
			this.ambient = [1, 1, 0.5, 1];
			this.diffuse = [1, 1, 0.5, 1];
			this.specular = [1, 1, 0.5, 1];
		},
		addToArray: function(arr) {

			var tmpArr = [
				this.x, this.y, this.z, 255,    // POSITION
				Math.round(this.ambient[0] * 255), Math.round(this.ambient[1]* 255), Math.round(this.ambient[2]* 255), Math.round(this.ambient[3]* 255),
				Math.round(this.diffuse[0] * 255), Math.round(this.diffuse[1]* 255), Math.round(this.diffuse[2]* 255), Math.round(this.diffuse[3]* 255),
				Math.round(this.specular[0] * 255), Math.round(this.specular[1]* 255), Math.round(this.specular[2]* 255), Math.round(this.specular[3]* 255),
				this.attC, this.attL, this.attQ, 0
			];

			tmpArr.forEach(function(item) {
				arr.push(item);
			});

		},
		setPosition: function(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
		}
	});

	return Light;

});