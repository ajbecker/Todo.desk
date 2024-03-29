module.exports = function (grunt) {
	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		ugilify: {
			options: {
				banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n"
			},
			build: {
				src: "js/application.js",
				dest: "build/application.min.js"
			}
		}
	});

	// Load the plugin that provides the uglify task.
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// Define the task(s).
	grunt.registerTask("default", ['uglify']);
};