define(['objects/SceneObject', 'text!models/antenna.obj', 'image!app/models/antenna.jpg'], function(SceneObject, model, texImage) {
	var Antenna = SceneObject.extend({
		initialize: function() {
			SceneObject.prototype.initialize.call(this);

			this.vertices = Antenna.MODEL.vertices;
			this.vertexNormals = Antenna.MODEL.vertexNormals;
			this.indices = Antenna.MODEL.indices;
			this.textures = Antenna.MODEL.textures;

			this.material.ambient = [0.3,0.1,0.1,1];
			this.material.diffuse = [0.8,0.2,0.2,1];
			this.material.specular = [0.5, 0.2, 0.2,1];
			//this.material.emission = [0.1, 0.1, 0.1, 1];
			this.material.shininess = 1;

			//this.material.emission = [0.5, 0.5, 0.5, 1.0];

			var scaleBy = 0.08;
			mat4.scale(this.transform, this.transform, [scaleBy, scaleBy, scaleBy]);
			mat4.rotateZ(this.transform, this.transform, GL.degToRad(-120));


			//this.texture = this.setupTexture(texImage);

			gl.bindVertexArray(this.vao);
			gl.setAttributes('pos', this.vertices, this.vectorSize);
			gl.setAttributes('normal', this.vertexNormals, this.vectorSize);
			//gl.setAttributes('aTexCoords', this.textures, 2);
			gl.setIndices(this.indices);
			gl.bindVertexArray(null);
		},
		drawInternal: function() {
			gl.render('elements', this.indices.length);
		}

	});


	Antenna.MODEL = new OBJ.Mesh(model);

	return Antenna;
});