<div >
    <h3 align="center">Reflex</h3>
    <p align="center">Make responsive websites without the guesswork.</p>
</div>

![Reflex Screenshot](screenshot.png)

Reflex is a free, open-source Mac app that makes it easy to see how responsive websites look at different screen sizes. Made for people who are tired of manually resizing their browser.

---

## Download

**[Download latest version (MacOS)](https://github.com/nwittwer/Reflex/releases/latest)**

[Having issues installing?](#faq)

---

### Features:
- Preview your website across as many sizes as you want
- Screenshot individual screens or all at once
- Synchronized interactions (scrolling, clicks, form inputs)
- Chromium DevTools built-in

Check out our [upcoming features](../../projects) and [feature requests](../../issues&q=label%3Afeature-request). If you have an idea that you didn't see it in either of those places, you can [create a new issue](../../issues) for it!

---

## Contributing

This project is made possible by open-source contributors: [View Contributors](../../graphs/contributors)

If you would like to add to the project, take a look at the [planned projects page](../../projects) and the [open issues](../../issues). Pull requests, bug reports and feature requests are welcome!

---

## Developing

[![Build Status](https://travis-ci.com/nwittwer/reflex.svg?branch=dev)](https://travis-ci.com/nwittwer/reflex)

Requirements:
- Node
- Yarn (1.x)

Please note: The `dev` branch represents the latest works-in-progress, and should always be used for new development/pull requests. The `master` branch holds the latest public release code.

### Getting Started

1. Clone the project to your computer:
    ```sh
    $ git clone https://github.com/nwittwer/reflex.git
    $ cd reflex
    ```

2. Install dependencies:
    ```sh
    $ yarn install
    ```

3. Compile and watch for changes:
    ```sh
    $ yarn run dev
    ```

### Building

1. To compile an executable app, run the following command: 
    ```sh
    $ yarn run build
    ```

    This will output several files inside of the `build/` folder. You can directly run the `.app` or `.exe` file inside of `build/`.

### Release

Workflow: PR to `master` branch -> TravisCI -> Build app -> Codesign & Notarize (Mac only) -> Github Release

1. Create a PR to `master` branch
    - TravisCI will run `yarn run release`
    - This adds a `process.env.RELEASE` env variable. 
    - The presence of the `RELEASE` flag will allow notarization of the Mac app with `scripts/notarize.js`.
    - The presence of the `RELEASE` flag will publish artifacts to Github. It will draft new release or update existing artifacts.
2. If everything worked, merge PR into `master` and publish Github Release

Env vars required:
- CSC_LINK: base64-encoded .p12 file
- CSC_KEY_PASSWORD: optional password
- GH_TOKEN: Github token
- APPLEID: Apple ID
- APPLEIDPASS: App-specific password for Apple ID

### Debugging

`CMD/CTRL + Shift + I` will open the Chrome DevTools inside of the Electron instance.

### Technologies used

- [Vue 2.x](https://vuejs.org/)
- [Electron](https://electronjs.org/)
- [BrowserSync](https://www.browsersync.io/)

---

## FAQ

1. Help installing for MacOS
    1. Download from the [Releases](../../releases) page 
    2. Move the Application to your Applications folder
    3. Open the application by double-clicking the icon
    4. If asked if you would like to open the application that was downloaded from the Internet, confirm. This is a standard MacOS security feature.

2. Does Shift work on Windows OS?
At the moment, only the Mac version is being supported/tested, as it requires a large amount of effort to add another OS to support. With more help, most or all of this project could work on the web, MacOS, and Windows.

3. How can I check for updates?
The app will automatically check for updates when it is opened. If an update is available, it will be downloaded automatically. The next time you open the app, you'll be using the latest version!

4. Find a bug?
Please look at the [issues](../../issues), and file a new one if it hasn't already been reported.

---

## License

[MIT](LICENSE)
