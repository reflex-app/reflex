import { Page, expect } from '@playwright/test'
import { test } from './_electron.fixture'
import { Dirent, PathLike } from "fs"
import fs from 'fs/promises'
import path from 'path'
import builderConfig from '../../builder.config'
import pkgJson from '../../package.json'

test.describe('App', () => {
  let appWindow: Page

  test.beforeEach(async ({ electronApp }) => {
    appWindow = await electronApp.firstWindow()
  })

  test('Is packaged', async ({ electronApp }) => {
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
      return app.isPackaged
    })

    expect(isPackaged).toBe(true)
  })

  test('App name is Reflex', async ({ electronApp }) => {
    const appName = await electronApp.evaluate(async ({ app }) => {
      return app.name
    })

    expect(appName).toBe('Reflex')
  })

  test('All asarUnpack node_modules are installed as dependencies', async ({ electronApp }) => {
    // Need to ensure that all node_modules are installed as dependencies, not devDependencies
    if (builderConfig.asar) {
      for (const item of builderConfig.asarUnpack) {
        if (!item.includes('node_modules/')) continue

        // Split just the text after node_modules/
        const moduleName = item.split('node_modules/')[1]

        // Check if the module is installed as a dependency
        Object.keys(pkgJson.dependencies).includes(moduleName)

        // Ensure it exists
        const modulePath = path.join(electronApp.appFilesPath, 'node_modules', moduleName)
        await expect(fs.access(modulePath)).resolves.toBeUndefined()
      }
    } else {
      console.warn('Skipping test because asar is disabled')
    }
  })

  test('Playwright is packaged correctly', async ({ electronApp }) => {
    const localBrowsersPath = path.join(electronApp.appFilesPath, 'node_modules/playwright-core/.local-browsers')

    // .local-browsers directory should not exist yet
    await expect(fs.access(localBrowsersPath)).rejects.toThrow();
  })

  test('inject.js is correctly packaged', async ({ electronApp }) => {
    // Check if inject.js exists
    // It is used for interactions between <WebView> and the main/renderer processes
    const playwrightModulePath = path.join(electronApp.appFilesPath, 'dist-electron/extraResources/inject.js')
    await expect(fs.access(playwrightModulePath)).resolves.toBeUndefined()
  })

  test('App size is below 500mb', async ({ electronApp }) => {
    const dirSize = async (dir: string): Promise<number> => {
      const files: Dirent[] = await fs.readdir(dir, { withFileTypes: true });

      const paths = files.map(async (file: Dirent) => {
        const p: string = path.join(dir, file.name);

        if (file.isDirectory()) return await dirSize(p);

        if (file.isFile()) {
          const { size } = await fs.stat(p);
          return size;
        }

        return 0;
      });

      return (await Promise.all(paths)).flat(Infinity).reduce((i: number, size: string | number) => (i + Number(size)), 0)
    }

    const appSizeInMB: number = await dirSize(electronApp.appDirPath).then((size: number) => parseFloat((size / 1000 / 1000).toFixed(1)))
    const appSizeAsNumber: number = Math.ceil(appSizeInMB)
    console.log('App:', electronApp.appDirPath, `${appSizeInMB}MB`, appSizeAsNumber)

    expect(appSizeAsNumber).toBeLessThan(500)
  });
})