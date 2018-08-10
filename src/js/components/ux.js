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




	// Resizable Items panel
	// Create resizable panels
	//
	// Save to local storage

	var track_main_container_panels = function() {

		var sizes = localStorage.getItem('split-sizes');

		if (sizes) {
		    sizes = JSON.parse(sizes);
		} else {
		    sizes = [20, 80];  // default sizes
		}

		var split = Split(['#main-sidebar', '#results'], {
			direction: 'horizontal',
			gutterSize: '15',
			sizes: sizes,
			minSize: [0, 600],
			onDragEnd: function () {
					localStorage.setItem('split-sizes', JSON.stringify(split.getSizes()));
			}
		});
	}();





	//
	//
	// Select text when clicking an input
	//
	//
	$('.tiles-container').on('click', 'input:not([type="radio"])', function() {
		this.select();
	});




	//
	//
	// Track which item is being hovered
	// This allows for right click to delete menu in NWJS
	// @TODO: Clean this up...it's probably fired too much
	//
	//
	// $('body').mousemove(function(evt){
	// 	// console.log(evt.target.closest('.data-container'));
	// 	mouse_position = evt.target.closest('.data-container');
	// });


	//
	// Edit link
	//
	$('.gui-link').click(function() {
		$(this).find('a').toggleClass('active');
	});



	//
	// Switch
	//
	$(".switch").on('click', function() {
		// var attr = $(this).attr();
		// $(this).attr(attr == 'checked' ? '' : 'checked');
		$(this).toggleClass('checked');
	});


	//
	//
	// When the content is being loaded, the sync icon should spin
	//
	//
	function trigger_gui_icon_sync() {
		$(this).find(".gui-icon-sync").addClass('animate spin');
	}

	//
	//
	// Display more information on hover
	// Uses jQuery delegate binding for when new...
	// DOM elements are loaded
	//
	//
	$(document).on({
		mouseenter: function() {
			$(this).find('.box').toggleClass('is-active');
			$(this).find('.difference').toggleClass('is-active');
		},
		mouseleave: function() {
			$(this).find('.box').removeClass('is-active');
			$(this).find('.difference').toggleClass('is-active');
		}
	}, '.results-item');



	//
	//
	// Custom loading animation
	// SCSS: partials/_loader.scss
	// @TODO: Add new loading animation
	//
	//
	// setTimeout(function() {
	// 	$('.loader').addClass('loaded');
	// 	$('main').addClass('visible');
	// }, 700);




}); // end jQuery ready function
