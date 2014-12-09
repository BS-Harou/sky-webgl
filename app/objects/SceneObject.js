define(['backbone'], function(Backbone) {
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
		initialize: function() {
			this.transform = mat4.create();
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
		get vectorCount() {
			return (_ref = this.vertices ? _ref.length : 0) / this.vectorSize;
		},
		setPosition: function(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
		},
		draw: function() {
			gl.bindVertexArray(this.vao);

			var mPosition = mat4.create();
			mat4.translate(mPosition, mPosition, [this.x, this.y, this.z]);
			if (this.rotateX != 0) mat4.rotateX(mPosition, mPosition, GL.degToRad(this.rotateX));
			if (this.rotateY != 0) mat4.rotateY(mPosition, mPosition, GL.degToRad(this.rotateY));
			if (this.rotateZ != 0) mat4.rotateZ(mPosition, mPosition, GL.degToRad(this.rotateZ));


			mat4.multiply(mPosition, mPosition, this.transform);

			gl.setVecUniform('uColor', this.color);
			gl.setMatUniform('uTransform', mPosition);

			var mNorm = mat4.create();
			mat4.invert(mNorm, mPosition);
			mat4.transpose(mNorm, mNorm);
			gl.setMatUniform('uNormalTransform', mNorm);

			gl.setVecUniform('uMaterialAmbient', this.material.ambient);
			gl.setVecUniform('uMaterialDiffuse', this.material.diffuse);
			gl.setVecUniform('uMaterialSpecular', this.material.specular);
			gl.setVecUniform('uMaterialEmission', this.material.emission);
			gl.setScalarUniform('uMaterialShininess', this.material.shininess);

			this.drawInternal();
			gl.bindVertexArray(null);
		},
		drawInternal: function() {
			gl.render('elements', this.indices.length);
		},
		setColor: function(r, g, b) {
			var color = [r, g ,b , 1];
			this.material.ambient = this.material.specular = this.material.diffuse = color;
		}
	});

	return SceneObject;
});