import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { reactive } from '@vue/reactivity'

export type BrowserName = "chromium" | "chrome" | "chrome-beta" | "msedge" | "msedge-beta" | "msedge-dev" | "firefox" | "webkit";

const validBrowserNames: BrowserName[] = [
    "chromium",
    "chrome",
    "chrome-beta",
    "msedge",
    "msedge-beta",
    "msedge-dev",
    "firefox",
    "webkit",
];

interface BrowserList {
    name: BrowserName;
    path?: string;
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
    // const npx = /^win/.test(process.platform) ? 'npx.cmd' : 'npx';
    // const npxCommand = spawn(npx, [command, ...args], { env });
    const cliPath = path.join(__dirname, 'node_modules', 'playwright-core/lib/cli/cli.js');
    const env = Object.assign({}, process.env, { PLAYWRIGHT_BROWSERS_PATH: '0' });
    const npxCommand = spawn('node', [cliPath, command, ...args], { env });

    npxCommand.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    npxCommand.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    return new Promise<void>((resolve, reject) => {
        npxCommand.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`child process exited with code ${code}`));
            }
        });
    });
};


export const installBrowsers = async () => {
    const { installed, notInstalled } = await checkInstalledBrowsers();

    console.log('Installed browsers:', installed);
    console.log('Not installed browsers:', notInstalled);

    for (const browser of notInstalled) {
        await installPackage(browser);
    }
}

const checkInstalledBrowsers = async () => {
    const localBrowsersDir = path.join(process.cwd(), "node_modules/playwright-core/.local-browsers");
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