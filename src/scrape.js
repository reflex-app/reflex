console.log('scrape.js script loaded!');

// Load Node Modules
const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

// Object to hold the CSS selector
let selector_objects = [];

// Create the progress variables
var progress_of_scrape, progress_total, current_progress = 0, callback;

// Create an object we can push into
var final_results_object = [];


// The file with the list of sites to scrape
const sites_JSON_file = './data/sites-to-scrape.json';

// Create the object that will contain the JSON and be iterated on
let scrape_items;

// Load the sites-to-scrape JSON file
// And set scrape_items to the parsed JSON object
fs.readFile(sites_JSON_file, (err, data) => {
  if (err) throw err;

  console.log( JSON.parse(data) );

  // Make sure there's 1+ site to search for
  try {
    if ( data.length < 1 ) {
      console.log('Less than 1 result');
      throw err;
    } else if ( data.length >= 1 ) {
      scrape_items = JSON.parse(data);
      console.log('Added ' + scrape_items.length + ' items from JSON.', scrape_items);
    }
  } catch(e) {
    alert('Please add a website you would to track.', e);
    throw new Error("No sites have been added yet.");
  }
});


(async () => {

  // Launch puppeteer
  // For testing, use: puppeteer.launch({headless: false})
  const browser = await puppeteer.launch();

  // Set the items (each key in the sites-to-scrape.json file)
  const items = scrape_items;

  let console_messages = [];

  // Create an async array composed of each item in items
  // It will use the same browser and open tabs (pages) for each item
  const results = items.map(async (item, i) => {
    const page = await browser.newPage();

    // If the item has a URL, store it
    var link = item.url || "";

    // Expose a place where we can store the action-url for this item. It's the nearest a.href to the item we're searching for.
    var result_link;

    // Create a variable (without a period) for the CSS selector from the Item
    var css_selector = item.css;

    // Log Puppeteer errors
    page.on('console', handleError);
    page.on('error', handleError);
    page.on('requestfailed', request => {
      console.log(request.url() + ' ' + request.failure().errorText);
    });

    // Set up fake user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36');
    console.log('User agent:', await page.evaluate(() => navigator.userAgent));

    // Prevent loading images and stylesheets
    await page.setRequestInterception(true);
    const block_resources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
    page.on('request', request => {
      if (block_resources.indexOf(request.resourceType) > 0)
      request.abort();
      else
      request.continue();
    });

    // What page is loading?
    console.log(`loading page: ${item.name}`);

    // Try to go to the page
    await page.goto(item.url, {
      waitUntil: 'domcontentloaded', // networkidle0
      timeout: 10000
    }).catch(e => {
      handleError('FAIL: ' + item.name + ' failed to load.', e.message);
      PROGRESS(current_progress++);
      // page.close();
    });


    // Check if the CSS selector exists
    try {
      // Search for the element in the DOM
      await page.waitForSelector(item.css, { timeout: 15000 });
      console.log(item.name + ': CSS selector found');
    } catch(err) {
      handleError('FAIL: The CSS selector for ' + item.name + ' did not return any results. Please check CSS selector and try again.');
      PROGRESS(current_progress++);
    }



    // Convert goal to number
    if ( item.goal ) {
      item.goal = Number(item.goal);
    } else {
      item.goal = null;
    }

    // Set the timestamp
    let d = new Date();
    let offset = (new Date().getTimezoneOffset() / 60) * -1;
    let item_timestamp = new Date(d.getTime() + offset);
    item_timestamp.toISOString(); //"2011-12-19T15:28:46.493Z"




    // Check if goal_type is set
    // Otherwise, default to text
    if ( !item.goal_type || item.goal_type == undefined ) {
      item.goal_type = "other";
      console.log('No goal type set for ' + item.name);
    }

    // We're searching for a number (text string)!
    if ( item.goal_type == "above" || item.goal_type == "below" ) {

      result = await page.evaluate((css_selector, selector_objects) => {

        var elements = Array.from(document.querySelectorAll(css_selector));
        let listObject = elements.map(element => {
          return element.innerText
        });
        elements = listObject;

        return elements;

      }, css_selector, selector_objects);


      // We're searching for text/links
    } else if ( item.goal_type == "other" ) {

      // Add jQuery to the page to make selecting classes easier
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

      // Search the page for selector
      result = await page.evaluate((css_selector, link) => {

        // Make jQuery accessible
        const $ = window.$;

        // query all selectors on the page
        var elements = document.querySelectorAll(css_selector); // [ {'.class1'}, {'.class2'} ]

        // Create an array --> push
        let output = [];
        let array = Array.from(elements).forEach((element,index) => {

          // We're in the context of one of the Pupeteer windows
          // 1. We want to use jQuery to find the current selector
          // 2. We want to get the text of that selector
          // 3. We want to find the nearest a.href tag
          // 4. We want to push the text and a.href into the `result` variable
          //
          // We do this by first trying to inject jQuery into the website that's loading via Puppeteer
          // Then, we try to find step 2-3
          // During step 2, we check to see if the child or parent contains an a.href. The preference is for the child to contain one, but if it doesn't, we check the parent. It's more likely that the child is the correct link.

          var href;

          // Check to see if children elements contains any a.href's
          // This is probably the most standard way of creating links
          // i.e. <div id="element"><a href="">Link</a></div>
          if ( $(element).closest('a').prop('href') ) {

            // Grab the nearest a.href property
            // It will be the full http/https://... value
            href = $(element).closest('a').prop('href');

            // Push the results into our array for later
            output.push({
              content: $(element).text(),
              href: href
            });

            // If no child elements contain the a.href...
          } else if ( $(element).parent().find('a').prop('href') ) {

            // Grab the nearest a.href property
            // It will be the full http/https://... value
            href = $(element).parent().find('a').prop('href');

            // Push the results into our array for later
            output.push({
              content: $(element).text(),
              href: href
            }); // "href": href

          } else {

            // Push the results into our array for later
            output.push({
              content: $(element).text(),
              href: link
            }); // "href": href
          }

        });

        // Set the value of --> var result
        return output;

      }, css_selector, link);




    } else if ( item.goal_type == "image" ) {
      result = await page.evaluate((css_selector) => {
        let elements = document.querySelector('' + css_selector + '').src;
        // Return the results
        return elements;
      }, css_selector);

    }


    // Log what our final result is for each item
    console.log("Result:", item.name, result);



    //
    //
    // Any conversions of data
    //
    //

    // Convert result to number if necessary
    if ( item.goal_type == "above" || item.goal_type == "below" ) {

      // If it's multiple numbers in an array...
      if ( result.length > 1 ) {

        // @// TODO: Create a loop
        // for (var i in result) {
        //   var result_number = String(i).replace(/[^\d.-]/g, '');
        //   result_number = Number(result_number);
        //   result_number = Math.round(result_number);
        //   result_number = result_number.toFixed(2);
        //
        //   var difference = result_number - item.goal;
        //   difference = difference.toFixed(2);
        // }

      } else {

        // Convert the number
        // Make sure it's a string
        var result_as_string = String(result);
        console.log( result_as_string + " | string" );

        // Strip symbols/text
        var result_number = result_as_string.replace(/[^\d.-]/g, '');
        console.log( result_number + ": without symbols | " + typeof result_number );

        // Temporarily turn it into a number
        // Then use .toFixed() to set 2 decimal points
        result_number = Number(result_number);

        // result_number = result_number.toFixed(2);
        // console.log( result_number + " | " + typeof result_number );

        var difference = result_number - item.goal;
        // difference = difference.toFixed(2);

        // console.log("difference", difference);
        // console.log("result", result);
        // console.log('result num', result_number);
        // console.log("result string", result_as_string);
      }


    }


    console.log('Current object', item.name, item.goal_type);



    //
    //
    // Logic
    //
    //
    // Check what the goal type was (above or below)
    if ( item.goal_type == "above" || item.goal_type == "below") {
      let key = {}
      key ["ID"] = i;
      key ["title"] = item.name;
      key ["result"] = result_number.toString();
      key ["goal"] = item.goal.toString();
      key ["goalType"] = item.goal_type.toString();
      key ["difference"] = difference.toString();
      key ["link"] = link;
      key ["timestamp"] = item_timestamp;
      if ( result.length > 1 ) {
        key ["hasMultipleItems"] = true;
      } else {
        key ["hasMultipleItems"] = false;
      }
      final_results_object.push(key); // Push the object into an array that we can later send
    } else if ( item.goal_type == "other" ) {
      let key = {}
      key ["ID"] = i;
      key ["title"] = item.name;
      key ["result"] = result;
      key ["link"] = link;
      key ["isOther"] = true;
      key ["timestamp"] = item_timestamp;
      if ( result_link ) {
        key ["action-url"] = result_link;
      }
      if ( result.length > 1 ) {
        key ["hasMultipleItems"] = true;
      } else {
        key ["hasMultipleItems"] = false;
      }
      final_results_object.push(key); // Push the object into an array that we can later send
    } else if ( item.goal_type == "image" ) {
      let key = {}
      key ["ID"] = i;
      key ["title"] = item.name;
      key ["result"] = result;
      key ["link"] = link;
      key ["isImage"] = true;
      key ["timestamp"] = item_timestamp;
      if ( result.length > 1 ) {
        key ["hasMultipleItems"] = true;
      } else {
        key ["hasMultipleItems"] = false;
      }
      final_results_object.push(key); // Push the object into an array that we can later send
    }


    console.log('Current object', final_results_object, item.name);



    // Send the progress back to the front-end
    // Update the current progress in the progress bar
    PROGRESS(current_progress++);
    function PROGRESS(i) {
      let input = Number(i + 1); // account for the 0 index
      progress_of_scrape = input;
      progress_total = scrape_items.length;
    }

    // Send the progress to the server (server.js)
    if ( typeof callback == 'function' ){
      let progress_array = [];
      progress_array.push(progress_of_scrape, progress_total, console_messages);
      console.log('console messages', console_messages);
      // Submit the progress back to server.js
      callback(progress_array);
      // console.log(progress_of_scrape, progress_total);
    }

    console.log(`closing page: ${item.name}`);
    await page.close();
  });




  // Wait for each async item to complete (via promises)
  // Then use this function to see which resolved/rejected
  // Instead of requiring all promises to resolve, this will let them pass
  // We need that, because some Items may not return a proper result
  // and we don't want that to break the whole scrape
  // Idea via: https://stackoverflow.com/a/31424853/1114901
  function reflect(promise){
    return promise.then(function(v){
      return {v:v, status: "resolved" }
    },
    function(e){
      return {e:e, status: "rejected" }
    });
  }

  // Promise with the ability to accept errors
  // Now that the Promises are completed, submit the results
  // to our output.json file.
  // This will then be loaded into the front-end.
  Promise.all(results.map(reflect)).then(function(results){
    // var success = results.filter(x => x.status === "resolved");
    // console.log('Promises:', results, success);

    console.log(final_results_object);
    browser.close(); // close Puppeteer browser

    // Save the results
    console.log("Final output: " + final_results_object);
    request({
      url: "http://localhost:8000/results",
      method: "POST",
      json: true,
      body: {data: final_results_object}
    }, function (err, res, body) {
      if (err) {
        console.error('Error posting json: ', err);
        throw err;
      } else {
        let headers = res.headers;
        let statusCode = res.statusCode;
        console.log('headers: ', headers);
        console.log('statusCode: ', statusCode);
        console.log('body: ', body);
      }
    });
  }); // end Promises.all()


  // Handle errors
  function handleError(msg){
    // console.log(msg);
    console_messages.push(msg);
  }


})(); // end async



//
//
// Export the progress as a Node Export
//
//
module.exports = function(cb){
  // If the progress is 0 or not yet defined...
  if ( progress_of_scrape <= 0 ) {
    console.log('Trying to run cb function');
    cb(); // Run this parent function again to check if there's a change
  } else if ( progress_of_scrape >= 1 && progress_of_scrape == progress_total ) {
    console.log('100% reached! Running again!');
    // Reset the list of results
    final_results_object = [];
    // Re-run the function
    callback = cb;
  } else {
    // Reset the progress if it's 100%
    callback = cb; // Run the function inside of loop
  }

}
