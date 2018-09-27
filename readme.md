# Shift
> A tool for previewing responsive sites.

![Shift Screenshot](screenshot.png)

## Installation

[Download the latest version (MacOS 10.12+)](https://github.com/nwittwer/shift/releases/latest)

### Installation Instructions
1. Move the Application to your Applications folder
    - If you get a warning like "Cannot be opened because the developer is not verified.", open System Preferences > Security & Privacy > "Open anyway"
2. Open the application by double-clicking it

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

## Developing
Requirements (tested with):
- Node 10.0+
- NPM 6+
- Gulp 4+

1. Clone this repo
2. `cd` into the created directory and run `npm install`
3. You'll need to install the NW.js CLI: `npm i nw -g`
4. If you want to run the app in development, use `npm start`. SCSS, JS, and images will be watched and updated upon saving.

### Tasks

#### Default (`npm start`)

1. Compile & watch JS, SCSS from `src` --> `dist`
2. On changes, clean directory and compile again

#### Build (`npm run build`)

1. Gulp takes everything from `/dist`:
    - index.html
    - package.json
    - etc.
2. Gulp builds all files to production level
3. Gulp runs `NW-builder`, which produces apps from NWJS
4. App is now built in the `/ship` directory
5. With the right credentials, a release can be created

### Helpful resources
- Hybrid app ([NWJS](http://docs.nwjs.io/en/latest/))
- 

## FAQ
- `Error: listen EADDRINUSE :::8000`
    - Terminal: `kill -9 $(lsof -i TCP:8000 | grep LISTEN | awk '{print $2}')`
- "Your profile can not be used because it is from a newer version of NW.js." 
    - Terminal: `rm -R ~/Library/Application\ Support/Shift`
- This project has the ability to build for Windows, but currently only the Mac version is being supported/tested, as it requires a large amount of effort to add another OS to support.

## Debugging
- Open the app, right click, and select "Inspect" to open Chrome DevTools

## License
MIT