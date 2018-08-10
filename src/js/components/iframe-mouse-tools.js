// $(function() {
//
// 	var settings = {
// 		element: "#mouse-sticky-UI",
// 		dropped: false,
// 		offsetX: 20,
// 		offsetY: -10
// 	};
//
// 	// Start on load
// 	attachToMouse();
//
// 	// On double-click, pick it up
// 	$(settings.element).dblclick(function() {
// 		attachToMouse();
// 	});
//
// 	// Main function
// 	function attachToMouse() {
// 		$(document).mousemove(function(e) {
// 			// Track with mouse movement
// 			settings.dropped = false;
// 			checkIfDropped();
// 			$(settings.element).offset({
// 				top: e.pageY + settings.offsetY,
// 				left: e.pageX + settings.offsetX
// 			});
// 		}).one("click", function() {
// 			// Drop the element
// 			$(this).unbind("mousemove");
// 			settings.dropped = true;
// 			checkIfDropped();
// 		});
// 	}
//
// 	function checkIfDropped() {
// 		if (settings.dropped == true) {
// 			console.log("dropped");
// 			$(settings.element).removeClass("is-moving");
// 		} else if (settings.dropped == false) {
// 			console.log("picked up");
// 			$(settings.element).addClass("is-moving");
// 		}
// 	}
// });
