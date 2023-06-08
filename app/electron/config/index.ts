// TODO: This has to be .js for now, because it is used by builder.config.js, which isn't configured for TypeScript and ESM

import isDev from 'electron-is-dev'
import path from 'path'

interface AppConfig {
    dev: {
        root: string
    }
    build: {
        isAsarPackaged: boolean
        packagedAppPath?: string
    }
}

export const app: AppConfig = {
    dev: {
        // Starts at ./dist-electron/../PATH-TO-THIS-FILE
        root: path.resolve(__dirname, '../../../')
    },
    build: {
        isAsarPackaged: true
    }
}

// if (process.resourcesPath) {
//     app.build.packagedAppPath = path.join(process.resourcesPath, `${app.build.isAsarPackaged ? 'app.asar.unpacked' : 'app'}`)
// }
