// const isRelease = process.env.RELEASE // true or false
const ICONS_DIR = 'build/icons/'

const macOS = {
  mac: {
    target: 'dmg',
    icon: ICONS_DIR + 'icon.icns',
    hardenedRuntime: true, // Required for MacOS Catalina
    gatekeeperAssess: false, // Required for MacOS Catalina
    entitlements: 'build/entitlements.mac.plist', // Required for MacOS Catalina
    entitlementsInherit: 'build/entitlements.mac.plist', // Required for MacOS Catalina
    // ignore: '<resources>/.local-browsers', // Waiting for a way to manually ignore Playwright's browser binaries https://github.com/electron-userland/electron-builder/issues/5500
    // publish: isRelease ? ['github'] : null, //  Publish artifacts to Github (release)
  },
  afterSign: 'scripts/notarize.js', // Notarize Mac (ONLY for deploys)
  dmg: {
    sign: false, // Required for MacOS Catalina
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications',
      },
      {
        x: 130,
        y: 150,
        type: 'file',
      },
    ],
  },
}

const windowsOS = {
  win: {
    icon: ICONS_DIR + 'icon.ico',
    publisherName: 'Nick Wittwer',
    target: 'nsis',
    // verifyUpdateCodeSignature: false, // Don't codesign https://github.com/electron-userland/electron-builder/issues/2786#issuecomment-383813995
    // publish: isRelease ? ['github'] : null, // Publish artifacts to Github (release)
  },
  nsis: {
    differentialPackage: true,
  },
}

module.exports = {
  asar: false, // Should be false
  productName: require('./package.json').productName,
  appId: 'com.reflex.app',
  // eslint-disable-next-line no-template-curly-in-string
  artifactName: 'Reflex-${version}.${ext}',
  directories: {
    output: 'build',
  },
  // extends: null, // via https://stackoverflow.com/a/61119994/1114901
  // default files: https://www.electron.build/configuration/contents
  files: [
    'package.json',
    {
      from: 'node_modules/playwright/.local-browsers', // TEMPORARY WORKAROUND
      to: 'node_modules/playwright/.local-browsers',
      filter: ['**/*'],
    },
    {
      from: 'dist/main/',
      to: 'dist/main/',
    },
    {
      from: 'dist/renderer',
      to: 'dist/renderer/',
    },
    {
      from: 'src/resources',
      to: 'dist/resources/',
    },
  ],
  ...macOS,
  ...windowsOS,
}
