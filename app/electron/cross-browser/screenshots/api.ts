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

ipcMain.handle('cb-screenshot', async (event, id: Partial<CrossBrowserScreenshotOptions['contextId']>) => {
    return await takeScreenshot(id)
})


// ///////////////////////////////////////

export async function createInstance(options: Partial<CrossBrowserScreenshotOptions>) {
    const instance = new CrossBrowserScreenshot({
        url: options.url,
        browser: options.browser,
        height: options.height,
        width: options.width,
        x: options.x,
        y: options.y,
        isPackaged: app.isPackaged,
    })

    queue.push({ id: instance.contextId, self: instance, status: 'pending' })

    return instance
}

export async function removeInstance() { }

export async function takeScreenshot(contextId: Partial<CrossBrowserScreenshotOptions['contextId']>) {
    const instance = queue.find(i => i.id === contextId)
    if (!instance) {
        console.error('No instance found')
        return false
    }

    instance.status = 'running'

    const screenshot = await instance.self.takeScreenshot().catch(err => {
        instance.status = 'error'
        console.error(err)
    })

    instance.status = 'complete'

    return screenshot
}