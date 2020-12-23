require('dotenv').config()
const { notarize } = require('electron-notarize')

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName !== 'darwin') return false // Only Notarize MacOS apps

  const appName = context.packager.appInfo.productFilename
  const appBundleId = 'com.nickwittwer.reflex'
  const appPath = `${appOutDir}/${appName}.app`

  // eslint-disable-next-line no-console
  console.info('Notarizing...', {
    appBundleId,
    appPath,
  })

  return await notarize({
    appBundleId,
    appPath,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  })
}
