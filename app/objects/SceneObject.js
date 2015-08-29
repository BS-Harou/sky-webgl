/**
 * @overview Top class for models in scene
 */
define(['backbone'], function(Backbone) {

	var pickingColorR = 0;
	var pickingColorG = 0;
	var pickingColorB = 0;

	function getPickingColor(object) {
		pickingColorB += 5;
		if (pickingColorB >= 255) {
			pickingColorB = 0;
			pickingColorG += 5;
		}
		if (pickingColorG >= 255) {
			pickingColorG = 0;
			pickingColorR += 5;
		}
		if (pickingColorR >= 255) {
			throw 'Out of picking colors';
		}

		gl.pickingObjects[pickingColorR + ':' + pickingColorG + ':' + pickingColorB] = object;

		return [pickingColorR / 255, pickingColorG / 255, pickingColorB / 255, 1];
	}

	var SceneObject = Backbone.Model.extend({
		vao: null,
		x: 0.4,
		y: 0.15,
		z: 0,
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		speed: 0,
		vertices: null,
		vertexNormals: null,
		indices: null,
		vectorSize: 3,
		transform: null,
		color: null,
		material: null,
		texture: null,
		textureTransform: null,
		specMap: null,
		pickingColor: null,
		/**
		 * @constructor
		 */
		initialize: function() {
			this.transform = mat4.create();
			this.textureTransform = mat4.create();
			this.vertices = [];
			this.vertexNormals = [];
			this.indices = [];
			this.vao = gl.createVertexArray();
			this.color = [1, 1, 1, 1];

			this.material = {
				ambient: [0.2, 0.2, 0.2, 1.0],
				diffuse: [0.8, 0.8, 0.8, 1.0],
				specular: [0.5, 0.5, 0.5, 1.0],
				emission: [0.0, 0.0, 0.0, 1.0],
				shininess: 1
			};
		},
		enablePicking: function() {
			this.pickingColor = getPickingColor(this);
		},
		/**
		 * Called when object is picked by mouse
		 */
		handlePick: function() {
			console.log('Object picked, but no action attached.');
		},
		get vectorCount() {
			return (_ref = this.vertices ? _ref.length : 0) / this.vectorSize;
		},
		setPosition: function(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
		},
		/**
		 * Called in animation frame to draw the object
		 */
		draw: function() {
			gl.bindVertexArray(this.vao);

			var mPosition = mat4.create();
			mat4.translate(mPosition, mPosition, [this.x, this.y, this.z]);
			if (this.rotateX != 0) mat4.rotateX(mPosition, mPosition, GL.degToRad(this.rotateX));
			if (this.rotateY != 0) mat4.rotateY(mPosition, mPosition, GL.degToRad(this.rotateY));
			if (this.rotateZ != 0) mat4.rotateZ(mPosition, mPosition, GL.degToRad(this.rotateZ));


			mat4.multiply(mPosition, mPosition, this.transform);

			if (this.isFirstLantern) {
				mat4.translate(mPosition, mPosition, [0.2, 0, 0]);
			}

			gl.setVecUniform('uColor', this.color);
			gl.setMatUniform('uTransform', mPosition);

			var mNorm = mat4.create();
			mat4.invert(mNorm, mPosition);
			mat4.transpose(mNorm, mNorm);
			gl.setMatUniform('uNormalTransform', mNorm);

			gl.setMatUniform('uTextureTransform', this.textureTransform);

			gl.setVecUniform('uMaterialAmbient', this.material.ambient);
			gl.setVecUniform('uMaterialDiffuse', this.material.diffuse);
			gl.setVecUniform('uMaterialSpecular', this.material.specular);
			gl.setVecUniform('uMaterialEmission', this.material.emission);
			gl.setScalarUniform('uMaterialShininess', this.material.shininess);

			if (this.texture) {
				gl.ctx.activeTexture(gl.ctx.TEXTURE1);
				gl.ctx.bindTexture(gl.ctx.TEXTURE_2D, this.texture);
				gl.setScalarUniform('uTexture', 1, 'i');
			}

			if (this.specMap) {
				gl.ctx.activeTexture(gl.ctx.TEXTURE2);
				gl.ctx.bindTexture(gl.ctx.TEXTURE_2D, this.specMap);
				gl.setScalarUniform('uMapTexture', 2, 'i');
			}

			gl.setScalarUniform('uUseTextures', !!this.texture, 'i');
			gl.setScalarUniform('uUseSpecMap', !!this.specMap, 'i');

			this.drawInternal();
			gl.bindVertexArray(null);
		},
		/**
		 * Called when picking program is drawing (draws object only in picking color)
		 */
		pickingDraw: function() {
			gl.bindVertexArray(this.vao);

			var mPosition = mat4.create();
			mat4.translate(mPosition, mPosition, [this.x, this.y, this.z]);
			if (this.rotateX != 0) mat4.rotateX(mPosition, mPosition, GL.degToRad(this.rotateX));
			if (this.rotateY != 0) mat4.rotateY(mPosition, mPosition, GL.degToRad(this.rotateY));
			if (this.rotateZ != 0) mat4.rotateZ(mPosition, mPosition, GL.degToRad(this.rotateZ));

			mat4.multiply(mPosition, mPosition, this.transform);

			gl.setVecUniform('uPickingColor', this.pickingColor);
			gl.setMatUniform('uTransform', mPosition);

			this.drawInternal();

			gl.bindVertexArray(null);
		},
		setupTexture: function(img, texture_num) {
			var tex = gl.ctx.createTexture();
			gl.ctx.activeTexture(texture_num);
			gl.ctx.bindTexture(gl.ctx.TEXTURE_2D, tex);
			gl.ctx.pixelStorei(gl.ctx.UNPACK_FLIP_Y_WEBGL, true);
			gl.ctx.texImage2D(gl.ctx.TEXTURE_2D, 0, gl.ctx.RGBA, gl.ctx.RGBA, gl.ctx.UNSIGNED_BYTE, img);

			gl.ctx.texParameteri(gl.ctx.TEXTURE_2D, gl.ctx.TEXTURE_MAG_FILTER, gl.ctx.LINEAR);
			gl.ctx.texParameteri(gl.ctx.TEXTURE_2D, gl.ctx.TEXTURE_MIN_FILTER, gl.ctx.LINEAR_MIPMAP_LINEAR);
			//gl.ctx.texParameteri(gl.ctx.TEXTURE_2D, gl.ctx.TEXTURE_MIN_FILTER, gl.ctx.LINEAR);
			gl.ctx.generateMipmap(gl.ctx.TEXTURE_2D);
			gl.ctx.bindTexture(gl.ctx.TEXTURE_2D, null);
			return tex;
		},
		drawInternal: function() {
			gl.render('elements', this.indices.length);
		},
		setColor: function(r, g, b, a) {
			if (typeof a != 'number') a = 1;

			console.log(a);

			var color = [r, g ,b, a];
			this.material.ambient = this.material.specular = this.material.diffuse = color;
		}
	});

	return SceneObject;
});