define(['objects/SceneObject'], function(SceneObject) {
	var Box = SceneObject.extend({
		x: 0,
		z: 0,
		vertices: null,
		vertexNormals: [],
		indices: null,
		initialize: function(width, height, length) {
			SceneObject.prototype.initialize.call(this);


			this.vertices = [
				// predni
				-width/2, -length / 2, -height/2,
				 width/2, -length / 2, -height/2,
				 width/2, -length / 2,  height/2,
				-width/2, -length / 2,  height/2,

				// prava
				 width/2, -length/2, -height/2,
				 width/2, -length/2, height/2,
				 width/2,  length/2, -height/2,
				 width/2,  length/2, height/2,

				// zadni
				 width/2,  length/2, -height/2,
				 width/2,  length/2, height/2,
				-width/2,  length/2, -height/2,
				-width/2,  length/2, height/2,

				// leva
				-width/2,  length/2, -height/2,
				-width/2,  length/2, height/2,
				-width/2, -length/2, -height/2,
				-width/2, -length/2, height/2,

				// dolni
				-width/2,  length/2, -height/2,
				-width/2, -length/2, -height/2,
				 width/2, -length/2, -height/2,
				 width/2,  length/2, -height/2,

				// horni
				-width/2,  length/2, height/2,
				-width/2, -length/2, height/2,
				 width/2, -length/2, height/2,
				 width/2,  length/2, height/2



				/*
				0,     length, 0,
				width, length, 0,
				0,     0,      0,
				width, 0,      0,

				0,     length, -height,
				width, length, -height,
				0,     0,      -height,
				width, 0,      -height
				*/
			];

			this.vertexNormals = [
				 0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0,
				 1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0,
				 0,  1,  0,   0,  1,  0,   0,  1,  0,   0,  1,  0,
				-1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
				 0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,
				 0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1
			];

			this.indices = Box.BOX_INDICES;



			gl.bindVertexArray(this.vao);

			gl.setAttributes('pos', this.vertices, 3);
			gl.setAttributes('normal', this.vertexNormals, 3);

			gl.setIndices(this.indices);

			this.color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2, 1];
			this.material.ambient = this.material.specular = this.material.diffuse = this.color;

			gl.bindVertexArray(null);
		},
		drawInternal: function() {
			gl.render('elements', this.indices.length);
		}

	});

	Box.BOX_INDICES = [
		0, 1, 2,      0, 2, 3,   // Front face
		4, 5, 6,      5, 6, 7,   // Right face
		8, 9, 10,     9, 10, 11, // Back face
		12, 13, 14,   13, 14, 15,   // Left face
		16, 17, 18,   16, 18, 19,   // Bottom face
		20, 21, 22,   20, 22, 23    // Top face
	];

	return Box;
});