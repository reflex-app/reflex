console.log('grabHTML.js script loaded!');

const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

const absolutify = require('absolutify');

// Create the progress variables
var progress_of_scrape, progress_total, callback;

var selector_objects = [];

let JSON_file = './data/grabHTML/grab-input.json';

// Set up the items
let scrape_items;
fs.readFile(JSON_file, (err, data) => {
  if (err) throw err;


  scrape_items = JSON.parse(data);
  console.log(data, scrape_items);

  // Run the scrape
  execute_scrape();
});




// Create an object we can push into
var final_results_object = [];

// Create the progress variables
var progress_of_scrape, progress_total, callback;

var current_progress = 0;


// (async () => {
// })();

async function execute_scrape() {

  // Are there enough items?
  try {
    if ( scrape_items.length < 1 ) {
      scrape();
    }
  }
  catch(e) {
    console.log("Nothing to show...");
  }

  try {

    // Begin puppeteer:
    const browser = await puppeteer.launch();
    const items = scrape_items;

    const results = items.map(async (item, i) => {

      // Create a new page in the browser
      const page = await browser.newPage();


      // Set up a fake user agent
      // Prevents being seen as a bot
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36');
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
      });
      console.log('Chromium userAgent: ', await page.evaluate(() => navigator.userAgent));



      // Prevent loading images and stylesheets
      await page.setRequestInterception(true);
      const block_ressources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
      page.on('request', request => {
        if (block_ressources.indexOf(request.resourceType) > 0)
        request.abort();
        else
        request.continue();
      });



      console.log(`Fetching HTML`);

      await page.goto(item.url, {
        waitUntil: 'domcontentloaded' // networkidle0
      });


      // Does the CSS selector properly select an item on the page?
      // try {
      //   await page.$(item.css);
      //   console.log('CSS selector found');
      //   await page.waitForSelector(item.css);
      // } catch(err) {
      //   alert('The CSS selector for ' + item.name + ' did not return any results. Please check CSS selector and try again.');
      //   page.close();
      //   // continue;
      // }



      // Get the entire HTML of the page
      // we'll use this for later investigation
      let renderedContent = await page.evaluate('new XMLSerializer().serializeToString(document.doctype) + document.documentElement.outerHTML');
      console.log(renderedContent);



      // Make sure to remove trailing slash from URLs for
      // the relative --> absolute URLs
      let site = item.url;
      let url_without_trailing_slash = site.replace(/\/$/, "");
      console.log("URL", site, url_without_trailing_slash );

      // Convert the relative URLs to absolute
      let absolute_URLs = absolutify(renderedContent, url_without_trailing_slash);
      renderedContent = absolute_URLs;
      console.log(renderedContent);





      // Construct the data we want to send out
      key = {}
      key ["title"] = item.name;
      key ["result"] = renderedContent;
      key ["link"] = item.url;
      final_results_object.push(key); // Push the object into an array that we can later send






      // Provide a callback
      if ( typeof callback == 'function' ){
        callback('Done');
      }

      await page.close();
    });



    // Dump the HTML into a JSON file
    Promise.all(results).then(() => {

      console.log(final_results_object);
      browser.close();

      // Save the results
      console.log("Final output: " + final_results_object);
      request({
        url: "http://localhost:8000/grab-output",
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



    });
  } catch (error) {
    console.log(error);
  }
}






//
//
// Export the progress as a Node Export
//
//
module.exports = function(cb){
  // Reset the progress if it's 100%
  callback = cb; // Run the function inside of loop
}
