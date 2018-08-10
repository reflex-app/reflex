boomerang.results = {
  init: function() {
    // Any initial functions go here
    // They'll be called in main.js
    this.firstLoad();
  },

  firstLoad: function() {
    // Sets up some variables, makes sure there's data to work with
    // Provides an empty state if not
    // boomerang.results.firstLoad()
    $.getJSON(resultsJSONPath, function(data){

      // Create a cache of the original data
      previousOutputJSONFile = JSON.stringify(data);

      // Compare Output.JSON file, update if it's changed
      boomerang.results.update(data);

    }).fail(function() {
      // Create an empty object to compare to
      previousOutputJSONFile = [];
      console.log('Error: no results');
    });
  },


  updateIfChanged: function() {
    console.log('updateIfChanged triggered');

    $.getJSON(resultsJSONPath, function(data) {

      // Set the latest JSON
      latestOutputJSONFile = JSON.stringify(data);
      console.log(latestOutputJSONFile);

      // Get the previous (first loaded JSON results)
      // If the previous JSON and the checked JSON are different,
      // then the results should be updated and the previous and
      // latest variables should be reset

      console.log( JSON.parse(previousOutputJSONFile), JSON.parse(latestOutputJSONFile) );
      var a = JSON.parse(previousOutputJSONFile);
      var b = JSON.parse(latestOutputJSONFile);
      console.log(a, b);

      if ( isEqual( previousOutputJSONFile, latestOutputJSONFile ) == true ) {
        console.log("No changes to Output.json");
      } else {
        console.log("Output.json updated!");

        // Push the content
        // Pass along the new and old data
        boomerang.results.update( JSON.parse(latestOutputJSONFile), JSON.parse(previousOutputJSONFile) );

        // Update the visual styles
        // Favicons and time
        update_styles();

        // Reset values
        previousOutputJSONFile = latestOutputJSONFile; // Update our cached "old" file to compare next time

        // Send a notification
        notify("New information retrieved! 👍");
      }
    }).fail(function(){
      console.log('FAIL: Was not able to fetch Output.JSON');
    });

  },

  empty_state: function(array) {
    if (array.length > 0) {
      // Remove the empty state
      $('#results').removeClass('empty');
    } else {
      console.log('No Results data', array);
      $('#results').addClass('empty');
      $("#results").html('<div class="app--welcome-message">Welcome!<br> Click + to add websites you would like to track. Then click the "Boomerang" button to fetch results.</div>');
    }
  },

  createListOfNewResults: function(o1, o2) {
    // Check between two arrays
    // It will then return a new array with only the new differences that appear in array2 but not in array 2
    // via: https://codereview.stackexchange.com/questions/11412/mapping-the-differences-between-javascript-objects
    //
    // fn(oldArray, newArray)

    // k = number of differences
    // diff = new object with differences
    // kDiff = boolean
    // final_obj = the new array that contains differences

    var k, kDiff,
    diff = {},
    final_obj = [];

    if ( o2 == "" ) {
      console.log("Empty array passed to objectFromDifference()")
      return false;
    }


    // Check which properties have changed
    // Will only keep the differences
    for (k in o1) {
      // if object 1 doesn't have key... or if the type for object1/object2 isn't an object
      if (!o1.hasOwnProperty(k)) {} else if (typeof o1[k] != 'object' || typeof o2[k] != 'object') {
        // if keys are different...
        if (!(k in o2) || o1[k] !== o2[k]) {
          diff[k] = o2[k];
          /* console.log(k, kDiff, diff, diff[k]) */;
        }
        // object 1, object 2 are objects!
      } else if (kDiff = boomerang.results.createListOfNewResults(o1[k], o2[k])) {
        diff[k] = kDiff;
        /* console.log(k, kDiff, diff, diff[k]) */;
      }
    }

    // Create the inner object
    for (k in o2) {
      // All objects that exist in obj1 + obj2
      diff[k] = o2[k];
      /* console.log(k, kDiff, diff, diff[k]) */;

      // @TODO: is this line probably important?
      // if (o2.hasOwnProperty(k) && !(k in o1)) {
      //   diff[k] = o2[k];
      // }
    }

    // Now loop through the objects and output them
    for (k in diff) {
      if (diff.hasOwnProperty(k)) {
        // Add the object to our new array
        final_obj.push(diff[k]);

        // If it's the last item...
        if (k == Object.keys(diff)[Object.keys(diff).length - 1]) {
          // console.log('New object:', final_obj);
          return final_obj;
        }
      }

    }

    return false;
  },



  update: function(newObj, oldObj) {

    console.log("New:", newObj, "Old:", oldObj);

    // Make sure the array isn't empty
    if (newObj && newObj.length > 0) {

      // Create a list of all the new Results
      var new_array = boomerang.results.createListOfNewResults(oldObj, newObj);

      // If there's stuff to show...
      if ( new_array ) {
        console.log( JSON.stringify(new_array, null, 4) );
        GLOBAL_new_results = JSON.stringify(new_array, null, 4);
      } else {
        // Otherwise,...
        console.log('No new results array.');
        GLOBAL_new_results = [];
      }

      // Partials for the results page
      // these map to "./js/templates/*.mst"
      var partials = [
        "number",
        "news",
        "image"
      ];

      var mustache_partials_paths = {};
      var partials_loaded = 0;

      partials.forEach(function(value, index) {
        // get number partial
        $.get('../js/templates/partials/' + partials[index] + '.mst', function(result){
          // var y = n; // put the template value here
          mustache_partials_paths[value] = result;
        }).done(function() {
          partials_loaded++; // increment the number of loaded partials

          console.log(partials_loaded);

          // Once they've all loaded...
          if ( partials_loaded == partials.length ) {

            // Remove all existing tiles
            var tile_counter = $('#results .tile__S').length;

            if ( tile_counter > 0 ) {
              $('#results .tile__S').each(function(i) {

                $(this).removeClass('is-visible');

                // When finished...
                if ( Number(i)+1 == tile_counter ) {
                  setTimeout(function() {
                    console.log('Done removing items...loading new ones...');
                    // Trigger the content loading
                    push_results();
                  }, 500);
                }
              });
            } else {
              // Trigger the content loading
              push_results();
            }


          }
        })
        .fail(function(){
          console.log('Error loading partial: ' + partials[index]);
        });




      });


      // If the partials are loaded...
      function push_results() {

        $.get(resultsTemplatePath, function(template){

          var data = newObj; // set `data` = the incoming newObj data
          var dest_id = "#results"; // Where to place the content


          // Remove items
          $(dest_id).children().empty();


          // Prepare an object that we can put all the items into before sorting
          var sortable = [];

          // Tell the script where to place the content
          for (var i in data) {

            if ( data[i].goalType == "above" || data[i].goalType == "below" ) {

              var goalNumber = Number(data[i].goal);
              var resultNumber = Number(data[i].result);
              console.log(goalNumber, resultNumber);

              // Evaluate Numbers to calculate above/below
              if ( data[i].goalType == "above" ) {
                if ( resultNumber >= goalNumber ) {
                  data[i].isGreen = true;
                } else if ( resultNumber < goalNumber ) {
                  data[i].isRed = true;
                }
              } else if (data[i].goalType == "below") {
                if ( resultNumber <= goalNumber ) {
                  data[i].isGreen = true;
                } else if ( resultNumber > goalNumber ) {
                  data[i].isRed = true;
                }
              }
            }


            //
            // Make the number nice!
            //
            if ( data[i].difference ) {
              // Convert to number
              // Make sure it's fixed to 2 decimal points
              // Localize it (i.e. add commas/periods/etc based on language)
              data[i].difference = Number(data[i].difference).toFixed(2);
              data[i].difference = Number(data[i].difference);
              data[i].difference = data[i].difference.toLocaleString();

              data[i].goal = Number(data[i].goal).toFixed(2);
              data[i].goal = Number(data[i].goal);
              data[i].goal = data[i].goal.toLocaleString();

              data[i].result = Number(data[i].result).toFixed(2);
              data[i].result = Number(data[i].result);
              data[i].result = data[i].result.toLocaleString();
            }

            // Make the timestamp nice!
            // Converts it into human-readable format
            // i.e. "2 minutes ago"
            if ( data[i].timestamp ) {
              var timestamp = data[i].timestamp;
            }

            //
            // Layout Options
            //
            // if ( data[i].layout_size == "XS" ) {
            // 	data[i].layout_size_XS = true;
            // }
            // else if ( data[i].layout_size == "S" ) {
            // 	data[i].layout_size_S = true;
            // }
            // else if ( data[i].layout_size == "M" ) {
            // 	data[i].layout_size_M = true;
            // }
            // else if ( data[i].layout_size == "L" ) {
            // 	data[i].layout_size_L = true;
            // }
            // else if ( data[i].layout_size == "XL" ) {
            // 	data[i].layout_size_XL = true;
            // }

            // Add this content to a sortable list
            // We'll sort this list once we get to the end of the loop
            sortable.push(data[i]);

            // Once it's the last item...
            var current_i = Number(i)+1;
            if ( current_i == data.length ) {

              sortable.sort(function(a,b) {
                return (a.ID > b.ID) ? 1 : ((b.ID > a.ID) ? -1 : 0);
              });

              // Sort the list based on item.ID
              // Then push the Mustache to the frontend
              for ( h in sortable ) {
                var mustache = Mustache.to_html(template, sortable[h], mustache_partials_paths);

                $(dest_id).find('.all-results').append(mustache);

                console.log(h, sortable.length, Number(h) + 1);

                // Once it's done...
                if ( Number(h) + 1 == sortable.length) {

                  $(function() {
                    setTimeout(function(){
                      $(dest_id + ' .tile__S').each(function(i) {
                        var delay = Number(i) * 150;

                        setTimeout(function (div) {
                          div.addClass('is-visible');
                        }, delay, $(this));

                      });
                    }, 1000);
                  });



                  // Convert New Results into Mustache too
                  console.log( JSON.parse(GLOBAL_new_results) );
                  var parsed_new_results = JSON.parse(GLOBAL_new_results) ;

                  console.log(parsed_new_results);

                  for ( g in parsed_new_results ) {
                    var mustache2 = Mustache.to_html(template, parsed_new_results[g], mustache_partials_paths);
                    $(dest_id).find('.new-results').append(mustache2);
                  }


                }
              }
              // console.log(sortable);

              // Update the times and favicons
              update_styles();

              console.log('boomerang.results.update completed', sortable);

            }

          }

        });
      }

    } else if (newObj && newObj.length <= 0) {
      // Make sure the empty state is accounted for
      // If it is empty, show a message
      // boomerang.results.empty_state(data);
      boomerang.results.empty_state(newObj);
    } else {
      console.log('ERROR: Nothing was passed to boomerang.results.update()');
    }
  }

} // end boomerang.results
