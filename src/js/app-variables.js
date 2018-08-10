// Global Namespace
// Additional functions can use `boomerang.fn()` format
var boomerang = {};

var mouse_position; // helps locate items to delete in context menu

// Core files
var itemsJSONPath = 				"./data/sites-to-scrape.json";
var resultsJSONPath = 			"./data/output.json";

// Templates
var itemsTemplatePath = 		"../js/templates/items.mst";
var resultsTemplatePath = 	"../js/templates/results.mst";

// Store the old file
var previousOutputJSONFile = [];
var latestOutputJSONFile = [];

// Create a global object to store new results
var GLOBAL_new_results = [];
