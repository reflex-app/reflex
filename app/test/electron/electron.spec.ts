import { Page, expect } from '@playwright/test'
import { test } from './_electron.fixture'
import { Dirent, PathLike } from "fs"
import fs from 'fs/promises'
import path from 'path'

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

  test('Playwright is packaged correctly', async ({ electronApp }) => {
    // Check if node_modules/playwright-core exists
    // It is required for cross-browser screenshots
    const playwrightModulePath = path.join(electronApp.appFilesPath, 'node_modules/playwright-core')
    const localBrowsersPath = path.join(playwrightModulePath, '.local-browsers')

    // node_modules/playwright-core should exist
    await expect(fs.access(playwrightModulePath)).resolves.toBeUndefined()

    // .local-browsers directory should not exist yet
    await expect(fs.access(localBrowsersPath)).rejects.toThrow();
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