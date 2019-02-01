// Node Context
const bs = require('browser-sync').create('Server')

// Initialize a BrowserSync Server
export async function startServer(url) {
  return new Promise((resolve, reject) => {
    url = url || 'http://shift.nickwittwer.com/'
    bs.init({
      proxy: url,
      open: false,
      notify: false,
      callbacks: {
        ready: function () {
          const localURL = bs.getOption('urls').get('local') // Options: local, external, ui, ui-external
          // mainWindow.browserSync = localURL
          console.log('Proxy URL: ', url)
          console.log('Serve URL: ', localURL)
          resolve(url)
        }
      }
    })
  })
}

// Change the Proxy URL
// This can be called as:
// window.nw.process.mainModule.exports.changeProxyURL(url)
// (From inside of the web app)

exports.changeProxyURL = async function (newURL) {
  async function checkServerStatus() {
    function exitServer() {
      bs.exit() // Exit current instance
    }

    // Close the server
    exitServer()

    // Confirm it's closed
    // Otherwise, try again every 100ms
    if (bs.active === true) {
      setTimeout(exitServer, 100)
    } else if (bs.active === false) {
      await startServer(newURL)
      return true
    }
  }

  var theURL = await checkServerStatus()
  return theURL
}




// // toggle server 
// ipcMain.on('toggleServer', function(event, arg) {
//   //console.log('before', bs.active);
//   //console.log(arg);
//   if (!bs.active && arg.command == 'start') {
//       // no server started so lets start
//       bs.init({
//           // server:true,
//           proxy: arg.url,
//           browser: arg.selectedBrowsers || undefined,
//           logPrefix: "My Sync tester Project",
//           reloadOnRestart: true,
//           notify: true,
//           open: "external",
//           ghostMode: {
//       clicks: true,
//       location: false,
//       forms: true,
//       scroll: true
//     }

//       }, function(err, bs) {
//           //console.log('bs-active', bs.active);
//           if (bs.active) {

//           }
//           event.sender.send('toggleServer-reply', 'started', 'WOW!!! Browsersync is running now!',bs);
//       });
//   }
//   else if (arg.command == 'stop') {
//       //console.log('server is going to stop');
//           bs.exit(function() {
//               //console.log('server stopped');
//           });
//           event.sender.send('toggleServer-reply', 'stopped', 'Browsersync is stopped!!',bs);

//   }

// });