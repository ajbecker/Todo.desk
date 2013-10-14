/* global chrome */

define([], function () {

	// Define the file helper to save the contents to the local storage.
	fileHelper = {
		readFile: function (name, cb) {
			chrome.storage.local.get(name, function (result) {
				cb(result[name]);
			});
		},
		writeFile: function (name, text, cb) {
			var data = {};
			data[name] = text;
			chrome.storage.local.set(data, cb);
		}
	};

	return fileHelper;
});