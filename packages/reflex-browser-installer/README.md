# What is this?

Basically exposes the installation scripts of Playwright so that end-users in Electron apps may install the browser binaries as they wish.
https://github.com/microsoft/playwright/blob/master/install-from-github.js#L29

NOTE: We purposely avoid downloading Chromium, WebKit, and Firefox into `node_modules/playwright-core`. `playwright-core` is only used for some of its functions, but the browser install is handled through this package directly. It is a fork from `playwright-core`'s install methods.

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

## Troubleshooting

1. Make sure you're importing correctly. https://stackoverflow.com/a/60893655/1114901
