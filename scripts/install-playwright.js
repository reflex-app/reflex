const { promises: fs } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { PROJECT_ROOT, RESOURCES_DIR } = require('../.electron-nuxt/config') // Import from Electron-Nuxt

;(async () => {
  // This will copy the .local-browsers binaries that Playwright installed for us
  // into the resources directory for the final app
  const input = `${PROJECT_ROOT}/node_modules/playwright/.local-browsers/` // Don't forget the last '/' or terminal may think its a file
  const output = `${PROJECT_ROOT}/node_modules/playwright/.local-browsers/` // Waiting on https://github.com/electron-userland/electron-builder/issues/5500
  // const output = `${RESOURCES_DIR}/.local-browsers/` // Should be this! // Waiting on https://github.com/electron-userland/electron-builder/issues/5500

  const checkInstall = async () => {
    // Check if input directory exists
    const isInstalled = await ls(input)

    // Check if Playwright's .local-browsers exist...
    if (isInstalled) {
      console.log('Playwright is correctly installed')
      return true // Tell the listener it was installed properly
    } else {
      // if not, re-install Playwright
      console.log(`.local-browsers not found in ${input}.`)
      return false
    }
  }

  // Run to check if installed as expected
  // Note: We don't check multipled times, because this whole script
  // is automatically re-run on postinstall (which is triggered by "yarn add playwright")
  const installed = await checkInstall()

  if (installed) {
    // Installed! Exit now.
    console.log('Installed. Returning from install script.')
    return true
  } else {
    // The .local-browsers needs to be installed

    // Install Playwright
    console.log(`Installing Playwright properly... (this may take a while)`)
    await runExec(
      `npx cross-env PLAYWRIGHT_BROWSERS_PATH=0 yarn add playwright -S`
    )

    // TEMPORARILY DISABLED BUT SHOULD BE RE-ENABLED IF NO LONGER USING NODE_MODULES
    // Copy the contents of node_modules/playwright/.local-browsers into the app's resources directory
    // https://stackoverflow.com/a/64255382/1114901
    // await copyDir(input, output).catch(errorHandler)
    // shx https://stackoverflow.com/a/59823713/1114901
    // await runExec(`npx shx cp ${input} ${output}`)

    // Get an array of files & directories in the resources path
    // Expect to see a folder for chromium, firefox, and webkit
    const dir = await ls(output).catch(errorHandler)

    // Check to see if there's a folder with the name of each browser we expect
    const browsers = ['chromium', 'firefox', 'webkit']
    const sanityCheck = browsers.every((v) => dir.find((x) => x.includes(v)))

    if (sanityCheck) {
      console.log(
        `Browser binaries for ${browsers} successfully copied to resources.`
      )
    } else {
      console.error(`Missing a browser binary! Found: ${dir}`)
    }
  }
})()

function runExec(fnString) {
  return new Promise((resolve, reject) => {
    if (typeof fnString !== 'string') fnString = fnString.toString()

    try {
      const child = exec(fnString)

      // Log the process
      child.stdout.pipe(process.stdout)

      child.on('error', function (err) {
        reject(new Error(err))
        errorHandler(err)
      })

      child.on('exit', function () {
        resolve(true)
      })
    } catch (err) {
      errorHandler(err)
      process.exit(1)
    }
  })
}

// Recursively copy a directory to another location
// via https://stackoverflow.com/a/64255382/1114901
async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      entry.isDirectory()
        ? await copyDir(srcPath, destPath)
        : await fs.copyFile(srcPath, destPath).catch(async (err) => {
            if (err.code === 'EISDIR') {
              // If it is actually a directory
              await copyDir(srcPath, destPath)
            } else {
              // Otherwise throw the error
              throw new Error(err)
            }
          })
    }
  } catch (err) {
    errorHandler(err)
    return false // Reject the promise
  }
}

// Find all files & folders at a path
// https://stackoverflow.com/a/59042581/1114901
async function ls(path) {
  try {
    const tempArr = []
    const dir = await fs.opendir(path)

    for await (const dirent of dir) {
      // console.log(dirent.name)
      tempArr.push(dirent.name)
    }

    return tempArr // return all the files & directories at the output dir
  } catch (err) {
    errorHandler(err)
    return false
  }
}

function errorHandler(err) {
  console.error(new Error(err))
  // process.exit(1)
}
