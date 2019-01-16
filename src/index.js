// Node Context
const bs = require("browser-sync").create('Server');

// Start our server
startServer();

// Initialize a BrowserSync Server
function startServer(url) {
  url = url || 'https://www.wikipedia.org/';

  bs.init({
    proxy: url,
    open: false,
    callbacks: {
      ready: function (err, bs) {
        const localURL = bs.getOption('urls').get('local'); // Options: local, external, ui, ui-external
        window.browserSync = localURL;
        console.log('URL: ', url)
      }
    }
  });
}

// Change the Proxy URL
// This can be called as:
// window.nw.process.mainModule.exports.changeProxyURL(url)
// (From inside of the web app)
exports.changeProxyURL = async function (newURL) {

  function checkServerStatus() {
    return new Promise((resolve, reject) => {
      bs.exit(); // Exit current instance
      console.log('server status', bs.active);

      if (bs.active === true) {
        setTimeout(checkServerStatus, 100); /* check every 100 milliseconds*/
      } else {
        // Exitted!
        console.log('Done!')
        startServer(newURL); // Start a new server with our url
        resolve(newURL); // Return the new URL to the caller
      }
    });
  }

  var theURL = await checkServerStatus();
  return theURL;
}