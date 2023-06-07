// import VueCompositionApi from '@/plugins/vueCompositionApi' // Workaround way to work with the Composition API in Vue 2
// import { test, expect } from '@playwright/test'
// import useCrossBrowserScreenshots from '@/components/CrossBrowser/Screenshots/UseCrossBrowserScreenshots'
// import { mount, shallowMount } from '@vue/test-utils'
import { Page, expect } from '@playwright/test'
import { test } from './_electron.fixture'

const useCrossBrowserScreenshots = () => {}

// Is the software able to reliably capture screenshots with Playwright?
test.describe('Cross-browser Screenshots', () => {
  let appWindow: Page

  test.beforeEach(async ({ electronApp }) => {
    appWindow = await electronApp.firstWindow()
  })

  test.skip('Environment variables are set', async ({ electronApp }) => {
    // TODO: Need to get the process.env from the main process, not from the Playwright test runner
    // This is required in order to get the correct path to the browsers
    // See: https://playwright.dev/docs/browsers#hermetic-install
    expect(process.env.PLAYWRIGHT_BROWSERS_PATH).toBe('0')
  })

  test.skip('A new instance should return an object', () => {
    const instance = useCrossBrowserScreenshots()

    // Receive an object back
    expect(typeof instance).toBe('object')
  })

  test.skip('Smoke test: Take screenshot on Firefox and Webkit', async () => {
    expect(1) // Wait for one Promise

    const instance = useCrossBrowserScreenshots()

    const params = {
      url: 'https://google.com',
      browsers: ['firefox', 'webkit'],
    }

    // Wait for it to return successfully
    await expect(
      instance.takeCrossBrowserScreenshot(params)
    ).resolves.toBeTruthy()
  }, 30000) // Allow this to take up to 30 seconds

  test.skip('Smoke test: Empty params', async () => {
    expect(1) // Wait for one Promise

    const instance = useCrossBrowserScreenshots()

    const params = {}

    // Wait for it to throw an error
    await expect(instance.takeCrossBrowserScreenshot(params)).rejects.toThrow()
  }, 15000)
})
