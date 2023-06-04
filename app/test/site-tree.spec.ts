import { test } from './_electron.fixture'
import { expect } from '@playwright/test'

// 1. Launch the Electron app.
// 2. Click the "Add Site" input
// 3. Type "https://www.google.com"
// 4. Press Enter
// 5. Expect the UI to show "https://www.google.com"

test('add site', async ({ page }) => {
  // // 2. Click the "Add Site" input
  // await page.click('input[placeholder="Add Site"]')
  // // 3. Type "https://www.google.com"
  // await page.type('input[placeholder="Add Site"]', 'https://www.google.com')
  // // 4. Press Enter
  // await page.press('input[placeholder="Add Site"]', 'Enter')
  // // 5. Expect the UI to show "https://www.google.com"
  // await expect(page).toHaveText('text=google.com')
})
