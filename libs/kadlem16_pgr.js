var GL = function(canvas) {
	if (!(canvas instanceof HTMLCanvasElement)) {
		canvas = document.createElement('canvas');
	}
	this.el = canvas;
	this.ctx = GL._getWebGLContext(this.el)

	this.ctx.clearColor(0, 0, 0, 1);
	this.ctx.viewport(0, 0, this.el.width, this.el.height);

	this.ctx.enable(this.ctx.DEPTH_TEST);

	this._programs = [];
	GL._extendWithVAO(this);
	if (!this.ctx.getExtension('OES_texture_float')) {
		alert('OES_texture_float not supported :/');
	}

	if (!this.ctx.getExtension('OES_texture_float_linear')) {
		alert('OES_texture_float_linear not supported :/');
	}


};

GL._getWebGLContext = function(canvas) {
	var tryNames = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
	var gl = null;
	for (var i = 0; i < tryNames.length && gl == null; i++) {
		try {
			gl = canvas.getContext(tryNames[i]);
		} catch (e) {}
	}
	if (gl == null) {
		throw 'Error: Cannot initialize webgl (get new browser or drivers!)';
	}
	return gl;
}

GL._extendWithVAO = function(obj) {
	var VAO = obj.ctx.getExtension('OES_vertex_array_object');

	obj.createVertexArray = function() { return VAO.createVertexArrayOES.apply(VAO, arguments);	};
	obj.deleteVertexArray = function() { return VAO.deleteVertexArrayOES.apply(VAO, arguments);	};
	obj.isVertexArray =     function() { return VAO.isVertexArrayOES.apply(VAO, arguments);	    };
	obj.bindVertexArray =   function() { return VAO.bindVertexArrayOES.apply(VAO, arguments);	};
	obj.VERTEX_ARRAY_BINDING_OES = 0x85B5;
};

GL.degToRad = function(deg) {
	return deg * (Math.PI / 180);
};

GL.prototype = {
	el: null,
	ctx: null,
	_programs: null,
	_currentProgram: null,
	createProgram: function(name, vs, fs) {
		program = this.ctx.createProgram();
		this._programs[name] = program;
		this._currentProgram = program;

		//shaders.forEach(this.addShader, this);
		this.addRawShader(vs, this.ctx.VERTEX_SHADER);
		this.addRawShader(fs, this.ctx.FRAGMENT_SHADER);

		this.ctx.linkProgram(program);

		if (!this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS)) {
			throw 'Program Error: ' + this.ctx.getProgramInfoLog(program);
		}

		this.ctx.useProgram(program);

		return program;
	},
	addShader: function(id) {
		var shaderScript = document.getElementById(id);
		if (!shaderScript) throw 'Error: No element with id "' + id + '"';

		var shaderSource = shaderScript.textContent;
		var shaderType = this.ctx.VERTEX_SHADER;
		if (shaderScript.type.indexOf('fragment') >= 0) {
			shaderType = this.ctx.FRAGMENT_SHADER;
		}

		return this.addRawShader(shaderSource, shaderType);
	},
	addRawShader: function(source, type) {
		var shader = this.ctx.createShader(type);
		this.ctx.shaderSource(shader, source);
		this.ctx.compileShader(shader);

		if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
			throw 'Shader Error: ' + this.ctx.getShaderInfoLog(shader) + '\n\n' + source;
		}

		this.ctx.attachShader(this._currentProgram, shader);

		return shader;
	},
	setAttributes: function(name, data, size) {
		if (!this._currentProgram) {
			throw 'Error: No program';
		}

		var buff = this.ctx.createBuffer();
		this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buff);
		this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(data), this.ctx.STATIC_DRAW);

		var attr = this.ctx.getAttribLocation(this._currentProgram, name);
		this.ctx.enableVertexAttribArray(attr);
		this.ctx.vertexAttribPointer(attr, size, this.ctx.FLOAT, false, 0, 0);

		return attr;
	},
	setIndices: function(data) {
		var buff = this.ctx.createBuffer();
		this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, buff);
		this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this.ctx.STATIC_DRAW);
		return buff;
	},
	_isWebGLArray: function(arr) {
		return (arr instanceof Float32Array || arr instanceof Int32Array);
	},

	/**
	 * Set shader uniform
	 * @param name {String|uniform} Name of newly set uniform or reference to already created uniform
	 * @param data {Float|Array} Data to fill
	 */
	setVecUniform: function(name, data, opt) {
		if (!this._currentProgram) {
			throw 'Error: No program';
		}

		opt = opt || {};
		opt.dataType = opt.dataType || 'f';

		if (Array.isArray(data)) {
			if (opt.dataType == 'f') {
				data = new Float32Array(data);
			} else {
				data = new Int32Array(data);
			}
		}

		var unif = typeof name == 'string' ? this.ctx.getUniformLocation(this._currentProgram, name) : name;

		if (this._isWebGLArray(data) && data.length) {
			this.ctx['uniform' + data.length + opt.dataType + 'v'](unif, data);
		} else {
			throw 'Uniform Error: Unsupported data';
		}

		return unif;
	},
	setMatUniform: function(name, data, opt) {
		if (!this._currentProgram) {
			throw 'Error: No program';
		}

		opt = opt || {};
		opt.dataType = opt.dataType || 'f';

		if (Array.isArray(data)) {
			if (opt.dataType == 'f') {
				data = new Float32Array(data);
			} else {
				data = new Int32Array(data);
			}
		} else if (!this._isWebGLArray(data)) {
			throw 'Uniform Error: Unsupported data';
		}


		var unif = typeof name == 'string' ? this.ctx.getUniformLocation(this._currentProgram, name) : name;

		var nxn = null;
		if (data.length == 4) nxn = 2;
		else if (data.length == 9) nxn = 3;
		else if (data.length == 16) nxn = 4;
		else throw 'Uniform Error: Unsupported length of data';

		this.ctx['uniformMatrix' + nxn + opt.dataType + 'v'](unif, false, data);

		return unif;
	},
	setScalarUniform: function(name, data, dataType) {
		if (!this._currentProgram) {
			throw 'Error: No program';
		}

		dataType = dataType || 'f';


		var unif = typeof name == 'string' ? this.ctx.getUniformLocation(this._currentProgram, name) : name;

		this.ctx['uniform1' + dataType](unif, data);

		return unif;
	},
	clear: function() {
		this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
	},
	render: function(type, count) {
		if (!count) {
			count = type;
			type = 'arrays';
		}

		if (type == 'elements') {
			this.ctx.drawElements(this.ctx.TRIANGLES, count, this.ctx.UNSIGNED_SHORT, 0);
		} else {
			this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, 0, count);
		}
	},
	_getIndices: function(store) {
		var rt = [];
		var toLoad = 0;
		for (var i=0; i<store.length; i++) {
			if (toLoad > 0) {
				toLoad--;
				if (toLoad == 0) {
					rt.push(rt[rt.length - 3]);
					rt.push(rt[rt.length - 2]);
				}
				rt.push(store[i]);
				if (toLoad == 0) {
					i += 5;
				}
			} else if (store[i] == 35) {
				toLoad = 4;
			}
		}
		return rt;
	},
	loadModel: function(path, cb) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', path, true);
		xhr.send();
		var that = this;
		xhr.onload = function() {
			var data = JSON.parse(this.response);
			var indices = that._getIndices(data.faces);
			that.setIndices(indices);
			that.elelen = indices.length; //data.faces.length;
			that.setAttributes('pos', data.vertices, 3);
			cb();
		}
	}
};


window.requestAnimationFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			window.setTimeout(callback, 1000 / 60);
	};
})();

function dump(arr) {
	var rt = '';
	for (var i=0; i < arr.length; i++) {
		if (i % 4 == 0) rt += '\n';
		rt += arr[i] + ', ';

	}
	alert(rt);
}

GL.animate = function(fn) {
	var lastTime = Date.now();

	function frame() {
		var elapsed = Date.now() - lastTime;
		lastTime = Date.now();

		fn(elapsed);
		if (obj.run) {
			requestAnimationFrame(frame);
		}
	}

	var obj = {
		run: true,
		stop: function() {
			this.run = false;
			return this;
		},
		start: function() {
			this.run = true;
			requestAnimationFrame(frame);
			return this;
		}
	};

	return obj.start();;
}