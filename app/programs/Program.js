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

			// --- LIHGTS ---

			var tex = gl.ctx.createTexture();
			gl.ctx.activeTexture(gl.ctx.TEXTURE0);
			gl.ctx.bindTexture(gl.ctx.TEXTURE_2D, tex);

			var lightArr = [];
			this.lights.forEach(function(light) {
				light.addToArray(lightArr);
			});


			var oneDTextureTexels = new Float32Array(lightArr);

			//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.ctx.texParameteri(gl.ctx.TEXTURE_2D, gl.ctx.TEXTURE_MIN_FILTER, gl.ctx.LINEAR);
			gl.ctx.texParameteri(gl.ctx.TEXTURE_2D, gl.ctx.TEXTURE_WRAP_S, gl.ctx.CLAMP_TO_EDGE);
			gl.ctx.texParameteri(gl.ctx.TEXTURE_2D, gl.ctx.TEXTURE_WRAP_T, gl.ctx.CLAMP_TO_EDGE);

			var width = oneDTextureTexels.length / 4;
			var height = 1;


			gl.ctx.texImage2D(gl.ctx.TEXTURE_2D, 0, gl.ctx.RGBA, width, height, 0, gl.ctx.RGBA, gl.ctx.FLOAT, oneDTextureTexels);


			gl.setScalarUniform('uLights', 0, 'i');
			gl.setScalarUniform('uNumberOfLights', this.lights.length, 'i');
			// gl.ctx.bindTexture(gl.ctx.TEXTURE_2D, null);
			// ---------------

			var pMatrix = mat4.create();
			var cam = this.cameras[this.selectedCamera];
			mat4.multiply(pMatrix, this.mProjection, cam.getMatrix());
			gl.setMatUniform('pMatrix', pMatrix);
			gl.setVecUniform('uCameraPosition', cam.getPosition());
			gl.setVecUniform('uGlobalAmbient', [0.1, 0.1, 0.1, 1.0]);

			this.objects.forEach(function(object) {
				object.draw();
			});
		}
	});

	return Program;
});