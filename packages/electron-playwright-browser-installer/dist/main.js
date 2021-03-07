(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["electronPlaywrightBrowserInstaller"] = factory();
	else
		root["electronPlaywrightBrowserInstaller"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Installer": () => /* reexport safe */ _lib_index_js__WEBPACK_IMPORTED_MODULE_0__.Installer,
/* harmony export */   "getPackagedPlaywrightExecPath": () => /* reexport safe */ _lib_index_js__WEBPACK_IMPORTED_MODULE_0__.getPackagedPlaywrightExecPath
/* harmony export */ });
/* harmony import */ var _lib_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/index.js */ "./src/lib/index.js");
 // import "core-js/stable";
// import "regenerator-runtime/runtime";
// Import

 // Export the default (Installer class)



/***/ }),

/***/ "./src/lib/emitter.js":
/*!****************************!*\
  !*** ./src/lib/emitter.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "downloadEmitter": () => /* binding */ downloadEmitter,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* provided dependency */ var console = __webpack_require__(/*! console-browserify */ "console-browserify");
/**
 * Event emitter
 * This allows us to expose the download progress
 * See: lib/install/browserFetcher.js
 */
const {
  EventEmitter
} = __webpack_require__(/*! events */ "events");

const downloadEmitter = new EventEmitter();
/**
 * Here's an example
 */
// Listen to progress events

downloadEmitter.on('progress', ({
  current,
  total,
  name
}) => {
  const msg = `Downloading ${name} - ${current}/${total}`;
  console.log(msg);
});
downloadEmitter.on('done', () => {// Function here
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (downloadEmitter);

/***/ }),

/***/ "./src/lib/index.js":
/*!**************************!*\
  !*** ./src/lib/index.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Installer": () => /* binding */ Installer,
/* harmony export */   "getPackagedPlaywrightExecPath": () => /* binding */ getPackagedPlaywrightExecPath
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var playwright_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! playwright-core */ "playwright-core");
/* harmony import */ var playwright_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(playwright_core__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./emitter */ "./src/lib/emitter.js");
/* provided dependency */ var console = __webpack_require__(/*! console-browserify */ "console-browserify");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



 // We'll prepend console.log messages for this library
// via https://stackoverflow.com/a/16259739/1114901

/**
 * Attach to the EventEmitter
 * This allows us to stream the download progress
 */

 // import "core-js/stable";
// import "regenerator-runtime/runtime";

const packageName = 'electron-playwright-browser-installer';
const logTypes = ['log', 'error', 'info', 'warn'];

if (console.log) {
  const generator = type => {
    const old = console[type];

    console[type] = function () {
      Array.prototype.unshift.call(arguments, `${packageName.toUpperCase()}:`);
      old.apply(this, arguments);
    };
  }; // Apply to each type of console


  logTypes.map(generator);
}
/**
 * This file exposes a class interface for
 * displaying the browser installation progress
 */


const {
  installBrowsersWithProgressBar
} = __webpack_require__(/*! ./install/installer */ "./src/lib/install/installer.js");

let Installer = /*#__PURE__*/function () {
  function Installer(options = {}) {
    _classCallCheck(this, Installer);

    options = options || {};
    this.browsers = options.browsers || ['chromium', 'firefox', 'webkit'];
  }

  _createClass(Installer, [{
    key: "run",
    value: async function run() {
      const isInstalled = await this.checkIfInstalled();

      if (isInstalled) {
        console.log('Browsers are installed.');
      } else {
        // Not installed yet
        console.log('Browsers are NOT installed. Attempting to install...');
        await this.install();
      }
    }
  }, {
    key: "checkIfInstalled",
    value: async function checkIfInstalled() {
      // Check for installed browsers in a directory
      console.log('Checking if browsers are installed...'); // Verify that there is a directory for each of the browsers

      const checkInstallDir = async () => {
        // List of files/folders at path in user's filesystem
        const results = await ls(path__WEBPACK_IMPORTED_MODULE_1___default().join(__dirname, '/.local-browsers'));
        console.log('Found at install directory:', results);
        if (!results) return false; // Case: no folders/files found at directory
        // Validation

        return this.browsers.every(v => results.find(x => x.includes(v)));
      };

      const isInstalled = (await checkInstallDir()) === true;

      if (isInstalled) {
        console.log('Browsers are installed.');
        return true;
      } else {
        console.error('Browsers are NOT installed!');
        return false;
      }
    }
  }, {
    key: "install",
    value: async function install(options = {
      browsers: this.browsers
    }) {
      // Require browers to be defined
      if (!options.browsers.length) {
        console.error(`No browsers were passed in to install. Setting defaults: ${this.browsers}`);
        return false;
      } // Start listening for download events
      // Listen to progress events


      _emitter__WEBPACK_IMPORTED_MODULE_3__.downloadEmitter.on('progress', ({
        current,
        total,
        name
      }) => {
        const msg = `Downloading ${name} - ${current}/${total}`;
        console.log(msg);
      });
      _emitter__WEBPACK_IMPORTED_MODULE_3__.downloadEmitter.on('done', async () => {// Function here
        // console.log(`It's done downloading!`);
      }); // Example via Playwright's Github Installer
      // https://github.com/microsoft/playwright/blob/master/install-from-github.js#L29

      await installBrowsersWithProgressBar(__dirname).catch(err => {
        console.error(`Failed to install browsers, caused by\n${err.stack}`); // process.exit(1)
      }); // Inform about the installation paths

      if (options.browsers.length >= 1) {
        console.log('Browser paths:', options.browsers.map(browser => (playwright_core__WEBPACK_IMPORTED_MODULE_2___default())[browser].executablePath()));
      } // Final check


      return this.checkIfInstalled();
    }
  }]);

  return Installer;
}(); // Find all files & folders at a path
// https://stackoverflow.com/a/59042581/1114901

async function ls(path) {
  try {
    const tempArr = [];
    const dir = await fs__WEBPACK_IMPORTED_MODULE_0__.promises.opendir(path); // Opens a stream https://nodejs.org/api/fs.html#fs_class_fs_dir

    for await (const dirent of dir) {
      tempArr.push(dirent.name);
    }

    return tempArr; // return all the files & directories at the output dir
  } catch (err) {
    console.error(err);
    return false;
  }
} // Amend the Playwright executable path when packaged
// via https://github.com/puppeteer/puppeteer/issues/2134#issuecomment-408221446


function getPackagedPlaywrightExecPath(browser) {
  if (!browser) console.error('No browser name given.');

  function replaceAll(str, mapObj) {
    const re = new RegExp(Object.keys(mapObj).join('|'), 'gi');
    return str.replace(re, function (matched) {
      return mapObj[matched.toLowerCase()];
    });
  }

  const mapObj = {
    playwright: 'electron-playwright-browser-installer',
    'app.asar': 'app.asar.unpacked'
  }; // Generate the correct paths

  const initialPath = (playwright_core__WEBPACK_IMPORTED_MODULE_2___default())[browser].executablePath();
  const updatedPath = replaceAll(initialPath, mapObj);
  console.log('Is the path the same as initially?', initialPath === updatedPath, `Changed to: ${updatedPath}`);
  return updatedPath;
} // Export the default (Installer class)
// export default {
//   Installer,
//   getPackagedPlaywrightExecPath,
// };

/***/ }),

/***/ "./src/lib/install/browserFetcher.js":
/*!*******************************************!*\
  !*** ./src/lib/install/browserFetcher.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "downloadBrowserWithProgressBar": () => /* binding */ downloadBrowserWithProgressBar,
/* harmony export */   "logPolitely": () => /* binding */ logPolitely
/* harmony export */ });
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../emitter */ "./src/lib/emitter.js");
/* provided dependency */ var console = __webpack_require__(/*! console-browserify */ "console-browserify");
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "process/browser");
/**
 * Attach to the EventEmitter
 * This allows us to stream the download progress
 */

'use strict';
/**
 * Copyright 2017 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


Object.defineProperty(__webpack_exports__, "__esModule", ({
  value: true
}));
exports.logPolitely = exports.downloadBrowserWithProgressBar = void 0;

const fs = __webpack_require__(/*! fs */ "fs");

const os = __webpack_require__(/*! os */ "os");

const path = __webpack_require__(/*! path */ "path");

const URL = __webpack_require__(/*! url */ "url");

const util = __webpack_require__(/*! util */ "util");

const ProgressBar = __webpack_require__(/*! progress */ "progress");

const proxy_from_env_1 = __webpack_require__(/*! proxy-from-env */ "proxy-from-env");

const extract = __webpack_require__(/*! extract-zip */ "extract-zip");

const ProxyAgent = __webpack_require__(/*! https-proxy-agent */ "https-proxy-agent");

const browserPaths = __webpack_require__(/*! ../utils/browserPaths */ "./src/lib/utils/browserPaths.js"); // `https-proxy-agent` v5 is written in Typescript and exposes generated types.
// However, as of June 2020, its types are generated with tsconfig that enables
// `esModuleInterop` option.
//
// As a result, we can't depend on the package unless we enable the option
// for our codebase. Instead of doing this, we abuse "require" to import module
// without types.


const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/lib/utils/utils.js");

const unlinkAsync = util.promisify(fs.unlink.bind(fs));
const chmodAsync = util.promisify(fs.chmod.bind(fs));

const existsAsync = path => new Promise(resolve => fs.stat(path, err => resolve(!err)));

const CHROMIUM_MOVE_TO_AZURE_CDN_REVISION = 792639;

function getDownloadHost(browserName, revision) {
  // Only old chromium revisions are downloaded from gbucket.
  const defaultDownloadHost = browserName === 'chromium' && revision < CHROMIUM_MOVE_TO_AZURE_CDN_REVISION ? 'https://storage.googleapis.com' : 'https://playwright.azureedge.net';
  const envDownloadHost = {
    chromium: 'PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST',
    firefox: 'PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST',
    webkit: 'PLAYWRIGHT_WEBKIT_DOWNLOAD_HOST'
  };
  return utils_1.getFromENV(envDownloadHost[browserName]) || utils_1.getFromENV('PLAYWRIGHT_DOWNLOAD_HOST') || defaultDownloadHost;
}

function getDownloadUrl(browserName, revision, platform) {
  if (browserName === 'chromium') {
    return revision < CHROMIUM_MOVE_TO_AZURE_CDN_REVISION ? new Map([['ubuntu18.04', '%s/chromium-browser-snapshots/Linux_x64/%d/chrome-linux.zip'], ['ubuntu20.04', '%s/chromium-browser-snapshots/Linux_x64/%d/chrome-linux.zip'], ['mac10.13', '%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip'], ['mac10.14', '%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip'], ['mac10.15', '%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip'], ['mac11.0', '%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip'], ['mac11.1', '%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip'], ['win32', '%s/chromium-browser-snapshots/Win/%d/chrome-win.zip'], ['win64', '%s/chromium-browser-snapshots/Win_x64/%d/chrome-win.zip']]).get(platform) : new Map([['ubuntu18.04', '%s/builds/chromium/%s/chromium-linux.zip'], ['ubuntu20.04', '%s/builds/chromium/%s/chromium-linux.zip'], ['mac10.13', '%s/builds/chromium/%s/chromium-mac.zip'], ['mac10.14', '%s/builds/chromium/%s/chromium-mac.zip'], ['mac10.15', '%s/builds/chromium/%s/chromium-mac.zip'], ['mac11.0', '%s/builds/chromium/%s/chromium-mac.zip'], ['mac11.0-arm64', '%s/builds/chromium/%s/chromium-mac-arm64.zip'], ['mac11.1', '%s/builds/chromium/%s/chromium-mac.zip'], ['mac11.1-arm64', '%s/builds/chromium/%s/chromium-mac-arm64.zip'], ['win32', '%s/builds/chromium/%s/chromium-win32.zip'], ['win64', '%s/builds/chromium/%s/chromium-win64.zip']]).get(platform);
  }

  if (browserName === 'firefox') {
    const FIREFOX_NORMALIZE_CDN_NAMES_REVISION = 1140;
    return revision < FIREFOX_NORMALIZE_CDN_NAMES_REVISION ? new Map([['ubuntu18.04', '%s/builds/firefox/%s/firefox-linux.zip'], ['ubuntu20.04', '%s/builds/firefox/%s/firefox-linux.zip'], ['mac10.13', '%s/builds/firefox/%s/firefox-mac.zip'], ['mac10.14', '%s/builds/firefox/%s/firefox-mac.zip'], ['mac10.15', '%s/builds/firefox/%s/firefox-mac.zip'], ['mac11.0', '%s/builds/firefox/%s/firefox-mac.zip'], ['mac11.1', '%s/builds/firefox/%s/firefox-mac.zip'], ['win32', '%s/builds/firefox/%s/firefox-win32.zip'], ['win64', '%s/builds/firefox/%s/firefox-win64.zip']]).get(platform) : new Map([['ubuntu18.04', '%s/builds/firefox/%s/firefox-ubuntu-18.04.zip'], ['ubuntu20.04', '%s/builds/firefox/%s/firefox-ubuntu-18.04.zip'], ['mac10.13', '%s/builds/firefox/%s/firefox-mac-10.14.zip'], ['mac10.14', '%s/builds/firefox/%s/firefox-mac-10.14.zip'], ['mac10.15', '%s/builds/firefox/%s/firefox-mac-10.14.zip'], ['mac11.0', '%s/builds/firefox/%s/firefox-mac-10.14.zip'], ['mac11.0-arm64', '%s/builds/firefox/%s/firefox-mac-10.14.zip'], ['mac11.1', '%s/builds/firefox/%s/firefox-mac-10.14.zip'], ['mac11.1-arm64', '%s/builds/firefox/%s/firefox-mac-10.14.zip'], ['win32', '%s/builds/firefox/%s/firefox-win32.zip'], ['win64', '%s/builds/firefox/%s/firefox-win64.zip']]).get(platform);
  }

  if (browserName === 'webkit') {
    const WEBKIT_NORMALIZE_CDN_NAMES_REVISION = 1317;
    return revision < WEBKIT_NORMALIZE_CDN_NAMES_REVISION ? new Map([['ubuntu18.04', '%s/builds/webkit/%s/minibrowser-gtk-wpe.zip'], ['ubuntu20.04', '%s/builds/webkit/%s/minibrowser-gtk-wpe.zip'], ['mac10.13', undefined], ['mac10.14', '%s/builds/webkit/%s/minibrowser-mac-10.14.zip'], ['mac10.15', '%s/builds/webkit/%s/minibrowser-mac-10.15.zip'], ['mac11.0', '%s/builds/webkit/%s/minibrowser-mac-10.15.zip'], ['mac11.1', '%s/builds/webkit/%s/minibrowser-mac-10.15.zip'], ['win32', '%s/builds/webkit/%s/minibrowser-win64.zip'], ['win64', '%s/builds/webkit/%s/minibrowser-win64.zip']]).get(platform) : new Map([['ubuntu18.04', '%s/builds/webkit/%s/webkit-ubuntu-18.04.zip'], ['ubuntu20.04', '%s/builds/webkit/%s/webkit-ubuntu-20.04.zip'], ['mac10.13', undefined], ['mac10.14', '%s/builds/webkit/%s/webkit-mac-10.14.zip'], ['mac10.15', '%s/builds/webkit/%s/webkit-mac-10.15.zip'], ['mac11.0', '%s/builds/webkit/%s/webkit-mac-10.15.zip'], ['mac11.0-arm64', '%s/builds/webkit/%s/webkit-mac-11.0-arm64.zip'], ['mac11.1', '%s/builds/webkit/%s/webkit-mac-10.15.zip'], ['mac11.1-arm64', '%s/builds/webkit/%s/webkit-mac-11.0-arm64.zip'], ['win32', '%s/builds/webkit/%s/webkit-win64.zip'], ['win64', '%s/builds/webkit/%s/webkit-win64.zip']]).get(platform);
  }
}

function revisionURL(browser, platform = browserPaths.hostPlatform) {
  const revision = parseInt(browser.revision, 10);
  const serverHost = getDownloadHost(browser.name, revision);
  const urlTemplate = getDownloadUrl(browser.name, revision, platform);
  utils_1.assert(urlTemplate, `ERROR: Playwright does not support ${browser.name} on ${platform}`);
  return util.format(urlTemplate, serverHost, browser.revision);
}

async function downloadBrowserWithProgressBar(browsersPath, browser) {
  const browserPath = browserPaths.browserDirectory(browsersPath, browser);
  const progressBarName = `${browser.name} v${browser.revision}`;

  if (await existsAsync(browserPath)) {
    // Already downloaded.
    return false;
  } // let progressBar


  const lastDownloadedBytes = 0;

  function progress(downloadedBytes, totalBytes) {
    const delta = downloadedBytes - lastDownloadedBytes; // if (!progressBar) {
    //   progressBar = new ProgressBar(
    //     `Downloading ${progressBarName} - ${toMegabytes(
    //       totalBytes
    //     )} [:bar] :percent :etas `,
    //     {
    //       complete: "=",
    //       incomplete: " ",
    //       width: 20,
    //       total: totalBytes,
    //     }
    //   );
    // }
    // lastDownloadedBytes = downloadedBytes;
    // progressBar.tick(delta);
    // Emit the progress
    // This function is called whenever there's new bytes downloaded

    _emitter__WEBPACK_IMPORTED_MODULE_0__.downloadEmitter.emit('progress', {
      name: progressBarName,
      delta,
      current: toMegabytes(downloadedBytes),
      total: toMegabytes(totalBytes)
    }); // Done!

    if (downloadedBytes === totalBytes) {
      const finalMsg = `${progressBarName} installed.`;
      _emitter__WEBPACK_IMPORTED_MODULE_0__.downloadEmitter.emit('done', finalMsg);
      console.log(finalMsg);
    }
  }

  const url = revisionURL(browser);
  const zipPath = path.join(os.tmpdir(), `playwright-download-${browser.name}-${browserPaths.hostPlatform}-${browser.revision}.zip`);

  try {
    await downloadFile(url, zipPath, progress);
    await extract(zipPath, {
      dir: browserPath
    });
    await chmodAsync(browserPaths.executablePath(browserPath, browser), 0o755);
  } catch (e) {
    process.exitCode = 1;
    throw e;
  } finally {
    if (await existsAsync(zipPath)) await unlinkAsync(zipPath);
  }

  logPolitely(`${progressBarName} downloaded to ${browserPath}`);
  return true;
} // exports.downloadBrowserWithProgressBar = downloadBrowserWithProgressBar;

function toMegabytes(bytes) {
  const mb = bytes / 1024 / 1024;
  return `${Math.round(mb * 10) / 10} Mb`;
}

function downloadFile(url, destinationPath, progressCallback) {
  let fulfill = () => {};

  let reject = () => {};

  let downloadedBytes = 0;
  let totalBytes = 0;
  const promise = new Promise((x, y) => {
    fulfill = x;
    reject = y;
  });
  const request = httpRequest(url, 'GET', response => {
    if (response.statusCode !== 200) {
      const error = new Error(`Download failed: server returned code ${response.statusCode}. URL: ${url}`); // consume response data to free up memory

      response.resume();
      reject(error);
      return;
    }

    const file = fs.createWriteStream(destinationPath);
    file.on('finish', () => fulfill());
    file.on('error', error => reject(error));
    response.pipe(file);
    totalBytes = parseInt(response.headers['content-length'], 10);
    if (progressCallback) response.on('data', onData);
  });
  request.on('error', error => reject(error));
  return promise;

  function onData(chunk) {
    downloadedBytes += chunk.length;
    progressCallback(downloadedBytes, totalBytes);
  }
}

function httpRequest(url, method, response) {
  let options = URL.parse(url);
  options.method = method;
  const proxyURL = proxy_from_env_1.getProxyForUrl(url);

  if (proxyURL) {
    if (url.startsWith('http:')) {
      const proxy = URL.parse(proxyURL);
      options = {
        path: options.href,
        host: proxy.hostname,
        port: proxy.port
      };
    } else {
      const parsedProxyURL = URL.parse(proxyURL);
      parsedProxyURL.secureProxy = parsedProxyURL.protocol === 'https:';
      options.agent = new ProxyAgent(parsedProxyURL);
      options.rejectUnauthorized = false;
    }
  }

  const requestCallback = res => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) httpRequest(res.headers.location, method, response);else response(res);
  };

  const request = options.protocol === 'https:' ? __webpack_require__(/*! https */ "https").request(options, requestCallback) : __webpack_require__(/*! http */ "http").request(options, requestCallback);
  request.end();
  return request;
}

function logPolitely(toBeLogged) {
  const logLevel = process.env.npm_config_loglevel;
  const logLevelDisplay = ['silent', 'error', 'warn'].includes(logLevel || '');
  if (!logLevelDisplay) console.log(toBeLogged); // eslint-disable-line no-console
} // exports.logPolitely = logPolitely;
// # sourceMappingURL=browserFetcher.js.map

/***/ }),

/***/ "./src/lib/install/installer.js":
/*!**************************************!*\
  !*** ./src/lib/install/installer.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "installBrowsersWithProgressBar": () => /* binding */ installBrowsersWithProgressBar,
/* harmony export */   "validateCache": () => /* binding */ validateCache,
/* harmony export */   "readBrowsersToDownload": () => /* binding */ readBrowsersToDownload
/* harmony export */ });

/**
 * Copyright Microsoft Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Object.defineProperty(__webpack_exports__, "__esModule", ({
  value: true
})); // exports.installBrowsersWithProgressBar = void 0;

const crypto = __webpack_require__(/*! crypto */ "crypto");

const fs = __webpack_require__(/*! fs */ "fs");

const path = __webpack_require__(/*! path */ "path");

const util = __webpack_require__(/*! util */ "util");

const removeFolder = __webpack_require__(/*! rimraf */ "rimraf");

const lockfile = __webpack_require__(/*! proper-lockfile */ "proper-lockfile");

const browserPaths = __webpack_require__(/*! ../utils/browserPaths */ "./src/lib/utils/browserPaths.js");

const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/lib/utils/utils.js");

const browserFetcher = __webpack_require__(/*! ./browserFetcher */ "./src/lib/install/browserFetcher.js");

const fsMkdirAsync = util.promisify(fs.mkdir.bind(fs));
const fsReaddirAsync = util.promisify(fs.readdir.bind(fs));
const fsReadFileAsync = util.promisify(fs.readFile.bind(fs));

const fsExistsAsync = filePath => fsReadFileAsync(filePath).then(() => true).catch(e => false);

const fsUnlinkAsync = util.promisify(fs.unlink.bind(fs));
const fsWriteFileAsync = util.promisify(fs.writeFile.bind(fs));
const removeFolderAsync = util.promisify(removeFolder);
async function installBrowsersWithProgressBar(packagePath) {
  // PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD should have a value of 0 or 1
  if (true) {
    browserFetcher.logPolitely(`Browser installation path set to hermetic, because 'PLAYWRIGHT_BROWSERS_PATH' env variable is set to ${0}`);
  } else {} // PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD should have a value of 0 or 1


  if (utils_1.getAsBooleanFromENV('PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD')) {
    browserFetcher.logPolitely('Skipping browsers download because `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` env variable is set');
    return false;
  }

  const browsersPath = browserPaths.browsersPath(packagePath);
  await fsMkdirAsync(browsersPath, {
    recursive: true
  });
  const lockfilePath = path.join(browsersPath, '__dirlock');
  const releaseLock = await lockfile.lock(browsersPath, {
    retries: {
      retries: 10,
      // Retry 20 times during 10 minutes with
      // exponential back-off.
      // See documentation at: https://www.npmjs.com/package/retry#retrytimeoutsoptions
      factor: 1.27579
    },
    onCompromised: err => {
      throw new Error(`${err.message} Path: ${lockfilePath}`);
    },
    lockfilePath
  });
  const linksDir = path.join(browsersPath, '.links');
  await fsMkdirAsync(linksDir, {
    recursive: true
  });
  await fsWriteFileAsync(path.join(linksDir, sha1(packagePath)), packagePath);
  await validateCache(packagePath, browsersPath, linksDir);
  await releaseLock();
} // exports.installBrowsersWithProgressBar = installBrowsersWithProgressBar;

async function validateCache(packagePath, browsersPath, linksDir) {
  // 1. Collect used downloads and package descriptors.
  const usedBrowserPaths = new Set();

  for (const fileName of await fsReaddirAsync(linksDir)) {
    const linkPath = path.join(linksDir, fileName);
    let linkTarget = '';

    try {
      linkTarget = (await fsReadFileAsync(linkPath)).toString();
      const browsersToDownload = await readBrowsersToDownload(linkTarget);

      for (const browser of browsersToDownload) {
        const usedBrowserPath = browserPaths.browserDirectory(browsersPath, browser);
        const browserRevision = parseInt(browser.revision, 10); // Old browser installations don't have marker file.

        const shouldHaveMarkerFile = browser.name === 'chromium' && browserRevision >= 786218 || browser.name === 'firefox' && browserRevision >= 1128 || browser.name === 'webkit' && browserRevision >= 1307;
        if (!shouldHaveMarkerFile || (await fsExistsAsync(browserPaths.markerFilePath(browsersPath, browser)))) usedBrowserPaths.add(usedBrowserPath);
      }
    } catch (e) {
      if (linkTarget) browserFetcher.logPolitely('Failed to process descriptor at ' + linkTarget);
      await fsUnlinkAsync(linkPath).catch(e => {});
    }
  } // 2. Delete all unused browsers.


  let downloadedBrowsers = (await fsReaddirAsync(browsersPath)).map(file => path.join(browsersPath, file));
  downloadedBrowsers = downloadedBrowsers.filter(file => browserPaths.isBrowserDirectory(file));
  const directories = new Set(downloadedBrowsers);

  for (const browserPath of usedBrowserPaths) directories.delete(browserPath);

  for (const directory of directories) {
    browserFetcher.logPolitely('Removing unused browser at ' + directory);
    await removeFolderAsync(directory).catch(e => {});
  } // 3. Install missing browsers for this package.


  const myBrowsersToDownload = await readBrowsersToDownload(packagePath);

  for (const browser of myBrowsersToDownload) {
    await browserFetcher.downloadBrowserWithProgressBar(browsersPath, browser);
    await fsWriteFileAsync(browserPaths.markerFilePath(browsersPath, browser), '');
  }
}
async function readBrowsersToDownload(packagePath) {
  const browsers = JSON.parse((await fsReadFileAsync(path.join(packagePath, 'browsers.json'))).toString()).browsers; // Older versions do not have "download" field. We assume they need all browsers
  // from the list. So we want to skip all browsers that are explicitly marked as "download: false".

  return browsers.filter(browser => browser.download !== false);
}

function sha1(data) {
  const sum = crypto.createHash('sha1');
  sum.update(data);
  return sum.digest('hex');
} // # sourceMappingURL=installer.js.map

/***/ }),

/***/ "./src/lib/utils/browserPaths.js":
/*!***************************************!*\
  !*** ./src/lib/utils/browserPaths.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "process/browser");

/**
 * Copyright 2017 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isBrowserDirectory = exports.markerFilePath = exports.browserDirectory = exports.browsersPath = exports.executablePath = exports.windowsExeAndDllDirectories = exports.linuxLddDirectories = exports.hostPlatform = void 0;

const child_process_1 = __webpack_require__(/*! child_process */ "child_process");

const os = __webpack_require__(/*! os */ "os");

const path = __webpack_require__(/*! path */ "path");

const ubuntuVersion_1 = __webpack_require__(/*! ./ubuntuVersion */ "./src/lib/utils/ubuntuVersion.js");

const utils_1 = __webpack_require__(/*! ./utils */ "./src/lib/utils/utils.js");

exports.hostPlatform = (() => {
  const platform = os.platform();

  if (platform === "darwin") {
    const macVersion = child_process_1.execSync("sw_vers -productVersion", {
      stdio: ["ignore", "pipe", "ignore"]
    }).toString("utf8").trim().split(".").slice(0, 2).join(".");
    let arm64 = false;

    if (!macVersion.startsWith("10.")) {
      arm64 = child_process_1.execSync("sysctl -in hw.optional.arm64", {
        stdio: ["ignore", "pipe", "ignore"]
      }).toString().trim() === "1";
    }

    const archSuffix = arm64 ? "-arm64" : "";
    return `mac${macVersion}${archSuffix}`;
  }

  if (platform === "linux") {
    const ubuntuVersion = ubuntuVersion_1.getUbuntuVersionSync();
    if (parseInt(ubuntuVersion, 10) <= 19) return "ubuntu18.04";
    return "ubuntu20.04";
  }

  if (platform === "win32") return os.arch() === "x64" ? "win64" : "win32";
  return platform;
})();

function linuxLddDirectories(browserPath, browser) {
  if (browser.name === "chromium") return [path.join(browserPath, "chrome-linux")];
  if (browser.name === "firefox") return [path.join(browserPath, "firefox")];

  if (browser.name === "webkit") {
    return [path.join(browserPath, "minibrowser-gtk"), path.join(browserPath, "minibrowser-gtk", "bin"), path.join(browserPath, "minibrowser-gtk", "lib"), path.join(browserPath, "minibrowser-wpe"), path.join(browserPath, "minibrowser-wpe", "bin"), path.join(browserPath, "minibrowser-wpe", "lib")];
  }

  return [];
}

exports.linuxLddDirectories = linuxLddDirectories;

function windowsExeAndDllDirectories(browserPath, browser) {
  if (browser.name === "chromium") return [path.join(browserPath, "chrome-win")];
  if (browser.name === "firefox") return [path.join(browserPath, "firefox")];
  if (browser.name === "webkit") return [browserPath];
  return [];
}

exports.windowsExeAndDllDirectories = windowsExeAndDllDirectories;

function executablePath(browserPath, browser) {
  let tokens;

  if (browser.name === "chromium") {
    tokens = new Map([["ubuntu18.04", ["chrome-linux", "chrome"]], ["ubuntu20.04", ["chrome-linux", "chrome"]], ["mac10.13", ["chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"]], ["mac10.14", ["chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"]], ["mac10.15", ["chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"]], ["mac11.0", ["chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"]], ["mac11.0-arm64", ["chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"]], ["mac11.1", ["chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"]], ["mac11.1-arm64", ["chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"]], ["win32", ["chrome-win", "chrome.exe"]], ["win64", ["chrome-win", "chrome.exe"]]]).get(exports.hostPlatform);
  }

  if (browser.name === "firefox") {
    tokens = new Map([["ubuntu18.04", ["firefox", "firefox"]], ["ubuntu20.04", ["firefox", "firefox"]], ["mac10.13", ["firefox", "Nightly.app", "Contents", "MacOS", "firefox"]], ["mac10.14", ["firefox", "Nightly.app", "Contents", "MacOS", "firefox"]], ["mac10.15", ["firefox", "Nightly.app", "Contents", "MacOS", "firefox"]], ["mac11.0", ["firefox", "Nightly.app", "Contents", "MacOS", "firefox"]], ["mac11.0-arm64", ["firefox", "Nightly.app", "Contents", "MacOS", "firefox"]], ["mac11.1", ["firefox", "Nightly.app", "Contents", "MacOS", "firefox"]], ["mac11.1-arm64", ["firefox", "Nightly.app", "Contents", "MacOS", "firefox"]], ["win32", ["firefox", "firefox.exe"]], ["win64", ["firefox", "firefox.exe"]]]).get(exports.hostPlatform);
  }

  if (browser.name === "webkit") {
    tokens = new Map([["ubuntu18.04", ["pw_run.sh"]], ["ubuntu20.04", ["pw_run.sh"]], ["mac10.13", undefined], ["mac10.14", ["pw_run.sh"]], ["mac10.15", ["pw_run.sh"]], ["mac11.0", ["pw_run.sh"]], ["mac11.0-arm64", ["pw_run.sh"]], ["mac11.1", ["pw_run.sh"]], ["mac11.1-arm64", ["pw_run.sh"]], ["win32", ["Playwright.exe"]], ["win64", ["Playwright.exe"]]]).get(exports.hostPlatform);
  }

  return tokens ? path.join(browserPath, ...tokens) : undefined;
}

exports.executablePath = executablePath;

function cacheDirectory() {
  const platform = os.platform();
  if (platform === "linux") return process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache");
  if (platform === "darwin") return path.join(os.homedir(), "Library", "Caches");
  if (platform === "win32") return process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
  throw new Error("Unsupported platform: " + platform);
}

const defaultBrowsersPath = (() => {
  const envDefined = 0; // const envDefined = utils_1.getFromENV("PLAYWRIGHT_BROWSERS_PATH");

  if (envDefined === "0") return undefined;
  return envDefined || path.join(cacheDirectory(), "ms-playwright");
})();

function browsersPath(packagePath) {
  return defaultBrowsersPath || path.join(packagePath, ".local-browsers");
}

exports.browsersPath = browsersPath;

function browserDirectory(browsersPath, browser) {
  return path.join(browsersPath, `${browser.name}-${browser.revision}`);
}

exports.browserDirectory = browserDirectory;

function markerFilePath(browsersPath, browser) {
  return path.join(browserDirectory(browsersPath, browser), "INSTALLATION_COMPLETE");
}

exports.markerFilePath = markerFilePath;

function isBrowserDirectory(browserPath) {
  const baseName = path.basename(browserPath);
  return baseName.startsWith("chromium-") || baseName.startsWith("firefox-") || baseName.startsWith("webkit-");
}

exports.isBrowserDirectory = isBrowserDirectory;

/***/ }),

/***/ "./src/lib/utils/ubuntuVersion.js":
/*!****************************************!*\
  !*** ./src/lib/utils/ubuntuVersion.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/**
 * Copyright 2017 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getUbuntuVersionSync = exports.getUbuntuVersion = void 0;

const fs = __webpack_require__(/*! fs */ "fs");

const os = __webpack_require__(/*! os */ "os");

const util = __webpack_require__(/*! util */ "util");

const readFileAsync = util.promisify(fs.readFile.bind(fs));

async function getUbuntuVersion() {
  if (os.platform() !== 'linux') return '';
  const osReleaseText = await readFileAsync('/etc/os-release', 'utf8').catch(e => '');
  if (!osReleaseText) return '';
  return getUbuntuVersionInternal(osReleaseText);
}

exports.getUbuntuVersion = getUbuntuVersion;

function getUbuntuVersionSync() {
  if (os.platform() !== 'linux') return '';

  try {
    const osReleaseText = fs.readFileSync('/etc/os-release', 'utf8');
    if (!osReleaseText) return '';
    return getUbuntuVersionInternal(osReleaseText);
  } catch (e) {
    return '';
  }
}

exports.getUbuntuVersionSync = getUbuntuVersionSync;

function getUbuntuVersionInternal(osReleaseText) {
  const fields = new Map();

  for (const line of osReleaseText.split('\n')) {
    const tokens = line.split('=');
    const name = tokens.shift();
    let value = tokens.join('=').trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
    if (!name) continue;
    fields.set(name.toLowerCase(), value);
  }

  if (!fields.get('name') || fields.get('name').toLowerCase() !== 'ubuntu') return '';
  return fields.get('version_id') || '';
}

/***/ }),

/***/ "./src/lib/utils/utils.js":
/*!********************************!*\
  !*** ./src/lib/utils/utils.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "process/browser");

/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.createGuid = exports.calculateSha1 = exports.monotonicTime = exports.headersArrayToObject = exports.headersObjectToArray = exports.mkdirIfNeeded = exports.getAsBooleanFromENV = exports.getFromENV = exports.isUnderTest = exports.setUnderTest = exports.isDebugMode = exports.isError = exports.isObject = exports.isRegExp = exports.isString = exports.debugAssert = exports.assert = exports.makeWaitForNextTask = void 0;

const path = __webpack_require__(/*! path */ "path");

const fs = __webpack_require__(/*! fs */ "fs");

const util = __webpack_require__(/*! util */ "util");

const crypto = __webpack_require__(/*! crypto */ "crypto");

const mkdirAsync = util.promisify(fs.mkdir.bind(fs)); // See https://joel.tools/microtasks/

function makeWaitForNextTask() {
  if (parseInt(process.versions.node, 10) >= 11) return setImmediate; // Unlike Node 11, Node 10 and less have a bug with Task and MicroTask execution order:
  // - https://github.com/nodejs/node/issues/22257
  //
  // So we can't simply run setImmediate to dispatch code in a following task.
  // However, we can run setImmediate from-inside setImmediate to make sure we're getting
  // in the following task.

  let spinning = false;
  const callbacks = [];

  const loop = () => {
    const callback = callbacks.shift();

    if (!callback) {
      spinning = false;
      return;
    }

    setImmediate(loop); // Make sure to call callback() as the last thing since it's
    // untrusted code that might throw.

    callback();
  };

  return callback => {
    callbacks.push(callback);

    if (!spinning) {
      spinning = true;
      setImmediate(loop);
    }
  };
}

exports.makeWaitForNextTask = makeWaitForNextTask;

function assert(value, message) {
  if (!value) throw new Error(message);
}

exports.assert = assert;

function debugAssert(value, message) {
  if (isUnderTest() && !value) throw new Error(message);
}

exports.debugAssert = debugAssert;

function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

exports.isString = isString;

function isRegExp(obj) {
  return obj instanceof RegExp || Object.prototype.toString.call(obj) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

exports.isObject = isObject;

function isError(obj) {
  return obj instanceof Error || obj && obj.__proto__ && obj.__proto__.name === 'Error';
}

exports.isError = isError;
const isInDebugMode = !!getFromENV('PWDEBUG');

function isDebugMode() {
  return isInDebugMode;
}

exports.isDebugMode = isDebugMode;
let _isUnderTest = false;

function setUnderTest() {
  _isUnderTest = true;
}

exports.setUnderTest = setUnderTest;

function isUnderTest() {
  return _isUnderTest;
}

exports.isUnderTest = isUnderTest;

function getFromENV(name) {
  let value = process.env[name];
  value = value === undefined ? process.env[`npm_config_${name.toLowerCase()}`] : value;
  value = value === undefined ? process.env[`npm_package_config_${name.toLowerCase()}`] : value;
  return value;
}

exports.getFromENV = getFromENV;

function getAsBooleanFromENV(name) {
  const value = getFromENV(name);
  return !!value && value !== 'false' && value !== '0';
}

exports.getAsBooleanFromENV = getAsBooleanFromENV;

async function mkdirIfNeeded(filePath) {
  // This will harmlessly throw on windows if the dirname is the root directory.
  await mkdirAsync(path.dirname(filePath), {
    recursive: true
  }).catch(() => {});
}

exports.mkdirIfNeeded = mkdirIfNeeded;

function headersObjectToArray(headers) {
  const result = [];

  for (const name in headers) {
    if (!Object.is(headers[name], undefined)) result.push({
      name,
      value: headers[name]
    });
  }

  return result;
}

exports.headersObjectToArray = headersObjectToArray;

function headersArrayToObject(headers, lowerCase) {
  const result = {};

  for (const {
    name,
    value
  } of headers) result[lowerCase ? name.toLowerCase() : name] = value;

  return result;
}

exports.headersArrayToObject = headersArrayToObject;

function monotonicTime() {
  const [seconds, nanoseconds] = process.hrtime();
  return seconds * 1000 + (nanoseconds / 1000 | 0) / 1000;
}

exports.monotonicTime = monotonicTime;

function calculateSha1(buffer) {
  const hash = crypto.createHash('sha1');
  hash.update(buffer);
  return hash.digest('hex');
}

exports.calculateSha1 = calculateSha1;

function createGuid() {
  return crypto.randomBytes(16).toString('hex');
}

exports.createGuid = createGuid; // # sourceMappingURL=utils.js.map

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");;

/***/ }),

/***/ "console-browserify":
/*!*************************************!*\
  !*** external "console-browserify" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("console-browserify");;

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");;

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");;

/***/ }),

/***/ "extract-zip":
/*!******************************!*\
  !*** external "extract-zip" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("extract-zip");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");;

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");;

/***/ }),

/***/ "https-proxy-agent":
/*!************************************!*\
  !*** external "https-proxy-agent" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("https-proxy-agent");;

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");;

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");;

/***/ }),

/***/ "playwright-core":
/*!**********************************!*\
  !*** external "playwright-core" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("playwright-core");;

/***/ }),

/***/ "process/browser":
/*!**********************************!*\
  !*** external "process/browser" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("process/browser");;

/***/ }),

/***/ "progress":
/*!***************************!*\
  !*** external "progress" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("progress");;

/***/ }),

/***/ "proper-lockfile":
/*!**********************************!*\
  !*** external "proper-lockfile" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("proper-lockfile");;

/***/ }),

/***/ "proxy-from-env":
/*!*********************************!*\
  !*** external "proxy-from-env" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("proxy-from-env");;

/***/ }),

/***/ "rimraf":
/*!*************************!*\
  !*** external "rimraf" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("rimraf");;

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");;

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.js");
/******/ })()
;
});
//# sourceMappingURL=main.js.map