// Set release flag based on Yarn script OR Github Action input
// NOTE: Github Action envs ("INPUT_RELEASE") are all-caps https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions#inputs
import path from 'path'
import {
  Configuration,
  MacConfiguration,
  DmgOptions,
  NsisOptions,
  TargetConfiguration,
  WindowsConfiguration,
} from 'electron-builder'
import pkgJson from './package.json'

const root = './'

const getEnv = (name: string, expectedVal: string | null) => {
  // Returns the value for an environment variable (or `null` if it's not defined)
  // We assume the env vars are uppercase
  const getEnv = (name: string) => process.env[name.toUpperCase()] || null

  // Set the variable
  // Try looking for the name on its own, as well as the Github Actions version ("INPUT_")
  const value = getEnv(name) || getEnv(`INPUT_${name}`)
  if (!value) {
    console.log(`"${name}" variable is not defined`)
  }

  // Either return true/false if user expected a certain value
  if (expectedVal) {
    // Return boolean
    return value === expectedVal
  } else {
    // Or, if no expectedVal is set: return the value by itself
    return value
  }
}

const isRelease = getEnv('RELEASE', 'true') || false // Controls whether the app will be codesigned, notarized, published
const isFastBuild = getEnv('FAST_BUILD', 'true') || false

console.log(`Is release? ${isRelease}`)

const ICONS_DIR = 'build/icons/'

const macOS = {
  mac: {
    // Builds for Intel (x64) + M1 (arm64) chips
    // https://github.com/electron-userland/electron-builder/issues/5689#issuecomment-792876001
    target: {
      // target: 'default' is required
      // It creates dmg + zip files for Mac builds
      // This is expected for auto-updates to work properly
      // Waiting on: https://github.com/electron-userland/electron-builder/issues/2199
      target: isFastBuild ? 'dir' : 'default',
      // Build for M1 chips (arm64) + Intel (x64) chips
      arch: ['arm64', 'x64'],
    } as TargetConfiguration,
    icon: ICONS_DIR + 'icon.icns',
    entitlements: 'build/entitlements.mac.plist', // Required for MacOS Catalina
    entitlementsInherit: 'build/entitlements.mac.plist', // Required for MacOS Catalina
    // hardenedRuntime: true, // Required for MacOS Catalina. Now defaults to true.
    // gatekeeperAssess: false, // Required for MacOS Catalina. Now defaults to false.
  } as MacConfiguration,
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
  } as DmgOptions,
}

const windowsOS = {
  win: {
    icon: ICONS_DIR + 'icon.ico',
    publisherName: 'Nick Wittwer',
    target: 'nsis',
    verifyUpdateCodeSignature: false, // Don't codesign https://github.com/electron-userland/electron-builder/issues/2786#issuecomment-383813995
  } as WindowsConfiguration,
  nsis: {
    differentialPackage: true,
  } as NsisOptions,
}

const config: Configuration = {
  productName: pkgJson.productName,
  appId: 'com.reflex.app',
  artifactName: 'Reflex-${version}-${os}-${arch}.${ext}',

  // The `publish` setting here is just for defining the publish provider
  // The actual publishing is handled by setting `electron-builder --publish always`
  // Which is done in our case via Github Actions workflow
  publish: ['github'], // Publish artifacts to Github (release)

  // Enable Release channels
  // https://www.electron.build/tutorials/release-using-channels#release-using-channels-auto-updates-with-channels
  // // Latest/beta/alpha channel https://github.com/electron-userland/electron-builder/issues/1182
  generateUpdatesFilesForAllChannels: true, // This will generate update files for each channel (i.e. latest.yml, beta.yml, alpha.yml)

  directories: {
    output: path.resolve(root, 'build'),
  },
  files: [
    '.output/**/*',
    'dist-electron',
    'package.json',
    '!**/node_modules/playwright-core/.local-browsers/**/*', // Exclude Playwright browsers
  ],
  // Using ASAR
  // https://github.com/puppeteer/puppeteer/issues/2134#issuecomment-408221446
  asar: true,
  asarUnpack: [
    'package.json',
    'dist-electron', // Injected into `renderer` <WebView>
    'node_modules/playwright-core', // Cross-browser screenshots
    'node_modules/html-to-image', // Screenshots from with <WebView>
  ],
  extraResources: [
    'server',
    {
      from: path.resolve(root, '/extraResources/'),
      to: 'app/dist/extraResources', // e.g. /Users/user123/.../reflex/app/build/mac-arm64/Reflex.app/Contents/Resources/app/_____
    },
  ],
  ...macOS,
  ...windowsOS,
}

export default config
