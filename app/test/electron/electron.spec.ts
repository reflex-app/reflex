import { Page, expect } from '@playwright/test'
import { test } from './_electron.fixture'
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
})