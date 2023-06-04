import { expect } from '@playwright/test'
import { test } from './_electron.fixture'

test.describe('App', () => {
  test.afterAll(async ({ electronApp }) => {
    await electronApp.close()
  })

  test('Is packaged', async ({ electronApp }) => {
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
      return app.isPackaged
    })

    expect(isPackaged).toBe(true)
  })

  test('App name', async ({ electronApp }) => {
    const appName = await electronApp.evaluate(async ({ app }) => {
      return app.name
    })

    expect(appName).toBe('Reflex')
  })
})
