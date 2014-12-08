define(['backbone'], function(Backbone) {
	var Program = Backbone.Model.extend({
		pgr: null,
		objects: null,
		cameras: null,
		lights: null,
		selectedCamera: -1,
		mProjection: null,
		initialize: function() {
			this.objects = [];
			this.cameras = [];
			this.lights = [];

			this.mProjection = mat4.create();
			mat4.identity(this.mProjection);
			mat4.perspective(this.mProjection, GL.degToRad(45), gl.el.width / gl.el.height, 0.1, 3000.0);
		},
		addObject: function(o) {
			this.objects.push(o);
		},
		addCamera: function(c) {
			this.cameras.push(c);
			if (this.cameras.length == 1) {
				this.selectedCamera = 0;
			}
		},
		addLight: function(l) {
			this.lights.push(l);
		},
		draw: function() {
			if (this.selectedCamera == -1) {
				throw new Error('Can\'t draw without camera');
			}

			var pMatrix = mat4.create();
			var cam = this.cameras[this.selectedCamera];
			mat4.multiply(pMatrix, this.mProjection, cam.getMatrix());
			gl.setMatUniform('pMatrix', pMatrix);

			this.objects.forEach(function(object) {
				object.draw();
			});
		}
	});

	return Program;
});