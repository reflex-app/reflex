// Everything related to the Items the user wants to search for
boomerang.items = {
  data: {},

  init: function() {
    // Any initial functions go here
    // They'll be called in main.js
    this.load(); // Load the Items boomerang.items.load()
  },

	// The name of the <div> containing the Items on the frontend
	// boomerang.items.container
	container: ".tiles-container",


	load: function(callback) {
		// Load the Items from sites-to-scrape.json
		// boomerang.items.load()
		$.getJSON(itemsJSONPath, function(input){
			boomerang.items.data = input;
			boomerang.items.refresh(boomerang.items.data, callback);
		})
		.fail(function() {
			console.log('No sites-to-scrape.');
		});
	},


	save: function() {
		// Save function for Items
		// This is used for saving Items to sites-to-scrape.json
		// boomerang.items.save()

		// grab all DOM elements
		// loop through them to grab attributes
		// push them into an array
		// save object

    var new_boomerang = {};
    new_boomerang.items = {};

		// Globalize the object
		new_boomerang.items.data = [];

		// Go through each of the Items in the DOM
		// and get the value of them (input fields).
		$('.data-container').each(function(i, obj) {
			var new_name = $(this).find('.name').val();
			var new_url = $(this).find('.url').val();
			var new_css = $(this).find('.css').val();
			var new_goal = parseInt($(this).find('.goal').val());
			var new_goal_type = $(this).find('.radio-container input[type="radio"]:checked').val();
			var new_layout_size = $(this).find('.layout-size').val();

			// Then, we'll push it into an object
			// which can later be added to the JSON file
			new_boomerang.items.data.push({
				name: new_name,
				url: new_url,
				css: new_css,
				goal: new_goal,
				goal_type: new_goal_type,
				layout_size: new_layout_size
			});
		});

		// Save the data to JSON file
		$.ajax({
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			url: "http://localhost:8000/save",
			data: JSON.stringify({data: new_boomerang.items.data}),
			success: function(e) {
				// Update global data object
				boomerang.items.data = new_boomerang.items.data;

				// Reload the Items
				boomerang.items.refresh(boomerang.items.data);

				// Log results
				console.log(e, boomerang.items.data);

				// Let the user know the info was saved
				boomerang.items.save_status();

				// Clear the global array
				new_boomerang.items.data = [];
			},
			error: function(e) {
				notify(e);
				console.log(e);
			}
		});
	},


	save_status: function(message) {
		// The status of saving Items
		// boomerang.items.save_status
		if ( !message ) {
			message = "Saved Items";
		}

		// Create a "toast" message
		popToast(message, '#item-save-status', 'green');
	},



  refresh: function(incoming_array, callback) {
    // This function will refresh the list of items
    // boomerang.items.refresh()
  	$.get(itemsTemplatePath, function(template) {
  		var data = incoming_array;
  		var refreshed_data = [];
  		// console.log(incoming_array);

  		$.getJSON(itemsJSONPath, function(){
  			data = boomerang.items.data;
  		}).fail((e)=> {
        console.log(e);
      });

  		$('#data').empty("");

  		for (var i in data) {
  			// Set the radio button
  			if ( data[i].goal_type == "above" ) {
  				data[i].isAbove = true;
  			} else if ( data[i].goal_type == "below" ) {
  				data[i].isBelow = true;
  			} else if ( data[i].goal_type == "other" || data[i].goal_type == undefined ) {
  				data[i].isOther = true;
  			} else if ( data[i].goal_type == "image" ) {
  				data[i].isImage = true;
  			}

  			//
  			// Layout Options
  			//
  			// if ( data[i].layout_size == "XS" ) {
  			// 	data[i].layout_size_XS = true;
  			// } else if ( data[i].layout_size == "S" ) {
  			// 	data[i].layout_size_S = true;
  			// } else if ( data[i].layout_size == "M" ) {
  			// 	data[i].layout_size_M = true;
  			// } else if ( data[i].layout_size == "L" ) {
  			// 	data[i].layout_size_L = true;
  			// } else if ( data[i].layout_size == "XL" ) {
  			// 	data[i].layout_size_XL = true;
  			// }

  			var mustache = Mustache.to_html(template, data[i]);

        // Add the content to the array which we'll push later
  			refreshed_data.push(mustache);


  			// Once all the items have loaded...
  			// Push them to the front-end
  			if ( +i+1 == data.length ) {
  				$('#data').append(refreshed_data);

          console.log('Items rendered.');

          // Callback
          if (typeof callback === "function" ) {
            callback();
          }

  				// Update the visual style
  				update_styles();
  			}

  		}

  		if ( data == null ) {
  			$('#data').html("Nothing to show :(");
  		}
  	});
  }


}
