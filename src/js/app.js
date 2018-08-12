// When the app loads, it will run the .init() functions
app.init = function () {
	console.log('screens.init()');

	// Load each component here:
	app.toolbar.init();
}  

// Start the app
app.init();