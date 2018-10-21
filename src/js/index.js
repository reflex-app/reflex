// Import any required scripts
const $ = require('jquery');
const panzoom = require('../js/plugins/jquery.panzoom');

// Load Shift class
import { shift } from "./shift";
import Artboard from './features/artboard/artboard';

// Create the main instance
export let app = shift;
console.log(app);

// Create artboards
require('../js/features/artboard/artboard');
app.artboards = new Artboard();