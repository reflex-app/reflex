// Node Context
const bs = require('browser-sync').create('Server')

let SITE_URL = ''
let PROXY_SERVER_URL = ''

// Initialize a BrowserSync Server
export function startServer(url) {
  return new Promise((resolve, reject) => {
    SITE_URL = url || 'https://shift.nickwittwer.com/'

    bs.init({
      proxy: SITE_URL,
      open: false,
      logPrefix: 'Synced',
      reloadOnRestart: true,
      notify: true,
      https: true,
      callbacks: {
        ready: function () {
          try {
            PROXY_SERVER_URL = bs.getOption('urls').get('local') // Options: local, external, ui, ui-external

            resolve({
              site: SITE_URL,
              proxy: PROXY_SERVER_URL
            })
          } catch (e) {
            console.log('Sync Server Error: ', e);
          }
        }
      }
    })
  })
}

export function sendServerDetails() {
  return {
    url: SITE_URL,
    proxy: PROXY_SERVER_URL
  }
}

// Change the Proxy URL
// This can be called as:
// window.nw.process.mainModule.exports.changeProxyURL(url)
// (From inside of the web app)

export async function changeURL(newURL) {
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