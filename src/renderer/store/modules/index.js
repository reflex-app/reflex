/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

if (typeof require.context === 'undefined') {
  const fs = require('fs')
  const path = require('path')

  require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
    const files = {}

    function readDirectory(directory) {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.resolve(directory, file)

        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) readDirectory(fullPath)

          return
        }

        if (!regularExpression.test(fullPath)) return

        files[fullPath] = true
      })
    }

    readDirectory(path.resolve(__dirname, base))

    function Module(file) {
      return require(file)
    }

    Module.keys = () => Object.keys(files)

    return Module
  }
}

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
