// Node Context
const bs = require('browser-sync').create('Server')
// const historyApiFallback = require('connect-history-api-fallback')

let SITE_URL = ''
let PROXY_SERVER_URL = ''

// Initialize a BrowserSync Server
export function startServer(url) {
  return new Promise((resolve, reject) => {
    SITE_URL = url || 'https://shift.nickwittwer.com/'

    bs.init({
      proxy: SITE_URL,
      // middleware: [historyApiFallback()], // via https://github.com/BrowserSync/browser-sync/issues/204#issuecomment-60410751
      open: false,
      logPrefix: 'Synced!',
      notify: true,
      https: true,
      // reloadOnRestart: true,
      callbacks: {
        ready: function () {
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