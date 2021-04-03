# What is this?

Basically exposes the installation scripts of Playwright so that end-users in Electron apps may install the browser binaries as they wish.
https://github.com/microsoft/playwright/blob/master/install-from-github.js#L29

## Install (Local)

Add as a dependency, with a relative or file:// path in your package.json. The local package will be symlinked to `node_modules`. If a new version of the local package is set, that can be installed again.

```
{
  "name": "baz",
  "dependencies": {
    "bar": "file:../foo/bar"
  }
}
```

... or use `yarn add file:../foo/bar`

https://stackoverflow.com/a/14387210/1114901

To refresh the package dependency, run `yarn upgrade`

---

## Install (Production)

You can use this in your own Electron app by installing the repository itself. The main branch will be installed. [Learn more](https://dev.to/paul_melero/how-to-npm-install-from-github-repositories-or-gists-directly-6og).

Make sure to add a `GITHUB_TOKEN` to your environment or .env file.

```json
"dependencies": {
  "playwright-browser-installer": "git+https://${GITHUB_TOKEN}:x-oauth-basic@github.com/nwittwer/electron-playwright-browser-installer.git"
}

```

## Configuration

## Troubleshooting

1. Make sure you're importing correctly. https://stackoverflow.com/a/60893655/1114901

## How it works

1. We use `playwright` package to generate a current browsers.json file
2. We store the `browsers.json` file in this repo
3. This library exports functions which can be used at Node runtime, and will install the versions of browsers defined in `browsers.jon` to the `installPath` defined by the library user
4. The browsers are locally installed
