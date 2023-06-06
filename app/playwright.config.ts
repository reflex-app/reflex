import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: 'test/electron',
  workers: 5,
  retries: 0,
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    // baseURL: process.env.BASE_URL || 'http://localhost:8080',
    // storageState: 'test/storage-state.json',
  },
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { browserName: 'chromium' },
  //   },
  //   {
  //     name: 'firefox',
  //     use: { browserName: 'firefox' },
  //   },
  //   {
  //     name: 'webKit',
  //     use: { browserName: 'webkit' },
  //   },
  //   {
  //     name: 'mobile-chromium',
  //     use: devices['Pixel 5'],
  //   },
  //   {
  //     name: 'mobile-webkit',
  //     use: devices['iPhone 13'],
  //   },
  // ],
}

export default config
