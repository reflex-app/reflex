// import { Installer } from "./index";
// import BrowserIntaller from "../dist/main.js";
// const playwright = require('playwright-core')

import path from 'path'

// const { Installer: BrowserInstaller } = require("../dist/main.js");
const { Installer: BrowserInstaller } = require('./dist/main.js')

// Run the installer
// If the applications are already installed at the given path,
// they won't be reinstalled
const inst = new BrowserInstaller({
  browsers: ['firefox', 'webkit'],
  installPath: path.join(__dirname, './dist/demo'), // Temporary demo folder
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
