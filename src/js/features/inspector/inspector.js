// This script is called in index.html
// It allows for communication between index.html and iframe.html
// For the Node & main code, see the inline JS in iframe.html
// ===============================================================

// Creating a gloabl object
// Variables: boomerang.inspector.key
// Functions: boomerang.inspector.key()
boomerang.inspector = {};

// Collect information about the Item which sent the request to the Inspector
// The object is filled later
// boomerang.inspector.sender
boomerang.inspector.sender = {};

// jQuery-reliant stuff:
$(function() {
  // Open and Close the Inspector window
  // boomerang.inspector.toggle()
  boomerang.inspector.toggle = function(event) {
    // Update the information about the Item that sent the request
    updateItemSenderInfo(event);

    // Open/close the Inspector
    $("#inspector").toggleClass('is-active');

    // If the open was triggered...
    // Request a new scrape of the given website
    if ( $(this).is('.data-item-container') || $(this).is('.data-item-container:last-child') ) {
      // These are events that open the Inspector

      // Update the URL of the Item inside the Inspector
      $("#inspector .name").val(boomerang.inspector.sender.name);
      // Update the URL of the Item inside the Inspector
      $("#inspector .url").val(boomerang.inspector.sender.url);
      // Update the Goal of the Item inside the Inspector
      $("#inspector .goal").val(boomerang.inspector.sender.goal);
      // Update the Goal Type of the Item inside the Inspector
      $("#inspector .goal_type").val(boomerang.inspector.sender.goal_type);
      // Update the selector based on the Item's existing one
      $("#inspector .css").val(boomerang.inspector.sender.css);

      // Check the radio input field value on load
      toggleInputGoal( $('#inspector .radio-container') );

      // Check to see if the pre-filled class returns anything
      // add a small amount of buffer time to make sure the input is filled
      setTimeout(function() {
        // Check to see if saving should be shown
        // If form fields are empty, especially the selector, it won't be able to submit
        checkSubmitAvailability();

        // Update the highlighted elements
        inspectorUpdateResults();

        // Load the webpage
        boomerang.inspector.submitURLform();
      }, 200);

    } else {
      // Put any events here that should occur when Inspector is closed

      console.log('Emptied Inspector iFrame contents');
      $("iframe").contents().find('iframe-content').html(boomerang.inspector.empty_state_html);

      // Turn off loading indicator
      boomerang.inspector.showLoading(false);

      // Reset the empty state contents
      boomerang.inspector.clearContents();
    }
  }

  // Fetch the HTML of a webpage
  // boomerang.inspector.updateIframeContent()
  boomerang.inspector.updateIframeContent = function() {

    // Set to loading
    boomerang.inspector.showLoading(true);

    // Load the <html> from JSON file
    $.getJSON( "../../data/grabHTML/grab-output.json", function( data ) {
      console.log(data);
      for ( i in data ) {
        GRABBED_HTML = data[i].result;
        console.log(GRABBED_HTML);
      }
    }).done(function() {
      var el = document.getElementById('iframe').contentWindow.document.getElementById('iframe-content');
      el.innerHTML = (GRABBED_HTML);

      checkSubmitAvailability();
      boomerang.inspector.showLoading(false);

      if ( boomerang.inspector.contentChanged() == "true" ) {
        inspectorUpdateResults();
        console.log( 'Checking DOM for selector again' , boomerang.inspector.contentChanged() );
      }

    });

  }

  // Clear the Inspector inputs and reset values
  // boomerang.inspector.clearSelector()
  boomerang.inspector.clearSelector = function(context) {
    // Empty the array
    window.frames[0].window.constructedClassArray = [];

    // Remove previous results
    var array = window.frames[0].window.constructedClassArray;

    // Find the nearest input to where the clear button was clicked and clear it
    $(context).parent().find('input, textarea').val("");

    // Remove all highlighted elements
    var inspector_highlightedClass = "." + window.frames[0].window.inspector_highlightedClass;
    $("iframe#iframe").contents().find(inspector_highlightedClass).removeClass(inspector_highlightedClass);

    // Trigger the removal of all target highlights inside the iframe
    window.frames[0].window.removeTargets();

    console.log(window.frames[0].window.selectedElements, window.frames[0].window.constructedClassArray);
  }


  // Remove the current contents of the iFrame and restore them to the placeholder
  boomerang.inspector.clearContents = function() {
    $('iframe').contents().find('#iframe-content').empty();
    $('iframe').contents().find('#iframe-content').html(boomerang.inspector.empty_state_html);
  }


  // Check if the iFrame content = grabhtml-output.json
  // Returns a true/false
  boomerang.inspector.contentChanged = function() {
    // Get the HTML
    var grab_HTML;
    $.getJSON( "../../data/grabHTML/grab-output.json", function( data ) {
      grab_HTML = data.result;
    }).then(function() {
      var iframe_HTML = $('iframe').contents();

      // Are they equal?
      // If true, there was no change
      if ( isEqual(grab_HTML, iframe_HTML) ) {
        // no change
        // they're equal!
        console.log('contentChanged false');
        return false;
      } else {
        console.log('contentChanged true');
        // Remove loading
        boomerang.inspector.showLoading(false);
        return true;
      }
    });
  }


  boomerang.inspector.showLoading = function(bool) {
    var el = $('iframe').contents().find('.inspector-loading');
    var active_class = "is-active";
    var current_class_is_same_as_active = $(el).is('.' + active_class);

    if ( bool === true ) {
      $(el).addClass(active_class);
      console.log('Inspector visible');
    } else if ( bool === false ) {
      $(el).removeClass(active_class);
      console.log('Inspector hidden');
    } else {
      console.log('Inspector loader already has active class');
    }

  }


  // The input that contains the name
  var inspector_name_input = $("#inspector .name");

  // The initial help message in the CSS input
  var inspector_initial_message = $("#inspector .css").text();
  // The input that contains the CSS selector
  var inspector_selector_input = $("#inspector .css");

  // The input that contains the goal
  var inspector_goal_input = $("#inspector .goal");

  // The input that contains the goal type
  var inspector_goal_type_input = $('#inspector .radio-container input[type="radio"]');

  // The input that contains the URL
  var inspector_url_input = $("#inspector .url");

  // The <div> that contains the result
  var inspector_result = $("#inspector .result");

  // Item
  // This is the Item that opened the Inspector
  function updateItemSenderInfo(event) {
    // Create an object
    // Contains all the data for the Item via the input fields
    // Output: boomerang.inspector.sender.{variable}

    boomerang.inspector.sender = new function() {
      this.DOMelement = $(event.target).closest('.data-item-container');
      this.name = this.DOMelement.find('input.name').val();
      this.url = this.DOMelement.find('input.url').val();
      this.css = this.DOMelement.find('input.css').val();
      this.goal = this.DOMelement.find('input.goal').val();
      this.goal_type = this.DOMelement.find('.radio-container input[type="radio"]:checked').val();
    }

    // Log it
    console.log(boomerang.inspector.sender);

    // Update the goal type
    var item_goal_type_val = boomerang.inspector.sender.goal_type;
    var inspector_goal_type_input = $('#inspector .radio-container input[value="'+ item_goal_type_val + '"]').prop('checked', true);
  }



  //
  // Search the loaded webpage using the `#inspector .css` <input>
  inspector_selector_input.on('change paste input', function() {
    // console.log('Selector changed.');
    inspectorUpdateResults();
    checkSubmitAvailability();

  });
  inspector_selector_input.on('keyup', function() {
    // Check if the input is empty
    if ( !$(this).val() ) {
      window.frames[0].window.removeTargets();
      inspector_result.html('');
      return false;
    }
    var val = $(this).val();
    window.frames[0].window.runFrameFunctions(val);
    console.log(val);
  });





  // Search for the results based on the current selector
  // Take the current HTML --> run $(elements) on the iFrame contents --> return results to front-end
  function inspectorUpdateResults() {
    var current_selector = $("#inspector .css").val();

    // Only continue if the selector exists
    if ( current_selector ) {
      var result = $('iframe').contents().find(current_selector);

      // Highlight the current class
      window.frames[0].window.runFrameFunctions(current_selector);

      // Remove IDs
      var new_thing = result.clone().removeAttr('id');

      // console.log("Result", new_thing);
      $("#inspector .result").html(new_thing);
    }
  }



  function checkSubmitAvailability() {
    var el = $("#inspector input");
    var submit = $("#inspector .done");

    // Check to make sure they're not submitting with the initial message visible
    if ( el.val() == "" || el.val() == undefined || el.val() == inspector_initial_message ) {
      submit.hide();
    } else {
      submit.show();
    }
  }



  //
  // Buttons
  // These will trigger open, close, and save actions

  // Open Inspector
  $(document).on('click', '.data-item-container', boomerang.inspector.toggle);


  // Done: Save & Close
  $("#inspector .done").click(function() {
    // Create a re-usable function for updating items
    function update_Item_input(ELEMENT, OUTPUT) {
      // Find the element, then update it's value
      boomerang.inspector.sender.DOMelement.find(ELEMENT).val( OUTPUT );
    }

    // Update the Name
    update_Item_input( 'input.name', inspector_name_input.val() );
    // Update the CSS selector
    update_Item_input( 'input.css', inspector_selector_input.val() );
    // Update the URL
    update_Item_input( 'input.url', inspector_url_input.val() );
    // Update the Goal
    update_Item_input( 'input.goal', inspector_goal_input.val() );


    // Find the new value of radio group
    var checked_val = $('#inspector .radio-container input[type="radio"]:checked').val();

    // Set the new value of radio group
    var inspector_goal_type_input = boomerang.inspector.sender.DOMelement.find('.radio-container input[value="'+ checked_val + '"]').prop('checked', true);

    // Close the Inspector
    boomerang.inspector.toggle( $(this) );

    // Save the updated item
    boomerang.items.save();

    // Clear the Inspector
    // boomerang.inspector.clearSelector();
  });


  // Close Inspector
  $("#inspector .close").on('click', function() {
    boomerang.inspector.toggle( $(this) );
    boomerang.inspector.clearSelector();
  });


  //
  // Clear all Inspector inputs
  //
  $("#inspector .clear").click(function() {
    boomerang.inspector.clearSelector( $(this) );
  });




  // Send the current URL to be fetched
  //
  boomerang.inspector.submitURLform = function(e) {
    if (e) {
      e.preventDefault();
    }

    // Save to JSON
    var url = inspector_url_input.val();

    var inspector_data = [];
    inspector_data.push({
      url: url
    });

    // console.log(inspector_data);

    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: "http://localhost:8000/grab-input",
      data: JSON.stringify({data: inspector_data}),
      success: function(msg) {

        // Trigger a function in the server.js
        // This is the secret sauce that will then
        // call the grabHTML.js file's function
        process.mainModule.exports.grabHTML();

        console.log( inspector_url_input.value );

        // Only show a loading indicator if the URL is set
        if ( $(inspector_url_input).val() ) {
          // Show a loading indicator
          boomerang.inspector.showLoading(true);
        } else {
          boomerang.inspector.showLoading(false);
        }

        inspector_data = []; // clear the old data
      },
      error: function(msg) {
        notify(e);
        boomerang.inspector.showLoading(false);
        console.log("Error loading iFrame data: ", e.statusText);
      }
    });
  }

  $("#inspector form").submit(function(e){
    boomerang.inspector.submitURLform(e)
  });




// Show a message about selecting general/specific elements
  $("#inspector-selector-general").click(function(e){
    popToast("Now selecting general elements.", '#inspector .result');
  });
  $("#inspector-selector-specific").click(function(e){
    popToast("Now selecting specific elements.", '#inspector .result');
  });


  // Check the value of radios
  // Show/Hide the Goal popup
  function toggleInputGoal(el) {
    // el = $(this) scope

    // Get the value of the radio elements
    var x = el.find('input[type="radio"]:checked').val();

    // Find the element we want to show/hide
    var y_el = el.parent().find('input.goal').parent();

    // If value is not a number...
    if ( x != "above" && x != "below" ) {
      y_el.fadeOut("fast");
      // If the value is set...
    } else {
      y_el.fadeIn("fast");
    }
  }

  // Watch for changes
  $("#inspector .radio-container").on('change', function() {
    toggleInputGoal( $(this) );
  });


  // When the iFrame has loaded
  // Load in the JSON (which contains the website HTML)
  $("#iframe").on('load', () => {
    console.log('iFrame loaded');

    // Get the empty-state HTML of the Inspector
    boomerang.inspector.empty_state_html = $('iframe').contents().find('#iframe-content').html();
    console.log(boomerang.inspector.empty_state_html);
  });




  // Set the default CSS selector type
  // When a link is clicked in the Inspector, it will modify this
  boomerang.inspector.selector_type = "general";

  $('#inspector-selector-specific').on('click', function(event) {
    event.preventDefault();
    // Update local variable
    boomerang.inspector.selector_type = "specific";
    // Update iFrame's variable
    window.frames[0].window.selector_type = boomerang.inspector.selector_type;
    console.log('inspector.js', boomerang.inspector.selector_type, window.frames[0].window.selector_type);
  });

  $('#inspector-selector-general').on('click', function(event) {
    event.preventDefault();
    // Update local variable
    boomerang.inspector.selector_type = "general";
    // Update iFrame's variable
    window.frames[0].window.selector_type = boomerang.inspector.selector_type;
    console.log('inspector.js', boomerang.inspector.selector_type, window.frames[0].window.selector_type);
  });


  $("#inspector #refresh-iframe").click(function() {
    boomerang.inspector.updateIframeContent();
  });





  // Toggle red outlining of the DOM on/off
  $("#inspector-toggle-DOM-outline").on('click', function() {
    var target_el = $('iframe').contents().find('#iframe-content *');
    $(target_el).attr('show-DOM-shapes', $(target_el).attr('show-DOM-shapes') == 'enabled' ? 'disabled' : 'enabled');
  });



  // Create resizable panels
  Split(['#inspector .top-panel', '#inspector .bottom-panel'], {
    direction: 'vertical',
    gutterSize: '15',
    sizes: [70, 30]
  });


}); // end
