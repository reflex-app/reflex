# Screens
Preview your website on multiple screen sizes, at the same time.

## Using the app
### Normal
- Download the latest release: https://github.com/nwittwer/screens/releases
- Move the Application to your Applications folder
    - If you get a warning like "Cannot be opened because the developer is not verified.", open System Preferences > Security & Privacy > "Open anyway"
- Open the application by double-clicking it

## FAQ
- `Error: listen EADDRINUSE :::8000` --> Run this in Terminal: `kill -9 $(lsof -i TCP:8000 | grep LISTEN | awk '{print $2}')`
- If you get something like "Your profile can not be used because it is from a newer version of NW.js." run this: `rm -R ~/Library/Application\ Support/Screens`
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
2. `cd` into the `src` directory and run `npm install` to install the dev tools
3. If you want to run the app in development, use `gulp run-app`. SCSS, JS, and images will be watched and updated upon saving.
4. To compile the app, run `gulp build-app`. The build is stored under `src/build`.

### Commands

- Develop with live reloading of NWJS app: `npm start`
- Move dist folder into an NWJS app: `npm run build`

### Tasks

#### Default (dev)
1. WebPack builds all the require Node Modules, and puts the following into /dist
    - index.html
    - package.json
    - app.{{hash]}.js
2. Gulp sets up a watch task

#### Build

1. WebPack builds all the require Node Modules, and puts the following into /dist
    - index.html
    - package.json
    - app.{{hash]}.js
2. Gulp builds all files to production level
3. Gulp moves any necessary files
4. Gulp runs `NW-builder`, which produces apps from NWJS
5. App is now built in the `/ship` directory

### Tree structure

|__ build/          <-- WebPack and tasks
|__ dist/           <-- The files that appear during testing, and will be copied into the final app 
|__ gulp/           <-- Gulp tasks
|__ gulpfile.js     <-- Gulp execute script
|__ node_modules/
|__ src/            <-- The source files (uncompiled)
|__ ship/           <-- Contains the final app(s)
    |__ cache       <-- Cached NWJS versions, prevents re-downloading
    |__ {{app-name}}.app
|__ package.json    <-- Runs `npm` scripts

## Debugging
- Open the app, and press `CMD + Shift + I` to open Chrome DevTools
- Remote debugging URL: `http://localhost:9999`