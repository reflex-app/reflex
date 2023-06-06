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

## Configuration

### Install paths

By default, the browsers are installed to the following paths:

- `%USERPROFILE%\AppData\Local\ms-playwright` on Windows
- `~/Library/Caches/ms-playwright` on MacOS
- `~/.cache/ms-playwright` on Linux

This can be overridden using the `PLAYWRIGHT_BROWSERS_PATH` environment variable.

NOTE: We purposely avoid downloading Chromium, WebKit, and Firefox into `node_modules/playwright-core`. `playwright-core` is only used for some of its functions, but the browser install is handled through this package directly. It is a fork from `playwright-core`'s install methods.

## Troubleshooting

1. Make sure you're importing correctly. https://stackoverflow.com/a/60893655/1114901

## How it works

1. We use `playwright` package to generate a current browsers.json file
2. We store the `browsers.json` file in this repo
3. This library exports functions which can be used at Node runtime, and will install the versions of browsers defined in `browsers.jon` to the `installPath` defined by the library user
4. The browsers are locally installed
