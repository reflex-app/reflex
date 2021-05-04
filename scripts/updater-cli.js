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
      name: 'updateType',
      type: 'list',
      message: 'What kind of update is this?',
      choices: ['major', 'minor', 'patch', 'prerelease'],
      default: 'prerelease',
    })
    .then((answers) => {
      // Go to app directory
      shell.cd(pathToApp)

      // Bump version
      console.log(`Bumping ${answers.updateType}...`)
      shell.exec(`yarn version ${answers.updateType}`, { silent: true })

      // Get updated version
      const newVersion = 'v' + requireUncached(pkg).version

      // Git Commit
      console.log(`Committing`)
      shell.exec(`git add package.json && git commit -m ${newVersion}`)

      ////////////////////////////////
      // Git Tag

      console.log(`Tagging`)

      // Pull from latest tags
      shell.exec('git fetch --tags --all --prune')

      // Delete existing tag
      const deleteExistingTag = () => {
        const { stdout: tagExists } = shell.exec(`git tag`)
        if (tagExists) {
          shell.exec(`git tag -d ${newVersion}`)
        }
      }
      deleteExistingTag()

      // Create Git tag
      shell.exec(`git tag ${newVersion}`)

      ////////////////////////////////

      // Are you sure?
      inquirer
        .prompt({
          name: 'confirmUpdate',
          type: 'confirm',
          message: `Do you want to Git push ${newVersion} to origin? This will also push any other other local commits, and a release build will start.`,
          default: false,
        })
        .then(({ confirmUpdate }) => {
          if (confirmUpdate === true) {
            // Push to remote
            console.log(`Pushing to remote`)
            shell.exec(`git push && git push origin ${newVersion}`) // Push the commit & tag
          } else {
            console.log(
              'The tag and commits are done. You may push when ready.'
            )
          }
        })

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
