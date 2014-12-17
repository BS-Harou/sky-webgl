define([
	'programs/Program', 'text!shaders/classic.vert', 'text!shaders/classic.frag'
], function(Program, vs, fs) {
	var ClassicProgram = Program.extend({
		initialize: function() {
			Program.prototype.initialize.call(this);
			this.pgr = gl.createProgram('program1', vs, fs);
		}
	});

	return ClassicProgram;
});