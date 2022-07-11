# Reflex App

[![Build Status](https://travis-ci.com/nwittwer/reflex.svg?branch=dev)](https://travis-ci.com/nwittwer/reflex)

## Developing

Requirements:

- Node
- Yarn (1.x)

Please note: The `dev` branch represents the latest works-in-progress, and should always be used for new development/pull requests. The `master` branch holds the latest public release code.

### Getting Started

1. Clone the project to your computer:

   ```sh
   $ git clone https://github.com/nwittwer/reflex.git
   $ cd reflex
   ```

2. Install dependencies:

   ```sh
   $ yarn install
   ```

3. Compile and watch for changes:
   ```sh
   $ yarn run dev
   ```

### Building

1. To compile an executable app, run the following command:

   ```sh
   $ yarn run build
   ```

   This will output several files inside of the `build/` folder. You can directly run the `.app` or `.exe` file inside of `build/`.

### Release

#### The new way

1. Run the command:
   ```bash
   yarn run release
   ```
1. The version will be bumped automatically in the package.json file, according to semantic versioning.
1. The Git tag for the version will be created or overwritten.
1. The new version and Git tag will be pushed to Github
1. Github Actions will be triggered, and a build for the release will be created
1. The new release will appear on Github as a draft release

#### The old way

1. Update the version in the project's package.json file (e.g. 1.2.3)
1. Commit that change (git commit -am v1.2.3)
1. Tag your commit (git tag v1.2.3). Make sure your tag name's format is v*.*.\*. Your workflow will use this tag to detect when to create a release
1. Push your changes to GitHub (git push && git push --tags)
1. Github Actions will run the build only for commits to `master` and `dev` branches
1. If the build is successful and a Github Release is in draft for the same version, the Github Action will notarize (Mac only) and upload the build artifacts to the Github Release directly.

https://github.com/samuelmeuli/action-electron-builder#releasing

Env vars required:

- CSC_LINK: base64-encoded .p12 file
- CSC_KEY_PASSWORD: optional password
- GH_TOKEN: Github token
- APPLEID: Apple ID
- APPLEIDPASS: App-specific password for Apple ID

### Debugging

`CMD/CTRL + Shift + I` will open the Chrome DevTools inside of the Electron instance.

#### Logs

See: https://github.com/megahertz/electron-log#readme

- on macOS: ~/Library/Logs/{app name}/{process type}.log
- on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
- on Linux: ~/.config/{app name}/logs/{process type}.log

---

### Technologies used

- [Nuxt.js](https://nuxtjs.org/)
- [electron-nuxt](https://github.com/michalzaq12/electron-nuxt)
- [Vue](https://vuejs.org/)
- [Electron](https://electronjs.org/)
