// When the app loads, it will run the .init() functions
app.init = function () {
	console.log('screens.init()');

	// Load each component here:
	app.settings.init();
	app.toolbar.init();
	app.artboard.init();
}

// Native (NW.JS) related tasks
if (app.platform == "native") {

	// Make the NW window object accessible
	let win = nw.Window.get();

	// On load, show the app
	win.on("loaded", function () {
		win.show();
		win.focus();

		// Add the standard Mac shadow
		// setTimeout(function () {
		// 	win.setShadow(true);
		// 	console.log('shadow?');
		// }, 100);
	});

	// Open links in the native browser
	win.on('new-win-policy', function (frame, url, policy) {
		policy.ignore(); // Do not open using the app window
		nw.Shell.openExternal(url); // Open in external browser
	});

	// Log the current version in development
	if (process.versions['nw-flavor']) {
		console.log("Webkit Version: ", process.versions['node-webkit']);
	}
}

// Start the app
$(document).ready(app.init);