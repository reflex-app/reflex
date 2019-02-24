// Node Context
const bs = require('browser-sync').create()

let SITE_URL = ''
let PROXY_SERVER_URL = ''

// Initialize a BrowserSync Server
export function startServer(url) {
  return new Promise((resolve, reject) => {
    SITE_URL = url || 'https://shift.nickwittwer.com/'
    const needsHTTPS = SITE_URL.includes('https://')

    bs.init({
      proxy: {
        target: SITE_URL
      },
      https: needsHTTPS, // Only set if it contains https
      notify: true,
      open: false,
      logPrefix: 'Synced!',
      // reloadOnRestart: true,
      // logLevel: process.env.NODE_ENV !== 'production' ? 'debug' : '',
      callbacks: {
        ready: () => {
          try {
            PROXY_SERVER_URL = bs.getOption('urls').get('local') // Options: local, external, ui, ui-external

            resolve({
              site: SITE_URL,
              proxy: PROXY_SERVER_URL
            })
          } catch (e) {
            console.log('Sync Server Error: ', e)
          }
        }
      }
    }, function (err, instance) {
      if (err) throw new Error(err)

      // instance.io.sockets.on('connection', function (socket) {
      // @TODO: Emit event for UI
      // const notif = new Notification('Synced!', {
      //   body: 'This site has been synced across all your screens.'
      // })
      // })

      // Custom 404
      // instance.addMiddleware('*', function (req, res) {
      //   // @TODO: 404 page could be nicer
      //   // res.writeHead(302, {
      //   // location: "404.html"
      //   // })
      //   res.end('404! Page not found.')
      // })
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

  // Wait for server to restart
  await checkServerStatus()

  // Send back the new site and Proxy
  return {
    site: SITE_URL,
    proxy: PROXY_SERVER_URL
  }
}
