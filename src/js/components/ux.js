//
// Front-end UX improvements
//
$(function() {

	// Temporarily add a class to an element
	function addAnimationClass(target, tempClass, endClass) {
		// Add the animated class
		$(target).addClass(tempClass);
		// Wait until the animation has finished
		$(target).on("animationend", function(event) {
			// Once finished, remove the animation class
			$(target).removeClass(tempClass);
			if ( endClass != undefined ) {
				$(target).removeClass(endClass);
			}
			console.log('Done animating!');
		});
	}

}); // end jQuery ready function
