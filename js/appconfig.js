(function () {

	// Set the configuration for require js.
	require({
		baseUrl: "/js",
		shim: {
			'backbone': {
				deps: ['underscore', 'jquery'],
				exports: 'Backbone'
			},
			'underscore': {
				exports: '_'
			},
			'codemirror': {
				exports: 'CodeMirror'
			},
			'todo-hint': {
				deps: ['show-hint'],
				exports: 'CodeMirror'
			},
			'todo.txt': {
				exports: 'CodeMirror'
			}
		},
		waitSeconds: 1
	});

	// Require the application.
	require(["application"]);
}());