define([
	'programs/Program', 'text!shaders/picking.vert', 'text!shaders/picking.frag'
], function(Program, vs, fs) {
	var PickingProgram = Program.extend({
		hostProgram: null,
		initialize: function(hostProgram) {
			this.hostProgram = hostProgram;
			Program.prototype.initialize.call(this);
			this.pgr = gl.createProgram('picking', vs, fs);

			this.objects = hostProgram.objects;
			this.cameras = hostProgram.cameras;
			this.lights = hostProgram.lights;
		},
		getCamera: function() {
			return this.hostProgram.getCamera();
		},
		draw: function() {
			var cam = this.getCamera();


			gl.setProgram(this.pgr);

			var pMatrix = mat4.create();
			mat4.multiply(pMatrix, this.mProjection, cam.getMatrix());

			gl.setMatUniform('pMatrix', pMatrix);



			this.objects.forEach(function(object) {
				if (object.pickingColor) {
					object.pickingDraw();
				}
			});
		}
	});

	return PickingProgram;
});
