define([
	'objects/SceneObject', 'text!models/feisar.obj', 'image!app/models/feisar_diffuse.bmp', 'image!app/models/feisar_specular.bmp'
],
function(SceneObject, vehicleModel, texImage, specImage) {
	var Ship = SceneObject.extend({
		maxSpeed: 0.12,
		xSpeed: 2,
		jumping: false,
		jumpSpeed: 0,
		x: 0,
		z: 0.03,
		vertices: null,
		vertexNormals: null,
		indices: null,
		initialize: function() {
			SceneObject.prototype.initialize.call(this);

			this.vertices = Ship.MODEL.vertices;
			this.vertexNormals = Ship.MODEL.vertexNormals;
			this.indices = Ship.MODEL.indices;
			this.textures = Ship.MODEL.textures;

			//this.material.emission = [0.5, 0.5, 0.5, 1.0];

			var scaleBy = 0.0008;
			mat4.scale(this.transform, this.transform, [scaleBy, scaleBy, scaleBy]);
			mat4.rotateX(this.transform, this.transform, GL.degToRad(-90));

			this.material.ambient = this.material.specular = this.material.diffuse = [0.3, 0.3, 0.3, 1];
			this.texture = this.setupTexture(texImage, gl.ctx.TEXTURE1);
			this.specMap = this.setupTexture(specImage, gl.ctx.TEXTURE2);

			gl.bindVertexArray(this.vao);
			gl.setAttributes('pos', this.vertices, this.vectorSize);
			gl.setAttributes('normal', this.vertexNormals, this.vectorSize);
			gl.setAttributes('aTexCoords', this.textures, 2);
			gl.setIndices(this.indices);
			gl.bindVertexArray(null);
		},
		drawInternal: function() {
			gl.render('elements', this.indices.length);
		}

	});


	Ship.MODEL = new OBJ.Mesh(vehicleModel);

	return Ship;
});