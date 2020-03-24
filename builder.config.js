const isRelease = process.env.RELEASE == 'true'
const ICONS_DIR = 'build/icons/'

const windowsOS = {
  win: {
    icon: ICONS_DIR + 'icon.ico',
    publisherName: 'Nick Wittwer',
    target: 'nsis',
    publish: ['github'] // Automatically publish artifacts to Github
  },
  nsis: {
    differentialPackage: true
  }
}

const linuxOS = {
  linux: {
    icon: ICONS_DIR,
    target: 'deb'
  }
}

const macOS = {
  mac: {
    target: 'dmg',
    icon: ICONS_DIR + 'icon.icns',
    hardenedRuntime: true, // Required for MacOS Catalina
    gatekeeperAssess: false, // Required for MacOS Catalina
    entitlements: "build/entitlements.mac.plist", // Required for MacOS Catalina
    entitlementsInherit: "build/entitlements.mac.plist", // Required for MacOS Catalina
    publish: isRelease ? ['github'] : null //  Publish artifacts to Github (only for deploys)
  },
  dmg: {
    sign: false, // Required for MacOS Catalina
    contents: [{
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ]
  }
}

module.exports = {
  asar: true,
  productName: require('./package.json').productName,
  appId: 'com.reflex.app',
  artifactName: 'Reflex-${version}.${ext}',
  directories: {
    output: 'build'
  },
  // default files: https://www.electron.build/configuration/contents
  files: [
    'package.json',
    {
      from: 'dist/main/',
      to: 'dist/main/'
    },
    {
      from: 'dist/renderer',
      to: 'dist/renderer/'
    }
  ],
  afterSign: isRelease ? "scripts/notarize.js" : null, // Notarize Mac (ONLY for deploys)
  ...windowsOS,
  ...linuxOS,
  ...macOS
}
