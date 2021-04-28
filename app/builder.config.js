// Set release flag based on Yarn script OR Github Action input
// NOTE: Github Action envs ("INPUT_RELEASE") are all-caps https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#inputs
const isRelease =
  process.env.RELEASE === 'true' || process.env.INPUT_RELEASE === 'true' // true or false
console.log(`Is release? ${isRelease}`)

const ICONS_DIR = 'build/icons/'

const macOS = {
  mac: {
    target: 'dmg',
    icon: ICONS_DIR + 'icon.icns',
    entitlements: 'build/entitlements.mac.plist', // Required for MacOS Catalina
    entitlementsInherit: 'build/entitlements.mac.plist', // Required for MacOS Catalina
    // hardenedRuntime: true, // Required for MacOS Catalina. Now defaults to true.
    // gatekeeperAssess: false, // Required for MacOS Catalina. Now defaults to false.
    // signIgnore: '/node_modules/playwright/.local-browsers', // Waiting for a way to manually ignore Playwright's browser binaries https://github.com/electron-userland/electron-builder/issues/5500
    // signIgnore: ['.*/node_modules/playwright/.local-browsers'], // https://github.com/electron-userland/electron-builder/pull/5262
  },
  afterSign: isRelease ? 'scripts/notarize.js' : null, // Notarize Mac (ONLY for deploys)
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
  },
  nsis: {
    differentialPackage: true,
  },
}

// The following will be placed inside of `build: { --> HERE <-- }`
module.exports = {
  productName: require('./package.json').productName,
  appId: 'com.reflex.app',
  artifactName: 'Reflex-${version}.${ext}',
  publish: isRelease ? ['github'] : null, //  Publish artifacts to Github (release)
  directories: {
    output: 'build',
  },
  files: [
    'package.json',
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
  extraResources: [
    {
      from: 'src/extraResources/',
      to: '',
    },
  ],
  // Using ASAR
  // https://github.com/puppeteer/puppeteer/issues/2134#issuecomment-408221446
  asar: false, // Whether or not to package
  // asarUnpack: [
  //   'node_modules/reflex-browser-installer/dist/', // binaries installed here
  //   'node_modules/playwright-core', // dependency
  // ], // Unpack dir where browser binaries will be installed

  // asarUnpack: ['**/node_modules/playwright/**/*'], // Unpack the browser binaries
  // asarUnpack: ['node_modules/playwright/.local-browsers/'], // Unpack the browser binaries

  // Once unpacked, you can access the Playwright binaries in a few ways (cross-platform compatible)
  // 1. https://github.com/puppeteer/puppeteer/issues/2134#issuecomment-408221446
  // 2.
  // Copying Playwright's browser binaries (Chromium, Firefox, Webkit) to
  // the final build AND making sure it can be notarized.
  // Extra Resources see: https://stackoverflow.com/a/53011325/1114901
  // https://stackoverflow.com/a/56814459/1114901
  // extraResources: [
  //   {
  //     from: 'node_modules/playwright-core/',
  //     to: 'node_modules/playwright-core/', // We'll then let the reflex-browser-installer use this as a require() dependency
  //     filter: ['**/*'], // Copy all the sub-directories and sub-files
  //   },
  // ],

  // Or... you could try to access the user's own installation of a browser
  // See: https://medium.com/@alexanderruma/using-node-js-puppeteer-and-electronjs-to-create-a-web-scraping-app-with-a-desktop-interface-668493ced47d
  ...macOS,
  ...windowsOS,
}
