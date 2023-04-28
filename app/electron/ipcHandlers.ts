import { ipcMain } from 'electron'
import { getPackageJson } from './util'

export function init() {
  ipcMain.handle('get-app-name', async () => {
    return await getPackageJson().then((data) => data.productName)
  })
}
