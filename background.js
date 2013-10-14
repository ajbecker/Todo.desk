chrome.app.runtime.onLaunched.addListener(function () {
	chrome.app.window.create("window.html", {
		id: "todo.desk",
		minHeight: 100,
		minWidth: 75,
		frame: "chrome"
	});
});