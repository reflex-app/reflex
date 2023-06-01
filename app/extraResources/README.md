1. We use Vite to convert `.ts` files to `.js`
2. Final files are moved to the `dist/extraResources` folder.
3. Electron-builder copies the `dist/extraResources` folder into the final app folder. See [here](https://www.electron.build/configuration/contents#extraresources) for more info.
4. The app loads the `preload` script from the `dist/extraResources` folder.
