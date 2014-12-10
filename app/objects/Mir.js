define(['objects/SceneObject', 'text!models/mir.obj'], function(SceneObject, model) {
	var Mir = SceneObject.extend({
		initialize: function() {
			SceneObject.prototype.initialize.call(this);

			this.vertices = Mir.MODEL.vertices;
			this.vertexNormals = Mir.MODEL.vertexNormals;
			this.indices = Mir.MODEL.indices;
			this.textures = Mir.MODEL.textures;

			this.material.ambient = [0.5, 0.2, 0.2, 1];
			this.material.diffuse = [0.2, 0.467451, 0.967451, 1];
			this.material.specular = [0.2, 0.449020, 0.949020, 1];
			this.material.emission = [0.2, 0.1, 0.3, 1];
			this.material.shininess = 3;

			//this.material.emission = [0.5, 0.5, 0.5, 1.0];

			var scaleBy = 0.8;
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


	Mir.MODEL = new OBJ.Mesh(model);

	return Mir;
});