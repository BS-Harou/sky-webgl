define(['objects/SceneObject', 'image!app/models/stars.jpg'], function(SceneObject, texImage) {
	var Plain = SceneObject.extend({
		x: 0,
		z: 0,
		vertices: null,
		vertexNormals: [],
		indices: null,
		initialize: function(width, height) {
			SceneObject.prototype.initialize.call(this);


			this.vertices = [
				-width/2, 0, -height/2,
				 width/2, 0, -height/2,
				 width/2, 0,  height/2,
				-width/2, 0,  height/2
			];

			this.vertexNormals = [
				 0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0
			];

			this.indices = [
				0, 1, 2,
				0, 2, 3
			];

			this.textures = [
				0, 1,
				1, 1,
				1, 0,
				0, 0
			];

			gl.bindVertexArray(this.vao);

			gl.setAttributes('pos', this.vertices, 3);
			gl.setAttributes('normal', this.vertexNormals, 3);
			gl.setAttributes('aTexCoords', this.textures, 2);

			gl.setIndices(this.indices);

			this.color = [1, 1, 1, 1];
			this.material.ambient = this.material.specular = this.material.diffuse = this.color;

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

	return Plain;
});