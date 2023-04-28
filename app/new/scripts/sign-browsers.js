const { promises: fs } = require('fs')
const path = require('path')
const { spawnSync, spawn } = require('child_process')
const { PROJECT_ROOT, RESOURCES_DIR } = require('../.electron-nuxt/config') // Import from Electron-Nuxt

const input = `${PROJECT_ROOT}/node_modules/playwright/.local-browsers` // Don't forget the last '/' or terminal may think its a file
const output = `${PROJECT_ROOT}/node_modules/playwright/.local-browsers` // Waiting on https://github.com/electron-userland/electron-builder/issues/5500
const browsers = ['chromium', 'firefox', 'webkit']

;(async () => {
  // This will copy the .local-browsers binaries that Playwright installed for us
  // into the resources directory for the final app

  // Check if input directory exists
  const dirExists = await ls(input)

  // Check if Playwright's node_modules/playwright/.local-browsers exist...
  if (dirExists) {
    console.log('Playwright directory exists')

    // STEP: Check to make sure the browser binaries exist
    const sanityCheck = await checkIfDirHasBinaries(output)

    if (sanityCheck) {
      console.log(`Browser binaries for ${browsers} exist at: ${output}.`)

      // WORKAROUND
      // via https://github.com/bitwarden/desktop/issues/320#issuecomment-540775836
      // Manually sign all the browser binaries
      const signBinaries = async (dirPath) => {
        await runExec(`sudo xattr -cr ${dirPath}`)

        const allFiles = await rreaddir(path)
        console.log(allFiles)

        // Sign each thing
        await runExec(`codesign --force --deep --sign - ${dirPath}`)

        // Check to see if it worked
        await runExec(`codesign --verify --verbose ${dirPath}`)
      }

      // Firefox
      await signBinaries(`${input}/firefox-1221/firefox/Nightly.app`)
      await signBinaries(`${input}/webkit-1402/`)
      // await signBinaries(`${input}/firefox-1221/firefox/Nightly.app`)
      // await signBinaries(`${input}/webkit-1402/Playwright.app`)

      return true // Done
    } else {
      console.error(`Missing a browser binary! Found: ${dirExists}`)
      return false
    }
  } else {
    // if not, re-install Playwright
    // NOTE: This will end the execution of the code
    console.log(`.local-browsers directory not found at ${input}`)

    // Finish after the next script
    return false
  }
})()

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

// Get all the sub-directories and files, individually sign them
// https://gist.github.com/timoxley/0cb5053dec107499c8aabad8dfd651ea#file-1-rreaddir-js
async function rreaddir(dir, allFiles = []) {
  const files = (await fs.readdir(dir)).map((f) => path.join(dir, f))
  allFiles.push(...files)
  await Promise.all(
    files.map(
      async (f) => (await fs.stat(f)).isDirectory() && rreaddir(f, allFiles)
    )
  )
  return allFiles
}

// Find all files & folders at a path
// https://stackoverflow.com/a/59042581/1114901
async function ls(filePath) {
  try {
    const tempArr = []

    const dir = await fs.opendir(filePath) // Opens a stream https://nodejs.org/api/fs.html#fs_class_fs_dir

    for await (const dirent of dir) {
      // if (dirent.isDirectory) {
      //   // The entry is a Directory! Let's iterate through it!
      //   console.log(path.join(dir.path, dirent.name))
      //   await ls(path.join(dir.path, dirent.name)) // Pass in the path to the directory
      // }
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
