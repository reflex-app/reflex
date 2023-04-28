const { promises: fs } = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const { PROJECT_ROOT, RESOURCES_DIR } = require('../.electron-nuxt/config') // Import from Electron-Nuxt

const input = `${PROJECT_ROOT}/node_modules/playwright/.local-browsers` // Don't forget the last '/' or terminal may think its a file
const output = `${PROJECT_ROOT}/node_modules/playwright/.local-browsers` // Waiting on https://github.com/electron-userland/electron-builder/issues/5500
const browsers = ['chromium', 'firefox', 'webkit']

;(async () => {
  // This will copy the .local-browsers binaries that Playwright installed for us
  // into the resources directory for the final app
  // const output = `${RESOURCES_DIR}/.local-browsers/` // Should be this! // Waiting on https://github.com/electron-userland/electron-builder/issues/5500

  // Check if input directory exists
  const dirExists = await ls(input)

  // Check if Playwright's .local-browsers exist...
  if (dirExists) {
    console.log('Playwright directory exists')

    // Call the other functions
    // TEMPORARILY DISABLED BUT SHOULD BE RE-ENABLED IF NO LONGER USING NODE_MODULES
    // Copy the contents of node_modules/playwright/.local-browsers into the app's resources directory
    // https://stackoverflow.com/a/64255382/1114901
    // await copyDir(input, output).catch(errorHandler)
    // shx https://stackoverflow.com/a/59823713/1114901
    // await runExec(`npx shx cp ${input} ${output}`)

    // STEP: Check to make sure the browser binaries exist
    const sanityCheck = await checkIfDirHasBinaries(output)

    if (sanityCheck) {
      console.log(`Browser binaries for ${browsers} exist at: ${output}.`)
      return true // Done
    } else {
      console.error(`Missing a browser binary! Found: ${dirExists}`)
      return await reInstall() // Re-install
    }
  } else {
    // if not, re-install Playwright
    // NOTE: This will end the execution of the code
    console.log(`.local-browsers directory not found at ${input}`)

    // Finish after the next script
    return await reInstall()
  }
})()

// Re-install script
async function reInstall() {
  console.log(`Installing Playwright properly... (this may take a while)`)

  // NOTE: Node 14.0 had issues when installing packages. Using Node >14.x seems to work.
  // See: https://github.com/microsoft/playwright/issues/4033#issuecomment-702325569

  process.env.PLAYWRIGHT_BROWSERS_PATH = 0 // Set the environment

  if (process.env.PLAYWRIGHT_BROWSERS_PATH !== '0') {
    console.error(
      'Env is not configured correctly. PLAYWRIGHT_BROWSERS_PATH is not 0.'
    )
    process.exit(0)
  }

  // Install dependency (default for Yarn)
  // --no-bin-links: Prevent symlinks to binaries
  // await runExec(`yarn add playwright`)
  await runExec(`npx cross-env PLAYWRIGHT_BROWSERS_PATH=0 yarn add playwright`)

  // Check to see if it worked
  const installed = await checkIfDirHasBinaries(output)
  if (!installed) {
    console.error(
      `Not installed. Make sure that the env variable exists (PLAYWRIGHT_BROWSERS_PATH=0) and there wasn't any issues with the download.`
    )
    process.exit(0)
    // await runExec(`node ./node_modules/playwright/install.js`)
  }
}

async function checkIfDirHasBinaries(dir) {
  // Get an array of files & directories in the resources path
  // Expect to see a folder for chromium, firefox, and webkit
  const results = await ls(dir)

  // Check to see if there's a folder with the name of each browser we expect
  return browsers.every((v) => results.find((x) => x.includes(v)))
}

// Run a child process
// https://stackoverflow.com/a/30168821/1114901
function runExec(fnString) {
  return new Promise((resolve, reject) => {
    const child = spawn(fnString, {
      // stdio: 'inherit',
      // stdio: 'pipe',
      encoding: 'utf-8',
      shell: true,
      cwd: process.cwd(),
    })

    // console.log(child)
    // console.log(child.stdout)

    console.log(`Running ${fnString}`)

    child.stdout.on('data', (data) => {
      console.log('stdout: ' + data.toString())
    })

    child.stderr.on('data', (data) => {
      console.log('CHILD PROCESS: ' + data.toString())
    })

    child.on('error', function (err) {
      reject(new Error(err))
      errorHandler(err)
    })

    child.on('exit', function (code) {
      console.log('child process exited with code ' + code.toString())
      resolve(true)
    })

    child.on('close', function (code) {
      console.log('child process exited with code ' + code.toString())
      resolve(true)
    })
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
    const dir = await fs.opendir(path) // Opens a stream https://nodejs.org/api/fs.html#fs_class_fs_dir

    for await (const dirent of dir) {
      tempArr.push(dirent.name)
    }

    // The dir is automatically closed
    // https://stackoverflow.com/questions/63839910/error-on-dir-close-after-async-iterator-over-fs-dir-created-by-fs-opendir/63840108#63840108
    // await dir.close() // Close the stream https://nodejs.org/api/fs.html#fs_dir_close

    console.log(tempArr)

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
