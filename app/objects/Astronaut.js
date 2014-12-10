define(['objects/SceneObject', 'text!models/astronaut.obj'], function(SceneObject, model) {
	var Astronaut = SceneObject.extend({
		initialize: function() {
			SceneObject.prototype.initialize.call(this);

			this.vertices = Astronaut.MODEL.vertices;
			this.vertexNormals = Astronaut.MODEL.vertexNormals;
			this.indices = Astronaut.MODEL.indices;
			this.textures = Astronaut.MODEL.textures;

			this.material.ambient = [0.2, 0.2, 0.2, 1];
			this.material.diffuse = [0.467451, 0.467451, 0.467451, 1];
			this.material.specular = [0.449020, 0.449020, 0.449020, 1];
			//this.material.emission = [0.1, 0.1, 0.1, 1];
			this.material.shininess = 1;

			//this.material.emission = [0.5, 0.5, 0.5, 1.0];

			var scaleBy = 0.08;
			mat4.scale(this.transform, this.transform, [scaleBy, scaleBy, scaleBy]);
			mat4.rotateX(this.transform, this.transform, GL.degToRad(90));
			mat4.rotateY(this.transform, this.transform, GL.degToRad(-20));



			gl.bindVertexArray(this.vao);
			gl.setAttributes('pos', this.vertices, this.vectorSize);
			gl.setAttributes('normal', this.vertexNormals, this.vectorSize);
			gl.setIndices(this.indices);
			gl.bindVertexArray(null);
		},
		drawInternal: function() {
			gl.render('elements', this.indices.length);
		}

	});


	Astronaut.MODEL = new OBJ.Mesh(model);


	return Astronaut;
});