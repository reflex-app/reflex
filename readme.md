<div >
    <h3 align="center">Shift</h3>
    <p align="center">A tool for previewing responsive sites.</p>
</div>

![Shift Screenshot](screenshot.png)

Shift is a free, open-source, part-time project that makes it easy to preview a site at different screen sizes. It's a hybrid web/native application that's currently built on [NW.JS](https://github.com/nwjs/nw.js/) (Node-Webkit).

## Install

**[Download the latest release (MacOS only)](https://github.com/nwittwer/shift/releases/latest)**

[Need help installing?](#FAQ)

## Features:
- [x] MacOS app (hybrid)
- [x] Preview your changes across many viewport sizes
- [x] Add all the sizes you want. They're saved automatically.
- [x] Easily resize your viewports. And they're saved for when you come back.
- [x] Natural scrolling/panning of the canvas
- [x] Recent URLs are saved, making it easy to re-access them.
- [ ] Quickly test an entire user flow, across multiple viewport sizes, in one place using [Browsersync](https://browsersync.io/) built-in
- [ ] Ability to test high-pixel-density (i.e. Apple's "retina" device resolutions)
- [ ] Ability to test different user-agents

[View upcoming features](https://github.com/nwittwer/shift/projects)

## Contributing

Please take a look at the [upcoming features](https://github.com/nwittwer/shift/projects) and the [open Github issues](https://github.com/nwittwer/shift/issues). 

You can [fork](https://help.github.com/articles/fork-a-repo/) this project to your own Github account, and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your computer.

### Developing

We recommend having the following installed: 
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
$ npm start
```

To make sure your code works in the final app, run the following command. This will output a `Shift.app` file inside of the `ship/Shift/osx64/` folder for MacOS.<br>
```sh
$ npm run build
```

### Debugging

Open the app, right click, and select "Inspect" to open Chrome DevTools

## FAQ

1. Help installing for MacOS
    1. Move the Application to your Applications folder
        - If you get a warning like "Cannot be opened because the developer is not verified.", open System Preferences > Security & Privacy > "Open anyway"
    2. Open the application by double-clicking the icon

2. What should I do if I get one of the following errors?
    - "Your profile can not be used because it is from a newer version of NW.js." 
        ```sh
        $ rm -R ~/Library/Application\ Support/Shift
        ```
    - `Error: listen EADDRINUSE :::8000`
        ```sh
        $ kill -9 $(lsof -i TCP:8000 | grep LISTEN | awk '{print $2}')
        ```

3. Does Shift work on Windows OS?

At the moment, only the Mac version is being supported/tested, as it requires a large amount of effort to add another OS to support. With more help, most or all of this project could work on the web, MacOS, and Windows.

## License

[MIT](LICENSE)