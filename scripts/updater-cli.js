const inquirer = require('inquirer')
const path = require('path')
const shell = require('shelljs')

const initialPath = path.resolve(__dirname)

function main() {
  // TODO Add other packages which need to be versioned
  updateApp()
}

function updateApp() {
  const pathToApp = path.resolve(__dirname, '../app') // Absolute path
  const pkg = path.join(pathToApp, 'package.json')

  console.info(`Local app version is: ${requireUncached(pkg).version}`)
  // console.info('The last beta/alpha release is:') // TODO
  // console.info('The latest release version is:') // TODO

  inquirer
    .prompt({
      type: 'list',
      name: 'updateType',
      message: 'What kind of update is this?',
      choices: ['major', 'minor', 'patch', 'prerelease'],
      default: 'prerelease',
    })
    .then((answers) => {
      // Go to app directory
      shell.cd(pathToApp)

      // Bump version
      console.log(`Updating ${answers.updateType}...`)
      shell.exec(`yarn version ${answers.updateType}`, { silent: true })

      // Get updated version
      const newVersion = requireUncached(pkg).version

      // Git Commit
      console.log(`Committing`)
      shell.exec(`git commit -am v${newVersion}`)

      // Git Tag
      console.log(`Tagging`)
      shell.exec(`git tag v${newVersion}`)

      // Return too root
      shell.cd(initialPath)
    })
}

// Start
main()

// UTILITY
function requireUncached(module) {
  delete require.cache[require.resolve(module)]
  return require(module)
}
