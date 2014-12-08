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
		initialize: function() {
			this.transform = mat4.create();
			this.vertices = [];
			this.vertexNormals = [];
			this.indices = [];
			this.vao = gl.createVertexArray();
			this.color = [1, 1, 1, 1];
		},
		get vectorCount() {
			return (_ref = this.vertices ? _ref.length : 0) / this.vectorSize;
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
			this.drawInternal();
			gl.bindVertexArray(null);
		},
		drawInternal: function() {
			gl.render('elements', this.indices.length);
		}
	});

	return SceneObject;
});