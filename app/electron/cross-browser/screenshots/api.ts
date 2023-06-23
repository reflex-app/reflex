import { app } from 'electron/main'
import { CrossBrowserScreenshot, CrossBrowserScreenshotOptions } from './worker'
import { ipcMain } from 'electron'

let isEnabled = false

export default function enable() {
    isEnabled = !isEnabled
}

interface QueueItem {
    id: string
    self: CrossBrowserScreenshot
    status: 'pending' | 'running' | 'complete' | 'error'
}

let queue: QueueItem[] = []

// ///////////////////////////////////////

// IPC API

ipcMain.handle('cb-instance', async (event, options: Partial<CrossBrowserScreenshotOptions>) => {
    return await createInstance(options)
})

ipcMain.handle('cb-screenshot', async (event, id: Partial<CrossBrowserScreenshotOptions['contextId']>, options) => {
    return await takeScreenshot(id, options)
})


// ///////////////////////////////////////

export async function createInstance(options: Partial<CrossBrowserScreenshotOptions>) {
    const instance = new CrossBrowserScreenshot({
        url: options.url,
        browser: options.browser,
        isPackaged: app.isPackaged,
    })

    queue.push({ id: instance.contextId, self: instance, status: 'pending' })

    return instance
}

export async function removeInstance() { }

export interface ScreenshotOptions {
    browser: CrossBrowserScreenshotOptions['browser'][]
    url: CrossBrowserScreenshotOptions['url']
    x: CrossBrowserScreenshotOptions['x']
    y: CrossBrowserScreenshotOptions['y']
    height: CrossBrowserScreenshotOptions['height']
    width: CrossBrowserScreenshotOptions['width']
}

interface TakeScreenshotOptions {
    contextId: Partial<CrossBrowserScreenshotOptions['contextId']>
    options: ScreenshotOptions
}

export async function takeScreenshot({ contextId, options }: TakeScreenshotOptions) {
    const instance = queue.find(i => i.id === contextId)
    if (!instance) {
        console.error('No instance found')
        return false
    }

    // Update the instance with the options values
    for (const option in options) {
        if (Object.prototype.hasOwnProperty.call(options, option)) {
            console.log('should change', option, options[option as keyof ScreenshotOptions])
            instance.self[option as keyof CrossBrowserScreenshotOptions] = options[option as keyof ScreenshotOptions] as never;
        }
    }

    instance.status = 'running'

    const screenshot = await instance.self.takeScreenshot().catch(err => {
        instance.status = 'error'
        console.error(err)
    })

    instance.status = 'complete'

    return screenshot
}