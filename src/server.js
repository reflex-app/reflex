console.log('Server script reached');

const request = require('request');
const path = require('path');

const APP_PATH = "";

console.log(__dirname);

// Create server
const express = require('express'),
app = express(),
router = express.Router(),
bodyParser = require('body-parser'),
fs = require("fs");

// Listen on port 8000
var listener = app.listen(8000, function() {
  console.log("Express is running on port " + listener.address().port);
});

// Use our Express router
app.use("/", router);

// Serve the assets
app.use(express.static('./'));

// Parse the JSON content
app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// Save the list of sites to scrape
app.post('/save', function (req, res, err) {
  var output = JSON.stringify(req.body.data, null, 4);
  fs.writeFile("./data/sites-to-scrape.json", output, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }); // post into the /app context
  res.send(output);
});

// Save the results of the scrape
app.post('/results', function (req, res, err) {
  var output = JSON.stringify(req.body.data, null, 4);
  fs.writeFile("./data/output.json", output, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }); // post into the /app context
  res.send(output);
});


// Save the results of a HTML grab request
app.post('/grab-input', function (req, res, err) {
  var output = JSON.stringify(req.body.data, null, 4);
  fs.writeFile("./data/grabHTML/grab-input.json", output, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }); // post into the /app context
  res.send(output);
});

// Save the results of a HTML grab request
app.post('/grab-output', function (req, res, err) {
  var output = JSON.stringify(req.body.data, null, 4);
  fs.writeFile("./data/grabHTML/grab-output.json", output, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }); // post into the /app context
  res.send(output);

  // Refresh the iFrame
  // inspector.js
  window.parent.boomerang.inspector.updateIframeContent();

});


//
// Clear Node Module cache
//
function requireUncached(module){
  delete require.cache[require.resolve(module)];
  return require(module);
}

//
//
// Return the progress of the scrape function to the frontend
//
//
var progress = "";
var progress_total = "";

var exports = module.exports = {};
exports = module.exports = {
  nodeScrape: function nodeScrape() {
    let getScrapeContent = requireUncached('./scrape.js');
    getScrapeContent(function(callback){
      // `callback` contains the values of the callback from scrape.js
      // It's used to move the progress to/from scrape.js
      // callback[0] is the incremental value items that have progressed
      // callback[1] is the total number of items
      if (!callback) {
        // If callback is not set...
        console.log('No callback fired');
      } else {
        // Callback was fired
        console.log('Callback progress: ', callback);

        // Set the progress variables
        progress = callback[0];
        progress_total = callback[1];
        message = callback[2];

        // Once the progress is set to a number, start displaying progress
        if ( progress <= 0 || progress == undefined || progress == "" ) {
          console.log('Callback not set');
        } else {
          // Update the progress until progress == progress_total (100%)
          console.log('Callback fired, updating progress');
          progress_refresh();
        }

        return callback;
      }
    });
  },
  scrapeProgress: progress,
  scrapeProgressTotal: progress_total,
  grabHTML: function grabHTML() {
    let runGrabHTML = requireUncached('./grabHTML.js');
    runGrabHTML(function(callback){
      if (!callback) {
        runGrabHTML();
      } else {
        console.log(callback);
        return callback;
      }
    });
  },
};


// Whenever there's an update...push it!
let last_progress = "";

function progress_refresh() {
  // If there's new information, push the num to the front-end
  // Otherwise, check-again at next interval
  if ( progress != last_progress ) {
    exports.scrapeProgress = progress;
    // console.log(exports);
  }

  // Store the value of the last progress
  last_progress = exports.scrapeProgress;

  // The total progress
  exports.scrapeProgressTotal = progress_total;

  // If it's 100%, stop
  if ( progress && progress >= progress_total ) {
    // Reset the variables to 0
    setTimeout(function() {
      progress = "";
      progress_total = "";
      last_progress = "";
      module.exports.scrapeProgress = progress;
      module.exports.scrapeProgressTotal = progress_total;
      console.log('Done. Progress variables reset.', progress, progress_total, last_progress, module.exports.scrapeProgress, module.exports.scrapeProgressTotal);
    }, 500);
  }
}
