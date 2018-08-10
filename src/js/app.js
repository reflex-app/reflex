// When the app loads, it will run the .init() functions
screens.init = function () {
	console.log('screens.init()');

	// Load each component here:
	screens.toolbar.init();
}  

// Start the app
screens.init();