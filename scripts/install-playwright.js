const { promises: fs } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { PROJECT_ROOT, RESOURCES_DIR } = require('../.electron-nuxt/config') // Import from Electron-Nuxt

;(async () => {
  // This will copy the .local-browsers binaries that Playwright installed for us
  // into the resources directory for the final app
  const input = `${PROJECT_ROOT}/node_modules/playwright/.local-browsers/`
  const output = `${RESOURCES_DIR}/.local-browsers/`

  // Check if is installed
  const isInstalled = await ls(input).catch((err) => {
    if (err.code === 'ENOENT') {
      console.log('Missing', err)
      return false
    }
    errorHandler(err)
  })

  try {
    // Check if Playwright's .local-browsers exist...
    if (isInstalled) {
      console.log('Playwright is correctly installed')
    } else {
      // if not, re-install Playwright
      console.log('.local-browsers not found in Playwright. Re-installing.')

      // Install
      await installPlaywright().catch((err) => {
        errorHandler(err)
        process.exit(1)
      })
    }
  } catch (err) {
    if (err.code === 'ENOENT') return false
    errorHandler(err)
    process.exit(1)
  }

  // Copy the contents of node_modules/playwright/.local-browsers into the app's resources directory
  // https://stackoverflow.com/a/64255382/1114901
  await copyDir(input, output).catch(errorHandler)

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
})()

function installPlaywright() {
  return new Promise((resolve, reject) => {
    console.log('Installing Playwright... (this may take a while)')

    const child = exec(
      `npx cross-env PLAYWRIGHT_BROWSERS_PATH=0 yarn add playwright -S`
    )

    // Log the process
    child.stdout.pipe(process.stdout)

    child.on('error', function (err) {
      reject(new Error(err))
      errorHandler(err)
    })

    child.on('exit', function () {
      resolve(true)
      process.exit(1)
    })
  })
}

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      entry.isDirectory()
        ? await copyDir(srcPath, destPath)
        : await fs.copyFile(srcPath, destPath)
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
    console.log(err)
    // errorHandler(err)
    return false
  }
}

function errorHandler(err) {
  console.error(new Error(err))
  // process.exit(1)
}
