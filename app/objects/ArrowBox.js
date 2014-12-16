define(['objects/Box', 'image!app/models/arrow.jpg'], function(Box, texImage) {
	var ArrowBox = Box.extend({
		initialize: function(width, height, length) {
			Box.prototype.initialize.apply(this, arguments);

			this.textures = Box.BOX_TEXTURES;

			//mat4.scale(this.textureTransform, this.textureTransform, [scaleBy, scaleBy, scaleBy]);
			mat4.rotateZ(this.textureTransform, this.textureTransform, GL.degToRad(-90));

			this.setColor(0.5, 0, 1);

			gl.bindVertexArray(this.vao);


			gl.setAttributes('aTexCoords', this.textures, 2);

			this.texture = this.setupTexture(texImage, gl.ctx.TEXTURE0);

			gl.bindVertexArray(null);
		},
		drawInternal: function() {
			mat4.translate(this.textureTransform, this.textureTransform, [0.02, 0, 0]);

			gl.render('elements', this.indices.length);
		}
	});



	return ArrowBox;
});