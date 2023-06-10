import { fork } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { reactive } from '@vue/reactivity'
import { RuntimeConfig } from '../config/index'
import isDev from 'electron-is-dev';
import { app } from 'electron';
import log from 'electron-log'

export type BrowserName = "chromium" | "chrome" | "chrome-beta" | "msedge" | "msedge-beta" | "msedge-dev" | "firefox" | "webkit";

interface BrowserList {
    name: BrowserName;
    path?: string;
}

// The root path to the app
const getNodeModulesPath = () => {
    const runtimeConfig = RuntimeConfig.getInstance();
    const rootPath = isDev ? runtimeConfig.dev.nodeModulesPath : runtimeConfig.packaged.nodeModulesPath;
    if (!rootPath) throw new Error('Node modules path not found');
    return rootPath;
}


// Shared reactive state
export const state = reactive({
    installed: [] as BrowserList[],
    notInstalled: [] as BrowserList[],
})

const addToList = (list: 'installed' | 'no-install', { name, path }: { name: BrowserName, path?: string }) => {
    if (list === 'installed') {
        state.installed.push({ name, path });
    } else if (list === 'no-install') {
        state.notInstalled.push({ name, path });
    }
}

export const installPackage = async (browser: BrowserName) => {
    console.log(`Installing ${browser}...`);
    return await playwrightCLI('install', [`${browser}`]);
};

const playwrightCLI = async (command: string, args: string[]) => {
    const cliPath = path.join(getNodeModulesPath(), 'playwright-core/lib/cli/cli.js');
    const env = Object.assign({}, process.env, { PLAYWRIGHT_BROWSERS_PATH: '0' });

    const npxCommand = fork(cliPath, [command, ...args], { env });

    // Close the child process when the Electron app closes
    app.on('before-quit', () => {
        npxCommand.kill();
    });

    npxCommand.on('message', (message) => {
        console.log('Message from child process:', message);
    });

    // Listen for logs from the child process
    npxCommand.stdout?.on('data', (data) => {
        console.log('Child process stdout:', data.toString());
    });

    npxCommand.stderr?.on('data', (data) => {
        console.error('Child process stderr:', data.toString());
    });

    return new Promise<void>((resolve, reject) => {
        npxCommand.on('exit', (code, signal) => {
            if (code !== null) {
                resolve();
            } else {
                reject(new Error(`child process exited with code ${code} ${signal}`));
            }
        })
    });
}


export const installBrowsers = async () => {
    const { installed, notInstalled } = await checkInstalledBrowsers();

    console.log('Installed browsers:', installed);
    console.log('Not installed browsers:', notInstalled);

    // Install all browsers that are not installed
    await Promise.all(notInstalled.map(browser => installPackage(browser.name).then(() => {
        log.info(`Successfully installed ${browser.name}`);
    }).catch((err) => {
        log.error(`Failed to install ${browser.name}. ${err}`);
    })));
}

const checkInstalledBrowsers = async () => {
    const localBrowsersDir = path.join(getNodeModulesPath(), "playwright-core/.local-browsers");
    const browserNames: BrowserName[] = ['firefox', 'webkit'];
    const browserExecutables = browserNames.map((browser: string) => {
        const name = browser as BrowserName;

        return {
            name,
            path: path.join(localBrowsersDir, browser)
        }
    });

    for (const executable of browserExecutables) {
        try {
            const files = await fs.readdir(localBrowsersDir);
            const browserFiles = files.filter(file => file.startsWith(executable.name));
            if (browserFiles.length > 0) {
                console.log(`Browser executable found: ${executable.name}`, browserFiles);

                // For each browser directory, check if it includes a INSTALLATION_COMPLETE file
                for (const browserFile of browserFiles) {
                    const installationCompletePath = path.join(localBrowsersDir, browserFile, 'INSTALLATION_COMPLETE');

                    await fs.access(installationCompletePath).then(() => {
                        addToList('installed', { name: executable.name, path: path.join(localBrowsersDir, browserFile) })
                    }).catch(() => {
                        addToList('no-install', { name: executable.name, path: path.join(localBrowsersDir, browserFile) })
                    });
                }
            } else {
                console.log(`Browser executable not found: ${executable.name}`);
                addToList('no-install', { name: executable.name })
            }
        } catch (error) {
            console.log(`Browser executable not found: ${executable.name}`);
            addToList('no-install', { name: executable.name })
        }
    }

    return { installed: state.installed, notInstalled: state.notInstalled };
};