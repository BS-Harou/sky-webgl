define(['objects/Box', 'image!app/models/explosion.png'], function(Box, texImage) {
	var ArrowBox = Box.extend({
		animationStep: 0,
		animationRows: 4,
		animationColumns: 4,
		animationImages: 16,
		animationEnabled: true,
		initialize: function(width, height, length) {
			Box.prototype.initialize.apply(this, arguments);

			this.textures = Box.BOX_TEXTURES;


			//mat4.rotateZ(this.textureTransform, this.textureTransform, GL.degToRad(-90));

			this.setColor(0.5, 0, 1);

			gl.bindVertexArray(this.vao);
			gl.setAttributes('aTexCoords', this.textures, 2);
			this.texture = this.setupTexture(texImage, gl.ctx.TEXTURE0);
			gl.bindVertexArray(null);
		},
		handlePick: function() {
			this.animationEnabled = !this.animationEnabled;
		},
		drawInternal: function() {
			this.textureTransform = mat4.create();
			var scaleBy = 0.25;
			mat4.scale(this.textureTransform, this.textureTransform, [scaleBy, scaleBy, scaleBy]);
			mat4.translate(this.textureTransform, this.textureTransform, [0, 3, 0]);

			var moveToRight = Math.floor(this.animationStep) % this.animationColumns;
			var moveToTop = Math.floor(Math.floor(this.animationStep) / this.animationRows);

			mat4.translate(this.textureTransform, this.textureTransform, [moveToRight, -moveToTop, 0]);

			if (this.animationEnabled) {
				this.animationStep += 0.25;
			}

			if (this.animationStep >= this.animationImages) {
				this.animationStep = 0;
			}

			gl.render('elements', this.indices.length);
		}
	});



	return ArrowBox;
});