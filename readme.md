# Tunnelframe
Preview responsive websites as you build them.

![Tunnelframe Screenshot](screenshot.png)

## Features:
- Preview your changes across many viewport sizes (+ devices connected via URL)
- (Works with Browsersync urls) Quickly test an entire user flow, across multiple viewport sizes, in one place (+ devices connected via URL)
- (TBA) Have basic accessibility, design, and visual debugging overlays

## What this project is _not_:
- Device emulation/simulation
- Cross-browser testing
- Visual regression testing

## Using the app
### Normal
- Download the latest release (.ZIP): https://github.com/nwittwer/tunnelframe/releases/latest
- Move the Application to your Applications folder
    - If you get a warning like "Cannot be opened because the developer is not verified.", open System Preferences > Security & Privacy > "Open anyway"
- Open the application by double-clicking it

## FAQ
- `Error: listen EADDRINUSE :::8000` --> Run this in Terminal: `kill -9 $(lsof -i TCP:8000 | grep LISTEN | awk '{print $2}')`
- If you get something like "Your profile can not be used because it is from a newer version of NW.js." run this: `rm -R ~/Library/Application\ Support/Tunnelframe`
- This project has the ability to build for Windows, but currently only the Mac version is being supported/tested

## How it works
1. NWJS launches the Node web app inside of a native wrapper, making it appear like a native Mac app
2. Once launched, a Node server is created, and NWJS allows us to access Node Modules
3. iFrames. iFrames everywhere. Plus some jQuery functions to handle resizing and the canvas.

## Developing
Requirements:
- Node (tested with 10.0+)
- NPM 5+
- Gulp 4+

1. Clone this repo
2. `cd` into the created directory and run `npm install`
3. You'll need to install the NW.js CLI: `npm i nw -g`
4. If you want to run the app in development, use `npm start`. SCSS, JS, and images will be watched and updated upon saving.

### Commands

- Develop with live reloading of NWJS app contents: `npm start`
- Output to a distributable NWJS app: `npm run build`

### Tasks

#### Default (dev)
1. WebPack builds all the require Node Modules, and puts the following into /dist
    - index.html
    - package.json
    - app.{{hash]}.js
2. Gulp sets up a watch task

#### Build

1. WebPack builds all the required Node Modules, and puts the following into /dist
    - index.html
    - package.json
    - app.{{hash]}.js
2. Gulp builds all files to production level
3. Gulp moves any necessary files
4. Gulp runs `NW-builder`, which produces apps from NWJS
5. App is now built in the `/ship` directory

## Debugging
- Open the app, and press `CMD + Shift + I` to open Chrome DevTools
- Remote debugging URL: `http://localhost:9999`
