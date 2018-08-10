// When the app loads, it will run the .init() functions
boomerang.init = function() {
	console.log('Boomerang.init()');

	// Load each component here:
	boomerang.items.init();
	boomerang.results.init();
}


// Start the app
boomerang.init();



// Render Template w/ Callback for Mustache
var MustacheRenderer = function(template, data, callback){

	// The normal Mustache loader:
	var mustache = Mustache.render(template, data);

	// Trigger the callback
	if(typeof callback === "function") {
		callback();
	}

	// Return the Mustache HTML object
	// This is used like: $("el").append(mustache);
	return mustache;
}



$(function() {


	// Submit data
	$("form#save-items").submit(function(e){
		e.preventDefault();
		boomerang.items.save();
	});




	//
	//
	// Save inputs when they've been modified
	//
	//
	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		};
	})();



	//
	//
	// Save on keyup after 3.5 seconds
	//
	//
	$(boomerang.items.container).on('keyup', 'input', function(){
		delay(function(){
			boomerang.items.save_status('Save triggered...');
			console.log('Save triggered...waiting 1.5s');
			setTimeout(function(){
				boomerang.items.save();
			}, 1500 );
		}, 2000 );
	});





	//
	//
	// Trash Item - Remove Items
	//
	//
	$(boomerang.items.container).on('click', '.trash', function(e) {
		e.stopPropagation();
		var r = confirm("Are you sure you want to delete this?");
		if (r == true) {
			$(this).closest(".data-container").remove();

			// Save the changes
			setTimeout(function(){
				boomerang.items.save(); // Save the updated sites
				boomerang.items.load(); // Refresh the list of sites from JSON file
			}, 50);
		}
	});


	$(boomerang.items.container).on('click', '.data-item-header', function() {
		if ( $(this).hasClass('active') ) {
			// $(this).removeClass('active');
		} else {
			// $(".data-item-header").removeClass('active');
			// $(this).addClass('active');

			var nearest_dataItem = $(this).parent().find('.data-item');

			if ( nearest_dataItem.visible(false, false, 'horizontal') != true ) {
				nearest_dataItem.toggleClass('right-overflow');
			}
		}
	});

	// Create a New Item
	$('#new').on('click', function() {

		// Load empty Mustache template
		$.get(itemsTemplatePath, function(template) {
			// Reset data
			data = [];

			var mustache = MustacheRenderer(template, data);

			// Append the HTML to the Items container
			$('#data').append(mustache).promise().done(function() {
				// Save the list to JSON
				boomerang.items.save(); // Save updated list to JSON

				// Load the new list,
				// then open the Inspector on the new item
				boomerang.items.load(function() {
					console.log('Finished rendering mustache!');
					var el = $('#data').find(".data-container").children().last();
					$(el).trigger('click');
				});
			});
		});

		// setTimeout(function(){
		// 	// Save the list to JSON
		// 	boomerang.items.save(); // Save updated list to JSON
		//
		// 	// Load the new list,
		// 	// then open the Inspector on the new item
		// 	boomerang.items.load(function() {
		// 		console.log('Finished rendering mustache!');
		// 		var el = $('#data').find(".data-container").children().last();
		// 		$(el).trigger('click');
		// 	});
		// }, 50); //

	});






	//
	//
	// Drag & Drop function
	//
	//

	// The draggable container
	var drake = dragula([document.querySelector('#data')]);

	// When an item is dropped...save it to JSON
	drake.on('drop', function() {
		setTimeout(function(){
			boomerang.items.save();
		}, 50);
		console.log("dropped");
	});





});






// Notifications Function
// Just pass a string into notify()
function notify(message) {

	// If message is not set...
	if (!message) {
		message = "";
	}

	var options = {
		body: message
	};

	var notification = new Notification("Boomerang", options);

	notification.onshow = function () {
		// play sound on show
		// myAud=document.getElementById("audio1");
		// myAud.play();
		setTimeout(function() {notification.close();}, 3000);
	}
}


// Update the goal type number on update
function getGoalValue() {

	// $("#inspector .radio-container").each(function(){
	// 	// Get the value of the radio field
	// 	var x = $(this).find('input[type="radio"]:checked').val();
	//
	// 	// Get the ID and the value of the goal input field
	// 	var y_el = $(this).parent().next().find('input.goal').parent();
	//
	// 	// console.log(x);
	//
	// 	// If there's no value set...
	// 	if ( x == undefined || x == "undefined" ) {
	// 		y_el.hide();
	// 		// If the value is NOT a number, hide it
	// 	} else if ( x != "above" && x != "below" ) {
	// 		y_el.hide();
	// 		// If the value is a number...
	// 	} else {
	// 		y_el.show();
	// 	}
	//
	// });



	$("input.goal").each(function(){
		var x = $(this).val();

		// function prettyGoal() {
		if ( x ) {
			x = Number(x).toLocaleString('en');
			$(this).parent().prev().find('.goal-number').html(x);

			$(this).keyup(function() {
				x = $(this).val();
				x = Number(x).toLocaleString('en');
				// return the value wherever the function is called
				$(this).parent().prev().find('.goal-number').html(x);
			});
		}
	});


}
getGoalValue();


// Update all visual styles
// This includes pretty numbers, timestamps, etc.
function update_styles() {
	favicons();
	update_timestamp();
}



//
//
// Get favicons
//
//
function favicons() {
	$(".favicon").each(function(){
		var source = $(this).data("src");
		src = source.replace(/(^\w+:|^)\/\//, '');
		$(this).html("<img src=http://www.google.com/s2/favicons?domain=" + src + "/>");
	});
}
