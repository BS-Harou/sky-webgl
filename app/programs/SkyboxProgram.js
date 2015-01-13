define([
	'programs/Program', 'text!shaders/skybox.vert', 'text!shaders/skybox.frag'
], function(Program, vs, fs) {
	var SkyboxProgram = Program.extend({
		initialize: function() {
			Program.prototype.initialize.call(this);
			this.pgr = gl.createProgram('program2', vs, fs);
		},
		draw: function() {
			var cam = this.getCamera();


			gl.setProgram(this.pgr);

			var pMatrix = mat4.create();

			mat4.multiply(pMatrix, this.mProjection, cam.getMatrix());

			this.setGlobalUniforms();
			gl.setMatUniform('pMatrix', pMatrix);

			this.objects.forEach(function(object) {
				object.draw();
			});
		}
	});

	return SkyboxProgram;
});