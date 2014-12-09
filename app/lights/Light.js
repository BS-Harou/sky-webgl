define(['backbone'], function(Backbone) {
	var Light = Backbone.Model.extend({
		x: 0,
		y: 0,
		z: 0,
		ambient: null,
		diffuse: null,
		specular: null,
		attC: 0,
		attL: 1,
		attQ: 0,
		initialize: function() {
			this.ambient = [1, 0, 0, 1];
			this.diffuse = [0, 1, 0, 1];
			this.specular = [0, 0, 1, 1];
		},
		addToArray: function(arr) {

			var mult = 1;

			var tmpArr = [
				this.x, this.y, this.z, 1,    // POSITION
				this.ambient[0] * mult, this.ambient[1]* mult, this.ambient[2]* mult, this.ambient[3]* mult,
				this.diffuse[0] * mult, this.diffuse[1]* mult, this.diffuse[2]* mult, this.diffuse[3]* mult,
				this.specular[0] * mult, this.specular[1]* mult, this.specular[2]* mult, this.specular[3]* mult,
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
		},
		getPosition: function(x, y, z) {
			return [this.x, this.y, this.z];
		},
		setColor: function(r, g, b) {
			this.ambient = [r, g, b, 1];
			this.diffuse = [r, g, b, 1];
			this.specular = [r, g, b, 1];
		}
	});

	return Light;

});