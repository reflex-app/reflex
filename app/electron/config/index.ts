// TODO: This has to be .js for now, because it is used by builder.config.js, which isn't configured for TypeScript and ESM
import path from 'path'
import electron, { BrowserWindow, app } from 'electron'
import log from 'electron-log'
import isDev from 'electron-is-dev'

interface IDevConfig {
    appFilesPath: string | null; // Path to the app files
    nodeModulesPath: string | null;
}

interface IPackagedConfig {
    appFilesPath: string | null; // Path to the app files
    isAsarPackaged: boolean; // Whether the app is packaged as an asar file
    nodeModulesPath: string | null;
}

interface IRuntimeConfig {
    window: BrowserWindow | null;
    dev: IDevConfig;
    packaged: IPackagedConfig;
    init: (browserWindow: BrowserWindow) => Promise<void>;
}

export class RuntimeConfig implements IRuntimeConfig {
    window: BrowserWindow | null;
    dev: IDevConfig;
    packaged: IPackagedConfig;

    // Make the instance field private and static
    private static instance: RuntimeConfig | null = null;

    constructor() {
        this.window = null
        this.dev = {
            appFilesPath: null,
            nodeModulesPath: null
        }
        this.packaged = {
            appFilesPath: null,
            isAsarPackaged: false,
            nodeModulesPath: null
        }
    }

    // Init
    async init(browserWindow: BrowserWindow) {
        // Set the reference to the app's window
        this.window = browserWindow

        // TODO: Shouldn't have to ts-ignore this
        // but at import time, we're loading in the .js file which gets moved to /dist-electron
        // e.g. /Users/.../reflex/app/dist-electron/builder.config.js
        // @ts-ignore
        // builderConfig = import('../../../builder.config.js')

        const getBuilderConfig = async (pathToApp): Promise<typeof import('@/builder.config').default> => {
            let configPath;

            if (isDev) {
                configPath = 'builder.config.js';
            } else if (app.isPackaged) {
                configPath = 'dist-electron/builder.config.js';
            }

            if (!configPath) {
                throw new Error("Cannot determine builder config path");
            }

            const module = await import(path.join(pathToApp, configPath));

            log.info(`Loaded builder config from ${path.resolve(configPath)}`);

            if (module && module.default) {
                return module.default.default;
            } else {
                throw new Error(`Failed to import config from ${configPath}`);
            }
        }

        // Path to the app
        // Dev: ./
        // Packaged: /Applications/Reflex.app/Contents/Resources/app.asar
        const appPath = app.getAppPath()

        // const resourcesPath = path.join(path.dirname(appPath), 'resources')
        const resourcesPath = isDev ? path.join(path.dirname(appPath), 'resources') : process.resourcesPath

        this.dev.appFilesPath = path.join(appPath, 'dist-electron')
        // TODO: Avoid hard-coding "app.asar.unpacked"
        const builderConfig = await getBuilderConfig(isDev ? this.dev.appFilesPath : path.join(resourcesPath, 'app.asar.unpacked')); // Import the builder.config.js file
        this.packaged.appFilesPath = path.join(resourcesPath, `${builderConfig.asar ? 'app.asar.unpacked' : 'app'}`)


        // Path to node_modules
        this.dev.nodeModulesPath = path.join(this.dev.appFilesPath, '../', 'node_modules')
        this.packaged.nodeModulesPath = path.join(this.packaged.appFilesPath, 'node_modules')

        log.info('RuntimeConfig initialized', RuntimeConfig.instance !== null)
    }

    // A method to get an instance of RuntimeConfig
    public static getInstance(): RuntimeConfig {
        if (!RuntimeConfig.instance) {
            RuntimeConfig.instance = new RuntimeConfig()
        }

        return RuntimeConfig.instance as RuntimeConfig;
    }
}
