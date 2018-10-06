<div >
    <h3 align="center">Shift</h3>
    <p align="center">A tool for previewing responsive sites.</p>
</div>

![Shift Screenshot](screenshot.png)

Shift is a free, open-source Mac app that makes it easy to see how responsive websites look at different screen sizes. Made especially for designers & developers who are tired of manually resizing their browser window.

---

## Download

**[Download version 0.3.1 (MacOS only)](https://github.com/nwittwer/shift/releases/download/v0.3.1/shift-0.3.1-mac.zip)**

Or download via command line (Terminal):

Step 1:
```bash
URL=$(curl -s https://api.github.com/repos/nwittwer/shift/releases/latest | grep browser_download_url | cut -d '"' -f 4)
```

Step 2:
```bash
curl -LO "$URL"
```

[Having issues installing?](#faq)

### Features:
- Preview your web development changes across as many sizes as you want
- Natural scrolling/panning of the canvas
- Easily resize the viewports
- Your setup is saved for the next time you use the app

Check out our [upcoming features](../../projects) and [feature requests](../../issues&q=label%3Afeature-request). If you have an idea that you didn't see it in either of those places, you can create a [new Github issue](../../issues) for it!

---

## Contributing

Please take a look at the [upcoming features](../../projects) and the [open Github issues](../../issues). Bug reports and feature requests are welcome!

---

## Developing

Please use the following versions: 
- Node 10.0+, NPM 6+, Gulp 4+

1. Clone the project to your computer:
    ```sh
    $ git clone https://github.com/nwittwer/shift.git
    $ cd shift
    ```

2. Install dependencies:
    ```sh
    $ npm install
    ```

3. Compile and watch for changes:
    ```sh
    $ npm run start
    ```

    To make sure your code works in the final app, run the following command. This will output a `Shift.app` file inside of the `ship/Shift/osx64/` folder for MacOS.

    ```sh
    $ npm run build
    ```

### Debugging

Open the app, right click, and select "Inspect" to open Chrome DevTools

---

## FAQ

1. Help installing for MacOS
    1. Move the Application to your Applications folder
    2. Open the application by double-clicking the icon

2. Does Shift work on Windows OS?

At the moment, only the Mac version is being supported/tested, as it requires a large amount of effort to add another OS to support. With more help, most or all of this project could work on the web, MacOS, and Windows.

3. What should I do if I get one of the following errors?
    - "Your profile can not be used because it is from a newer version of NW.js." 
        ```sh
        $ rm -R ~/Library/Application\ Support/Shift
        ```
    - `Error: listen EADDRINUSE :::8000`
        ```sh
        $ kill -9 $(lsof -i TCP:8000 | grep LISTEN | awk '{print $2}')
        ```

---

## License

[MIT](LICENSE)
