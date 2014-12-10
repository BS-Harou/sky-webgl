define(['objects/SceneObject', 'text!models/iss.obj'], function(SceneObject, model) {
	var ISS = SceneObject.extend({
		initialize: function() {
			SceneObject.prototype.initialize.call(this);

			this.vertices = ISS.MODEL.vertices;
			this.vertexNormals = ISS.MODEL.vertexNormals;
			this.indices = ISS.MODEL.indices;
			this.textures = ISS.MODEL.textures;

			this.material.ambient = [0.0, 0.3, 0.1, 1];
			this.material.diffuse = [0.0, 0.867451, 0.467451, 1];
			this.material.specular = [0.0, 0.849020, 0.449020, 1];
			//this.material.emission = [0.1, 0.3, 0.1, 1];
			this.material.shininess = 1;

			//this.material.emission = [0.5, 0.5, 0.5, 1.0];

			var scaleBy = 0.5;
			mat4.scale(this.transform, this.transform, [scaleBy, scaleBy, scaleBy]);
			mat4.rotateX(this.transform, this.transform, GL.degToRad(90));
			mat4.rotateY(this.transform, this.transform, GL.degToRad(20));



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


	ISS.MODEL = new OBJ.Mesh(model);

	return ISS;
});