import { Page, expect } from '@playwright/test'
import { test } from './_electron.fixture'

test.describe('SiteTree', () => {
    let appWindow: Page
  
    test.beforeEach(async ({ electronApp }) => {
      appWindow = await electronApp.firstWindow()
    })
  
    test('Can add a site', async ({ electronApp }) => {
      const trigger = appWindow.getByTestId('toggle-site-tree')
      const siteInput = appWindow.getByTestId('site-input')
      const siteTitle = appWindow.getByTestId('site-title')
  
      // Find the trigger
      await trigger.click()
  
      // Find the site input
      await siteInput.type('google.com')
      await siteInput.press('Enter')
  
      // Check the site title
      const siteTitleValue = await siteTitle.inputValue()
      expect(siteTitleValue).toBe('https://google.com')
    })
  })
  