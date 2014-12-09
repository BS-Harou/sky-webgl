define(['objects/SceneObject', 'text!models/vehicle.obj'], function(SceneObject, vehicleModel) {
	var Ship = SceneObject.extend({
		maxSpeed: 0.12,
		xSpeed: 1,
		jumping: false,
		jumpSpeed: 0,
		x: 0,
		z: 0.15,
		vertices: null,
		vertexNormals: null,
		indices: null,
		initialize: function() {
			SceneObject.prototype.initialize.call(this);

			this.vertices = Ship.MODEL.vertices;
			this.vertexNormals = Ship.MODEL.vertexNormals;
			this.indices = Ship.MODEL.indices;

			var scaleBy = 0.0008;
			mat4.scale(this.transform, this.transform, [scaleBy, scaleBy, scaleBy]);
			mat4.rotateX(this.transform, this.transform, GL.degToRad(-90));

			this.material.ambient = this.material.specular = this.material.diffuse = [0.2, 0.2, 0.5, 1];

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


	Ship.MODEL = new obj_loader.Mesh(vehicleModel);

	return Ship;
});