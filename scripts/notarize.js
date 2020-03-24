require('dotenv').config();
const {
  notarize
} = require('electron-notarize');

exports.default = async function notarizing(context) {
  const {
    electronPlatformName,
    appOutDir
  } = context;

  if (electronPlatformName !== 'darwin') return false

  const appName = context.packager.appInfo.productFilename;
  const appBundleId = 'com.nickwittwer.reflex'
  const appPath = `${appOutDir}/${appName}.app`

  console.info('Notarizing...', {
    appBundleId: appBundleId,
    appPath: appPath
  });

  return await notarize({
    appBundleId: appBundleId,
    appPath: appPath,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  });
};
