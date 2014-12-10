/**
 * @overview Loads list of models including positions and rotations.
 */
define([
	'backbone', 'objects/Antenna', 'objects/Astronaut', 'objects/Agena', 'objects/Apollo', 'objects/Vehicle', /*'objects/ISS',*/
	'objects/Jupiter', 'objects/Mir'
],
function(Backbone, Antenna, Astronaut, Agena, Apollo, Vehicle, /*ISS,*/ Jupiter, Mir) {

	var objects = {
		Antenna: Antenna,
		Astronaut: Astronaut,
		Agena: Agena,
		Apollo: Apollo,
		Vehicle: Vehicle,
		Jupiter: Jupiter,
		Mir: Mir
	};

	var Config = Backbone.Model.extend({
		program: null,
		loading: false,
		objects: null,

		/**
		 * @constructor
		 * @param {WebGLProgram} program
		 */
		initialize: function(program) {
			this.objects = [];
			this.program = program;
			var button = document.querySelector('#reload');
			var that = this;
			button.onclick = function() {
				that.loadModels();
			};
		},
		loadModels: function() {
			if (this.loading) return;
			var that = this;
			this.objects.forEach(function(object) {
				var i = that.program.objects.indexOf(object);
				that.program.objects.splice(i, 1);
			});
			this.objects.length = 0;


			this.loading = true;
			require(['text!config.txt'], function(conf) {
				var lines = conf.split('\n');
				lines.forEach(function(line) {
					var data = line.split(',');
					if (data.length < 4) return;

					var Factory = objects[data[0].trim()];
					var object = new Factory();
					object.setPosition(
						parseFloat(data[1].trim()),
						parseFloat(data[2].trim()),
						parseFloat(data[3].trim())
					);
					if (data[4]) object.rotateX = parseFloat(data[4].trim());
					if (data[5]) object.rotateY = parseFloat(data[5].trim());
					if (data[6]) object.rotateZ = parseFloat(data[6].trim());
					that.objects.push(object);
					that.program.addObject(object);
				});

				require.undef('text!config.txt');
				that.loading = false;
			});
		}
	});

	return Config;
});