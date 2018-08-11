const request = require('request');
const path = require('path');

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
app.use(express.static('../dist'));
app.use(express.static('../'));

// Parse the JSON content
app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));