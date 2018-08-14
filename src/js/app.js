// When the app loads, it will run the .init() functions
app.init = function () {
	console.log('screens.init()');

	// Load each component here:
	app.toolbar.init();
	app.artboard.init();
}  

// Start the app
$( document ).ready( app.init );