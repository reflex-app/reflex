// Node Context
const bs = require("browser-sync").create('Server');

// Start our server
startServer();

// Initialize a BrowserSync Server
async function startServer(url) {
  return new Promise((resolve, reject) => {
    url = url || 'https://www.wikipedia.org/';

    bs.init({
      proxy: url,
      open: false,
      callbacks: {
        ready: function (err, bs) {
          const localURL = bs.getOption('urls').get('local'); // Options: local, external, ui, ui-external
          window.browserSync = localURL;
          // console.log('URL: ', url)
          resolve(url);
        }
      }
    });
  });
}

// Change the Proxy URL
// This can be called as:
// window.nw.process.mainModule.exports.changeProxyURL(url)
// (From inside of the web app)
exports.changeProxyURL = async function (newURL) {
  async function checkServerStatus() {
    function exitServer() {
      bs.exit(); // Exit current instance
    }

    // Close the server
    exitServer();

    // Confirm it's closed
    // Otherwise, try again every 100ms
    if (bs.active === true) {
      setTimeout(exitServer, 100);
    } else if (bs.active === false) {
      await startServer(newURL);
    }
  }

  var theURL = await checkServerStatus();
  return theURL;
}