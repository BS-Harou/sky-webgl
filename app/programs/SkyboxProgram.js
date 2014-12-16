define([
	'programs/Program', 'text!shaders/skybox.vs', 'text!shaders/skybox.fs'
], function(Program, vs, fs) {
	var SkyboxProgram = Program.extend({
		initialize: function() {
			Program.prototype.initialize.call(this);
			this.pgr = gl.createProgram('program2', vs, fs);
		},
		draw: function() {
			if (this.selectedCamera == -1) {
				throw new Error('Can\'t draw without camera');
			}


			gl.setProgram(this.pgr);

			var pMatrix = mat4.create();
			var cam = this.getCamera();
			mat4.multiply(pMatrix, this.mProjection, cam.getMatrix());

			gl.setMatUniform('pMatrix', pMatrix);

			this.objects.forEach(function(object) {
				object.draw();
			});
		}
	});

	return SkyboxProgram;
});