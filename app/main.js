
require.config({

	baseUrl: '/app',
	waitSeconds: 0,

	paths: {
		jquery: '../libs/jquery.min',
		underscore: '../libs/underscore.min',
		backbone: '../libs/backbone.min',
		text: '../libs/text',
		image: '../libs/image',
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
