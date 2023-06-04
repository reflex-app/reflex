// import VueCompositionApi from '@/plugins/vueCompositionApi' // Workaround way to work with the Composition API in Vue 2
import { test, expect } from '@playwright/test'
// import useCrossBrowserScreenshots from '@/components/CrossBrowser/Screenshots/UseCrossBrowserScreenshots'
// import { mount, shallowMount } from '@vue/test-utils'

// Is the software able to reliably capture screenshots with Playwright?
test.describe.skip('Cross-browser Screenshots', () => {
  test('A new instance should return an object', () => {
    const instance = useCrossBrowserScreenshots()

    // Receive an object back
    expect(typeof instance).toBe('object')
  })

  test('Smoke test: Take screenshot on Firefox and Webkit', async () => {
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

  test('Smoke test: Empty params', async () => {
    expect(1) // Wait for one Promise

    const instance = useCrossBrowserScreenshots()

    const params = {}

    // Wait for it to throw an error
    await expect(instance.takeCrossBrowserScreenshot(params)).rejects.toThrow()
  }, 15000)
})
