define(['objects/SceneObject'], function(SceneObject) {
	var Box = SceneObject.extend({
		maxSpeed: 0.12,
		jumping: false,
		jumpSpeed: 0,
		x: 0,
		z: 0.015,
		vertices: null,
		vertexNormals: [],
		indices: null,
		initialize: function(width, height, length) {
			SceneObject.prototype.initialize.call(this);

			this.vertices = [
				0,     length, 0,
				width, length, 0,
				0,     0,      0,
				width, 0,      0,
				0,     length, -height,
				width, length, -height,
				0,     0,      -height,
				width, 0,      -height
			];

			this.indices = Box.BOX_INDICES;


			gl.bindVertexArray(this.vao);

			gl.setAttributes('pos', this.vertices, 3);
			//gl.setAttributes('normal', this.vertexNormals, 3);

			gl.setIndices(this.indices);

			this.color = [Math.random(), Math.random(), Math.random(), 1];

			gl.bindVertexArray(null);
		},
		drawInternal: function() {
			gl.render('elements', this.indices.length);
		}

	});

	Box.BOX_INDICES = [
		0, 1, 2,      1, 2, 3,    // Front face
		2, 3, 6,      3, 6, 7,    // Back face
		3, 1, 7,      1, 7, 5,  // Top face
		0, 1, 4,      1, 4, 5, // Bottom face
		2, 0, 6,      0, 6, 4, // Right face
		6, 4, 5,      6, 5, 7  // Left face
	];

	return Box;
});