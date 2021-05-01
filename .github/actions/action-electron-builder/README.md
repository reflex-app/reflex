# Electron Builder Action

**GitHub Action for building and releasing Electron apps**

This is a GitHub Action for automatically building and releasing your Electron app using GitHub's CI/CD capabilities. It uses [`electron-builder`](https://github.com/electron-userland/electron-builder) to package your app and release it to a platform like GitHub Releases.

GitHub Actions allows you to build your app on macOS, Windows and Linux without needing direct access to each of these operating systems.

## Setup

1. **Install and configure `electron-builder`** (v22+) in your Electron app

2. If you need to compile code (e.g. TypeScript to JavaScript or Sass to CSS), make sure this is done using a **`build` script in your `package.json` file**. The action will execute that script before packaging your app. However, **make sure that the `build` script does _not_ run `electron-builder`**, as this action will do that for you.

3. **Add a workflow file** to your project (e.g. `.github/workflows/build.yml`):

   ```yml
   name: Build/release

   on: push

   jobs:
     release:
       runs-on: ${{ matrix.os }}

       strategy:
         matrix:
           os: [macos-latest, ubuntu-latest, windows-latest]

       steps:
         - name: Check out Git repository
           uses: actions/checkout@v1

         - name: Install Node.js, NPM and Yarn
           uses: actions/setup-node@v1
           with:
             node-version: 10

         - name: Build/release Electron app
           uses: ./.github/actions/action-electron-builder
           with:
             # GitHub token, automatically provided to the action
             # (No need to define this secret in the repo settings)
             github_token: ${{ secrets.github_token }}

             # If the commit is tagged with a version (e.g. "v1.0.0"),
             # release the app after building
             release: ${{ startsWith(github.ref, 'refs/tags/v') }}
   ```

## Usage

### Building

Using this the workflow above, GitHub will build your app every time you push a commit.

### Releasing

When you want to create a new release, follow these steps:

1. Update the version in your project's `package.json` file (e.g. `1.2.3`)
2. Commit that change (`git commit -am v1.2.3`)
3. Tag your commit (`git tag v1.2.3`). Make sure your tag name's format is `v*.*.*`. Your workflow will use this tag to detect when to create a release
4. Push your changes to GitHub (`git push && git push --tags`)

After building successfully, the action will publish your release artifacts. By default, a new release draft will be created on GitHub with download links for your app. If you want to change this behavior, have a look at the [`electron-builder` docs](https://www.electron.build).

## Configuration

### Options

You can configure the action further with the following options:

- `package_root`: Directory where NPM/Yarn commands should be run (default: `"."`)
- `build_script_name`: Name of the optional NPM build script which is executed before `electron-builder` (default: `"build"`)
- `skip_build`: Whether the action should execute the NPM build script before running `electron-builder`
- `use_vue_cli`: Whether to run `electron-builder` using the [Vue CLI plugin](https://nklayman.github.io/vue-cli-plugin-electron-builder) instead of calling the command directly
- `args`: Other arguments to pass to the `electron-builder` command, e.g. configuration overrides (default: `""`)
- `max_attempts`: Maximum number of attempts for completing the build and release step

See [`action.yml`](./action.yml) for a list of all possible input variables.

### Code Signing

If you are building for **macOS**, you'll want your code to be [signed](https://samuelmeuli.com/blog/2019-04-07-packaging-and-publishing-an-electron-app/#code-signing). GitHub Actions therefore needs access to your code signing certificates:

- Open the Keychain Access app or the Apple Developer Portal. Export all certificates related to your app into a _single_ file (e.g. `certs.p12`) and set a strong password
- Base64-encode your certificates using the following command: `base64 -i certs.p12 -o encoded.txt`
- In your project's GitHub repository, go to Settings → Secrets and add the following two variables:
  - `mac_certs`: Your encoded certificates, i.e. the content of the `encoded.txt` file you created before
  - `mac_certs_password`: The password you set when exporting the certificates

Add the following options to your workflow's existing `action-electron-builder` step:

```yml
- name: Build/release Electron app
  uses: samuelmeuli/action-electron-builder@v1
  with:
    # ...
    mac_certs: ${{ secrets.mac_certs }}
    mac_certs_password: ${{ secrets.mac_certs_password }}
```

The same goes for **Windows** code signing (`windows_certs` and `windows_certs_password` secrets).

### Notarization

- https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
- https://samuelmeuli.com/blog/2019-12-28-notarizing-your-electron-app

## Development of this Github Action

### Locally testing Github Action

This will make it slightly easier to avoid bugs at the Github Actions-level. But you'll need to install a few things and download ~7GB worth of virtual environments.

IMPORTANT: `macos-latest` and `windows-latest` are not supported in `act` at this time. See [#97](https://github.com/nektos/act/issues/97). As a workaround, you can use Ubuntu. The available virtual environments are listed [here](https://github.com/nektos/act#runners) (see "Github Runner" column).

There's an example project for act here: https://github.com/cplee/github-actions-demo

Requirements:

- Docker

  1. Install [Docker](https://docs.docker.com/get-docker/) if you don't have it already. This is required to use the next step's tool, `act`.

  1. Make sure Docker is running on your computer

Getting started:

1. Install [act](https://github.com/nektos/act) CLI for locally testing the Github Action. See [Installation](https://github.com/nektos/act#installation) instructions for your OS.
1. Run `act` from the root of this project to do the initial run.

   - IMPORTANT: You will get an error if you do not run it from the root of the project, because it will be expending to find a ".github/workflows" directory structure.

1. Choose the Runner you'd like to use. I use the "medium" one. Compare them [here](https://github.com/nektos/act#runners).

1. Do your first run, which will also install any necessary virtual environments. `act --verbose`.

   - If you use `ubuntu-latest` for example, it will download the ~7GB Docker image.

1. Run `act` commands from the root of this project: `$ act [<event>][options]`

IMPORTANT: `macos-latest` and `windows-latest` are not supported in `act` at this time. See [#97](https://github.com/nektos/act/issues/97). As a workaround, you can define an alternative OS, like Ubuntu, like so: `-P macos-latest=nektos/act-environments-ubuntu:act-latest`.

Example: Trigger `pull_request` event

```
$ act pull_request
```

## Credits

- [action-electron-nuxt](https://github.com/michalzaq12/action-electron-nuxt)
