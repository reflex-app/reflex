import { fileURLToPath } from 'url'
import inquirer from 'inquirer'
import path from 'path'
import { execa, execaCommand } from 'execa'
import { version as packageVersion } from '../package.json'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const initialPath = path.resolve(__dirname)
const pathToApp = path.resolve(__dirname, '../') // Absolute path

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
  const { stdout } = await execa(shellString, ...args, {
    ...options,
    cwd: pathToApp,
  }).catch((err) => {
    console.error(err)
  })

  return {
    stdout,
  }
}

async function execaCommandAtRoot(command: string, options?: {}) {
  return await execaCommand(command, options)
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
      // answers.updateType

      // CD to app directory
      // shell.cd(pathToApp)

      ////////////////////////////////
      // Check if the current package.json version
      // exists at Git origin
      // If it already exists at origin as a tag, we need to bump the version
      // If a tag DOES NOT exist for the current version, we won't bump the version; probably it is already new and should just be pushed
      // TODO: Check via Github API?

      ////////////////////////////////
      // Bump the version
      try {
        console.log(`Bumping ${answers.updateType}...`)
        await execaAtRoot('yarn', ['version ${answers.updateType}'])
        console.log('Version bumped!')
      } catch (err) {
        // Handle cases where Yarn version plugin is not installed: "yarn plugin import version"
        console.error(err)
      }

      // package.json version will be changed by Yarn
      // Get updated version
      const newVersion = 'v' + packageVersion

      // Pull from latest tags
      console.log(`Getting latest tags`)
      await execaAtRoot('git', ['fetch --tags --all --prune'])

      // Check if existing tag

      const tags = await execaAtRoot('git', ['tag --list']).catch((err) =>
        console.error(err)
      )

      // Git Commit
      console.log(`Committing`)
      await execaCommandAtRoot(
        `git add package.json && git commit -m ${newVersion}`
      )

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
              console.log(`${newVersion} tag not replaced`)
              process.exit() // Stop the script
            }
          })
      }

      // Create Git tag
      console.log(`Tagging`)
      await execaCommandAtRoot(`git tag ${newVersion}`)

      ////////////////////////////////

      // Are you sure?
      await inquirer
        .prompt({
          name: 'confirmUpdate',
          type: 'confirm',
          message: `Do you want to Git push ${newVersion} to origin? This will also push any other other local commits, and a release build will start.`,
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

      // Return too root
      // shell.cd(initialPath)
    })
}

async function deleteGitTag(tagName) {
  await execaCommandAtRoot(`git push --delete origin ${tagName}`) // Remove existing tag on origin
  await execaCommandAtRoot(`git tag -d ${tagName}`) // Remove existing tag locally
}
