const { promises: fs } = require('fs')
const path = require('path')
const { PROJECT_ROOT, RESOURCES_DIR } = require('../.electron-nuxt/config') // Import from Electron-Nuxt

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    entry.isDirectory()
      ? await copyDir(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath)
  }
}

;(async () => {
  try {
    // This will copy the .local-browsers binaries that Playwright installed for us
    // into the resources directory for the final app
    const input = `${PROJECT_ROOT}/node_modules/playwright/.local-browsers/`
    const output = `${RESOURCES_DIR}/.local-browsers/`

    // Copy the contents of the .local-browsers into the app's resources directory
    // https://stackoverflow.com/a/64255382/1114901
    await copyDir(input, output)

    // Expect to see a folder for chromium, firefox, and webkit
    // https://stackoverflow.com/a/59042581/1114901
    const ls = async (path) => {
      const tempArr = []

      const dir = await fs.opendir(path)
      for await (const dirent of dir) {
        // console.log(dirent.name)
        tempArr.push(dirent.name)
      }

      return tempArr // return all the files & directories at the output dir
    }

    // Get an array of files & directories in the resources path
    const dir = await ls(output)

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
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
