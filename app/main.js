
require.config({

	baseUrl: './app',
	waitSeconds: 0,

	paths: {
		jquery: '../thirdparty/jquery.min',
		underscore: '../thirdparty/underscore.min',
		backbone: '../thirdparty/backbone.min',
		text: '../thirdparty/text',
		image: '../thirdparty/image',
	},

	shim: {
		jquery: {
			exports: '$'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		underscore: {
			exports: '_'
		}
	}
});



requirejs(['app'], function(app) {
	app.start();
});
