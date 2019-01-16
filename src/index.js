// Node Context
// Not compiled!

// require the module as normal
const bs = require("browser-sync").create();

// .init starts the server
bs.init({
    server: "./app"
});

// Now call methods on bs instead of the
// main browserSync module export
bs.reload("*.html");