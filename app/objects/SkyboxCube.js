define(['objects/Box', 'image!app/models/stars.jpg'], function(Box, texImage) {
	var SkyboxCube = Box.extend({
		initialize: function(width, height, length) {
			Box.prototype.initialize.apply(this, arguments);

			this.textures = [
				0, 1,
				1, 1,
				1, 0,
				0, 0,

				0, 1,
				0, 0,
				1, 1,
				1, 0,

				0, 1,
				0, 0,
				1, 1,
				1, 0,

				0, 1,
				0, 0,
				1, 1,
				1, 0,

				0, 1,
				1, 1,
				1, 0,
				0, 0,

				0, 1,
				1, 1,
				1, 0,
				0, 0
			];

			gl.bindVertexArray(this.vao);


			gl.setAttributes('aTexCoords', this.textures, 2);

			this.texture = this.setupTexture(texImage, gl.ctx.TEXTURE0);

			gl.bindVertexArray(null);
		},
		draw: function() {
			gl.bindVertexArray(this.vao);

			var mPosition = mat4.create();
			mat4.translate(mPosition, mPosition, [this.x, this.y, this.z]);
			if (this.rotateX != 0) mat4.rotateX(mPosition, mPosition, GL.degToRad(this.rotateX));
			if (this.rotateY != 0) mat4.rotateY(mPosition, mPosition, GL.degToRad(this.rotateY));
			if (this.rotateZ != 0) mat4.rotateZ(mPosition, mPosition, GL.degToRad(this.rotateZ));


			mat4.multiply(mPosition, mPosition, this.transform);


			gl.setMatUniform('uTransform', mPosition);


			gl.ctx.activeTexture(gl.ctx.TEXTURE0);
			gl.ctx.bindTexture(gl.ctx.TEXTURE_2D, this.texture);
			gl.setScalarUniform('uTexture', 0, 'i');

			this.drawInternal();

			gl.bindVertexArray(null);
		}
	});



	return SkyboxCube;
});