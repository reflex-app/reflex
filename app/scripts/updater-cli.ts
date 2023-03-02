// import { fileURLToPath } from 'url'
import inquirer from 'inquirer'
import path from 'path'
import { execa, execaCommand } from 'execa'
import { version as packageVersion } from '../package.json'
import fs from 'fs/promises'
import cloneDeep from 'lodash/cloneDeep'

const pathToApp = path.resolve(__dirname, '../') // Path to the Electron app

const main = async () => {
  console.info(`Local app version is: ${packageVersion}`)
  // console.info('The last beta/alpha release is:') // TODO
  // console.info('The latest release version is:') // TODO

  // Initiate
  await inquireUpdateType()
}

// Immediately executed:
main()

async function execaAtRoot(shellString: string, args: any[], options?: {}) {
  return await execa(shellString, ...args, {
    cwd: pathToApp,
    // stdio: 'inherit', // Pipe out to main process
    shell: true,
    ...options,
  }).catch((err) => {
    console.error(err)
    return false
  })
}

async function execaCommandAtRoot(command: string, options?: {}) {
  return await execaCommand(command, {
    // stdio: 'inherit', // Pipe out to main process
    cwd: pathToApp,
    shell: true,
    ...options,
  }).catch((err) => {
    console.error(err)
    return false
  })
}

async function inquireUpdateType() {
  await inquirer
    .prompt({
      name: 'updateType',
      type: 'list',
      message: 'What kind of update is this?',
      choices: ['major', 'minor', 'patch', 'prerelease'],
      default: 'prerelease',
    })
    .then(async (answers) => {
      ////////////////////////////////
      // Check if the current package.json version
      // exists at Git origin
      // If it already exists at origin as a tag, we need to bump the version
      // If a tag DOES NOT exist for the current version, we won't bump the version; probably it is already new and should just be pushed
      // TODO: Check via Github API?

      ////////////////////////////////
      // Bump the version w/ Yarn CLI
      // Docs: https://yarnpkg.com/cli/version
      console.log(`Bumping ${answers.updateType}...`)

      // We have to manually remove the .stableVersion value that Yarn sets
      // so that bumping will take place
      // Bug: https://github.com/yarnpkg/berry/issues/4328#issue-1194658629
      await removeStableVersion()

      // Use Yarn to bump the version
      // --immediate: We will immediately bump the version in package.json, commit the change
      // and tag the version with Git
      await execaCommandAtRoot(`yarn version ${answers.updateType}`)

      // Check updated package.json version
      const updatedPackageVersion = await fs
        .readFile(path.resolve(pathToApp, 'package.json'), 'utf-8')
        .then((data) => {
          const { version } = JSON.parse(data)
          return version
        })

      // Version with "v" prefix
      // Example: v0.7.0
      const newVersion = 'v' + updatedPackageVersion

      // Ensure that the version has really been bumped
      const hasChanged = packageVersion !== updatedPackageVersion
      if (!hasChanged) {
        console.error(
          'Error: Version not bumped!',
          packageVersion,
          updatedPackageVersion
        )
        process.exit()
      }

      console.log(`Version bumped! to ${updatedPackageVersion}`)

      ////////////////////////////////
      // Get tags & create new tag

      // --prune: connect to remote repository and fetch all remote branch refs -> delete remote refs that are no longer in use on remote repository
      console.log(`Getting latest tags`)
      await execaCommandAtRoot('git fetch --tags --all --prune')

      // Get existing tags
      const { stdout: tags } = await execaCommandAtRoot('git tag --list')
      if (!tags) {
        console.error('No tags found!')
        return false
      }

      // Ask if user wants to replace existing tag
      if (tags.includes(newVersion)) {
        await inquirer
          .prompt({
            name: 'confirmDeleteTag',
            type: 'confirm',
            message: `⚠️ Do you want to replace the existing Git tag for ${newVersion}?`,
            default: false,
          })
          .then(async ({ confirmDeleteTag }) => {
            if (confirmDeleteTag === true) {
              await deleteGitTag(newVersion) // Remove existing tag
            } else {
              console.log(`${newVersion} tag not replaced. Exiting.`)
              process.exit() // Stop the script
            }
          })
      }

      // Git Commit
      await inquirer
        .prompt({
          name: 'confirmCommit',
          type: 'confirm',
          message: `⚠️ Ready to commit the package.json and Git tag the version?`,
          default: false,
        })
        .then(async ({ confirmCommit }) => {
          if (confirmCommit === true) {
            // Git commit the package.json with the commit named as the version
            // NOTE: This will trigger the CI build
            console.log(`Committing`)
            await execaCommandAtRoot(
              `git add package.json && git commit -m ${newVersion}`
            ).catch((err) => {
              console.error('custom err')
            })

            // Create Git tag
            console.log(`Tagging`)
            await execaCommandAtRoot(`git tag ${newVersion}`)
          } else {
            console.log(
              `${newVersion} not committed and tag not created. Exiting.`
            )
            process.exit() // Stop the script
          }
        })

      ////////////////////////////////

      // Are you sure?
      await inquirer
        .prompt({
          name: 'confirmUpdate',
          type: 'confirm',
          message: `Ready to push ${newVersion} to origin? This will also push any other other local commits, and a release build will start.`,
          default: false,
        })
        .then(async ({ confirmUpdate }) => {
          if (confirmUpdate === true) {
            // Push to remote
            console.log(`Pushing to remote`)
            await execaCommandAtRoot(
              `git push && git push origin ${newVersion}`
            ) // Push the commit & tag
          } else {
            console.log(
              'The tag and commits are done. You may push when ready.'
            )
          }
        })
    })
}

async function deleteGitTag(tagName) {
  await execaCommandAtRoot(`git push --delete origin ${tagName}`) // Remove existing tag on origin
  await execaCommandAtRoot(`git tag -d ${tagName}`) // Remove existing tag locally
}

async function removeStableVersion() {
  const packageJsonPath = path.resolve(pathToApp, 'package.json')

  const { default: currPackageJson } = await import(packageJsonPath, {
    assert: {
      type: 'json',
    },
  })
  const newPackageJson = cloneDeep(currPackageJson)

  // Remove the .stableVersion key
  delete newPackageJson.stableVersion

  // Write the file back
  // TODO: Add async
  await fs.writeFile(packageJsonPath, JSON.stringify(newPackageJson, null, 2))
}
