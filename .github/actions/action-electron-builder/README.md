# Electron Builder Action

**GitHub Action for building and releasing Electron apps**

This is a GitHub Action for automatically building and releasing your Electron app using GitHub's CI/CD capabilities. It uses [`electron-builder`](https://github.com/electron-userland/electron-builder) to package your app and release it to a platform like GitHub Releases.

GitHub Actions allows you to build your app on macOS, Windows and Linux without needing direct access to each of these operating systems.

## Setup

1. **Install and configure `electron-builder`** (v22+) in your Electron app. You can read about this in [the project's docs](https://www.electron.build) or in [my blog post](https://samuelmeuli.com/blog/2019-04-07-packaging-and-publishing-an-electron-app).

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
           uses: samuelmeuli/action-electron-builder@v1
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

1. `cd app` (from the project root directory)
1. `yarn version {major/minor/patch/prerelease}` to bump the version in the package.json (e.g. `1.2.3`). See [Yarn docs](https://yarnpkg.com/cli/version/#usage).
1. Commit that change (`git commit -am v1.2.3`)
1. Tag your commit (`git tag v1.2.3`). Make sure your tag name's format is `v*.*.*`. Your workflow will use this tag to detect when to create a release
1. Push your changes to GitHub (`git push && git push --tags`)

After building successfully, the action will publish your release artifacts. By default, a new release draft will be created on GitHub with download links for your app. If you want to change this behavior, have a look at the [`electron-builder` docs](https://www.electron.build).

## Need to change the Release's Git Tag?

1. Remove the tag from Github (make sure to change the version): `git push origin :refs/tags/v0.7.0-beta.10`
1. Update your local Git tags: `git tag -d $(git tag)` and then `git fetch --tags` to pull from Github
1. Delete Github Release draft
1. Create the tag again i.e. `git tag v0.7.0-beta.10`
1. `git push --tags`

## Configuration

### Options

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

You can read [here](https://github.com/samuelmeuli/action-snapcraft) how you can obtain a `snapcraft_token`.

### Notarization

If you've configured `electron-builder` to notarize your Electron Mac app [as described in this guide](https://samuelmeuli.com/blog/2019-12-28-notarizing-your-electron-app), you can use the following steps to let GitHub Actions perform the notarization for you:

1.  Define the following secrets in your repository's settings on GitHub:

    - `api_key`: Content of the API key file (with the `p8` file extension)
    - `api_key_id`: Key ID found on App Store Connect
    - `api_key_issuer_id`: Issuer ID found on App Store Connect

2.  In your workflow file, add the following step before your `action-electron-builder` step:

    ```yml
    - name: Prepare for app notarization
      if: startsWith(matrix.os, 'macos')
      # Import Apple API key for app notarization on macOS
      run: |
        mkdir -p ~/private_keys/
        echo '${{ secrets.api_key }}' > ~/private_keys/AuthKey_${{ secrets.api_key_id }}.p8
    ```

3.  Pass the following environment variables to `action-electron-builder`:

    ```yml
    - name: Build/release Electron app
      uses: samuelmeuli/action-electron-builder@v1
      with:
        # ...
      env:
        # macOS notarization API key
        API_KEY_ID: ${{ secrets.api_key_id }}
        API_KEY_ISSUER_ID: ${{ secrets.api_key_issuer_id }}
    ```

## Credits

- [action-electron-nuxt](https://github.com/michalzaq12/action-electron-nuxt)
