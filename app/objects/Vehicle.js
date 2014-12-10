define(['objects/SceneObject', 'text!models/vehicle.obj'], function(SceneObject, model) {
	var Vehicle = SceneObject.extend({
		initialize: function() {
			SceneObject.prototype.initialize.call(this);

			this.vertices = Vehicle.MODEL.vertices;
			this.vertexNormals = Vehicle.MODEL.vertexNormals;
			this.indices = Vehicle.MODEL.indices;
			this.textures = Vehicle.MODEL.textures;

			this.material.ambient = [0.2, 0.2, 0.2, 1];
			this.material.diffuse = [0.6, 0.6, 0.6, 1];
			this.material.specular = [0.2, 0.2, 0.2, 1];
			this.material.emission = [0.1, 0.1, 0.1, 1];
			this.material.shininess = 5;

			//this.material.emission = [0.5, 0.5, 0.5, 1.0];

			var scaleBy = 0.002;
			mat4.scale(this.transform, this.transform, [scaleBy, scaleBy, scaleBy]);
			mat4.rotateX(this.transform, this.transform, GL.degToRad(70));
			mat4.rotateY(this.transform, this.transform, GL.degToRad(30));
			mat4.rotateZ(this.transform, this.transform, GL.degToRad(-30));



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


	Vehicle.MODEL = new OBJ.Mesh(model);


	return Vehicle;
});