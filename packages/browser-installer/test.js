// import { Installer } from "./index";
// import BrowserIntaller from "../dist/main.js";
// const playwright = require('playwright-core')

const path = require('path')
const { Installer: BrowserInstaller } = require('./dist/main.js')

console.log('Browsers env:', process.env['PLAYWRIGHT_BROWSERS_PATH'])

// Run the installer
// If the applications are already installed at the given path,
// they won't be reinstalled
const inst = new BrowserInstaller({
  browsers: ['firefox', 'webkit'],
  installPath: path.resolve(__dirname, 'dist/browsers'), // Temporary demo folder
})
// console.log('Instance', inst)

async function run() {
  console.log('Running browser installer...')
  await inst.run().catch((err) => {
    console.error(err)
  })
}

;(async () => {
  await run()
})()
