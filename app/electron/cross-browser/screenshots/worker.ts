// This all runs within a Web Worker
// ... but it's special because it has access to the Node modules because of Electron!
// We have access to the process.env
// We can use Node packages

import path from 'path'
import { v1 as uuid } from 'uuid'
import * as playwright from 'playwright-core'
import { BrowserName } from '../playwright-browser-manager'
import { state as BrowserInstalls } from '../playwright-browser-manager'
import { app } from 'electron/main'

export interface CrossBrowserScreenshotOptions {
    url: string
    browser?: BrowserName
    height?: number
    width?: number
    x?: number
    y?: number
    contextId: string
    isPackaged: boolean
    isLoading: boolean
}

export class CrossBrowserScreenshot {
    url = 'https://google.com';
    browser: 'webkit' | 'firefox' = 'webkit';
    height = 100;
    width = 100;
    x = 0;
    y = 0;
    isLoading = false;
    contextId = uuid();
    isPackaged = false; // Whether or not the app is packaged or in dev TODO Deprecate this and handle without needing Remote

    constructor(options: Partial<CrossBrowserScreenshotOptions> = {}) {
        Object.assign(this, options);
    }

    async takeScreenshot() {
        console.info(
            `Preparing to launch ${this.browser}, ${this.contextId}`,
            `Packaged? ${this.isPackaged}`
        )

        this.isLoading = true // Update loading state

        const browser = await playwright[this.browser].launch({
            /* headless: false */
            executablePath: getPlaywrightExecPath(this.isPackaged, this.browser), // Replace the path when packaged (ASAR)
        }).catch((err: unknown) => {
            console.error(err)
        })

        const context = await browser.newContext({
            ignoreHTTPSErrors: true,
            viewport: {
                height: this.height,
                width: this.width,
            },
            // If there's issues launching a self-signed version of a browser...
            // see: https://github.com/microsoft/playwright/issues/802#issuecomment-581585593
        }).catch((err: unknown) => {
            console.error(err)
        })

        try {
            console.log(`Loading ${this.browser}, ${this.contextId}`)

            const page = await context.newPage()
            await page.goto(this.url, {
                // waitUntil: 'networkidle',
            })

            console.log('x,y', [this.x, this.y])

            // Scroll up/down as needed
            await page.evaluate(`window.scrollTo(${this.x}, ${this.y})`)

            // Wait...
            await page.waitForTimeout(1000)

            const screenshot = await page.screenshot({
                //   clip: {
                //     x: 0,
                //     y: 0,
                //     height: this.height,
                //     width: this.width,
                //   },
            })
            const screenshotBuffer = screenshot.toString('base64')

            await browser.close()
            return screenshotBuffer
        } catch (err) {
            this.isLoading = false
            await browser.close()
            console.log(err)
            return false
        }
    }
}

// Amend the Playwright executable path when run locally and packaged
// It does not actually get installed at playwright-core
// via https://github.com/puppeteer/puppeteer/issues/2134#issuecomment-408221446
function getPlaywrightExecPath(isPackaged = false, browser: BrowserName) {
    if (!browser) {
        console.error('No browser name given.')
        return
    }

    // Check if the browser is installed
    const browserIsInstalled = BrowserInstalls.installed.some((b) => b.name === browser)
    if (!browserIsInstalled) {
        console.error('Browser is not installed.')
        return
    }

    if (app.isPackaged) {
        // TODO: Ensure this is accurate
        return playwright[browser].executablePath()
        // overridePlaywrightPath()
    } else {
        // In development, we don't need to do anything
        return playwright[browser].executablePath()
    }

    ///////////////////////////
    ///////////////////////////
    ///////////////////////////

    function overridePlaywrightPath() {
        const envReplacements = {
            'app.asar/dist-electron/_nuxt/':
                'app.asar.unpacked/node_modules/reflex-browser-installer/dist/'
        }

        // // Generate the correct paths
        const initialPath = playwright[browser].executablePath()
        const updatedPath = replaceAll(initialPath, envReplacements)
        console.log({ initialPath, updatedPath });
    }

    function replaceAll(str: string, mapObj: {}) {
        const strToReplace = new RegExp(Object.keys(mapObj).join('|'))
        return str.replace(strToReplace, (matched) =>
            path.normalize(mapObj[matched.toLowerCase()])
        )
    }

    // if (!browser) console.error('No browser name given.')

    // function replaceAll(str, mapObj) {
    //     const strToReplace = new RegExp(Object.keys(mapObj).join('|'))
    //     return str.replace(strToReplace, (matched) =>
    //         path.normalize(mapObj[matched.toLowerCase()])
    //     )
    // }

    // // Replace based on environment
    // // When packaged, the app path gets packaged in ASAR and is unpacked
    // // Packaged example: /Users/Jon/Sites/reflex/build/mac/Reflex.app/Contents/Resources/app.asar/dist/renderer/_nuxt/.local-browsers/webkit-1402/pw_run.sh
    // const envReplacements = isPackaged
    //     ? {
    //         'app.asar/dist/renderer/_nuxt/':
    //             'app.asar.unpacked/node_modules/reflex-browser-installer/dist/',
    //     }
    //     : {
    //         '': ''
    //         // 'playwright-core': 'reflex-browser-installer/dist',
    //         // 'playwright-core': 'node_modules/playwright-core',
    //     }

    // // Generate the correct paths
    // const initialPath = playwright[browser].executablePath()
    // const updatedPath = replaceAll(initialPath, envReplacements)
    // console.log({ initialPath, updatedPath });

    // initialPath === updatedPath
    //     ? console.error(
    //         `Exec. path was NOT changed: ${updatedPath}. Env: ${process.env.PLAYWRIGHT_BROWSERS_PATH}`
    //     )
    //     : console.info('Exec. path changed', { initialPath, updatedPath })

    // return updatedPath
}
