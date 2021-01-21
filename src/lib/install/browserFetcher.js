"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPolitely = exports.downloadBrowserWithProgressBar = void 0;

/**
 * Attach to the EventEmitter
 * This allows us to stream the download progress
 */
import { downloadEmitter } from "../emitter";

const extract = require("extract-zip");
const fs = require("fs");
const os = require("os");
const path = require("path");
const ProgressBar = require("progress");
const proxy_from_env_1 = require("proxy-from-env");
const URL = require("url");
const util = require("util");
const utils_1 = require("../utils/utils");
const browserPaths = require("../utils/browserPaths");
// `https-proxy-agent` v5 is written in Typescript and exposes generated types.
// However, as of June 2020, its types are generated with tsconfig that enables
// `esModuleInterop` option.
//
// As a result, we can't depend on the package unless we enable the option
// for our codebase. Instead of doing this, we abuse "require" to import module
// without types.
const ProxyAgent = require("https-proxy-agent");
const unlinkAsync = util.promisify(fs.unlink.bind(fs));
const chmodAsync = util.promisify(fs.chmod.bind(fs));
const existsAsync = (path) =>
  new Promise((resolve) => fs.stat(path, (err) => resolve(!err)));
const CHROMIUM_MOVE_TO_AZURE_CDN_REVISION = 792639;
function getDownloadHost(browserName, revision) {
  // Only old chromium revisions are downloaded from gbucket.
  const defaultDownloadHost =
    browserName === "chromium" && revision < CHROMIUM_MOVE_TO_AZURE_CDN_REVISION
      ? "https://storage.googleapis.com"
      : "https://playwright.azureedge.net";
  const envDownloadHost = {
    chromium: "PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST",
    firefox: "PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST",
    webkit: "PLAYWRIGHT_WEBKIT_DOWNLOAD_HOST",
  };
  return (
    utils_1.getFromENV(envDownloadHost[browserName]) ||
    utils_1.getFromENV("PLAYWRIGHT_DOWNLOAD_HOST") ||
    defaultDownloadHost
  );
}
function getDownloadUrl(browserName, revision, platform) {
  if (browserName === "chromium") {
    return revision < CHROMIUM_MOVE_TO_AZURE_CDN_REVISION
      ? new Map([
          [
            "ubuntu18.04",
            "%s/chromium-browser-snapshots/Linux_x64/%d/chrome-linux.zip",
          ],
          [
            "ubuntu20.04",
            "%s/chromium-browser-snapshots/Linux_x64/%d/chrome-linux.zip",
          ],
          ["mac10.13", "%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],
          ["mac10.14", "%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],
          ["mac10.15", "%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],
          ["mac11.0", "%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],
          ["mac11.1", "%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],
          ["win32", "%s/chromium-browser-snapshots/Win/%d/chrome-win.zip"],
          ["win64", "%s/chromium-browser-snapshots/Win_x64/%d/chrome-win.zip"],
        ]).get(platform)
      : new Map([
          ["ubuntu18.04", "%s/builds/chromium/%s/chromium-linux.zip"],
          ["ubuntu20.04", "%s/builds/chromium/%s/chromium-linux.zip"],
          ["mac10.13", "%s/builds/chromium/%s/chromium-mac.zip"],
          ["mac10.14", "%s/builds/chromium/%s/chromium-mac.zip"],
          ["mac10.15", "%s/builds/chromium/%s/chromium-mac.zip"],
          ["mac11.0", "%s/builds/chromium/%s/chromium-mac.zip"],
          ["mac11.0-arm64", "%s/builds/chromium/%s/chromium-mac-arm64.zip"],
          ["mac11.1", "%s/builds/chromium/%s/chromium-mac.zip"],
          ["mac11.1-arm64", "%s/builds/chromium/%s/chromium-mac-arm64.zip"],
          ["win32", "%s/builds/chromium/%s/chromium-win32.zip"],
          ["win64", "%s/builds/chromium/%s/chromium-win64.zip"],
        ]).get(platform);
  }
  if (browserName === "firefox") {
    const FIREFOX_NORMALIZE_CDN_NAMES_REVISION = 1140;
    return revision < FIREFOX_NORMALIZE_CDN_NAMES_REVISION
      ? new Map([
          ["ubuntu18.04", "%s/builds/firefox/%s/firefox-linux.zip"],
          ["ubuntu20.04", "%s/builds/firefox/%s/firefox-linux.zip"],
          ["mac10.13", "%s/builds/firefox/%s/firefox-mac.zip"],
          ["mac10.14", "%s/builds/firefox/%s/firefox-mac.zip"],
          ["mac10.15", "%s/builds/firefox/%s/firefox-mac.zip"],
          ["mac11.0", "%s/builds/firefox/%s/firefox-mac.zip"],
          ["mac11.1", "%s/builds/firefox/%s/firefox-mac.zip"],
          ["win32", "%s/builds/firefox/%s/firefox-win32.zip"],
          ["win64", "%s/builds/firefox/%s/firefox-win64.zip"],
        ]).get(platform)
      : new Map([
          ["ubuntu18.04", "%s/builds/firefox/%s/firefox-ubuntu-18.04.zip"],
          ["ubuntu20.04", "%s/builds/firefox/%s/firefox-ubuntu-18.04.zip"],
          ["mac10.13", "%s/builds/firefox/%s/firefox-mac-10.14.zip"],
          ["mac10.14", "%s/builds/firefox/%s/firefox-mac-10.14.zip"],
          ["mac10.15", "%s/builds/firefox/%s/firefox-mac-10.14.zip"],
          ["mac11.0", "%s/builds/firefox/%s/firefox-mac-10.14.zip"],
          ["mac11.0-arm64", "%s/builds/firefox/%s/firefox-mac-10.14.zip"],
          ["mac11.1", "%s/builds/firefox/%s/firefox-mac-10.14.zip"],
          ["mac11.1-arm64", "%s/builds/firefox/%s/firefox-mac-10.14.zip"],
          ["win32", "%s/builds/firefox/%s/firefox-win32.zip"],
          ["win64", "%s/builds/firefox/%s/firefox-win64.zip"],
        ]).get(platform);
  }
  if (browserName === "webkit") {
    const WEBKIT_NORMALIZE_CDN_NAMES_REVISION = 1317;
    return revision < WEBKIT_NORMALIZE_CDN_NAMES_REVISION
      ? new Map([
          ["ubuntu18.04", "%s/builds/webkit/%s/minibrowser-gtk-wpe.zip"],
          ["ubuntu20.04", "%s/builds/webkit/%s/minibrowser-gtk-wpe.zip"],
          ["mac10.13", undefined],
          ["mac10.14", "%s/builds/webkit/%s/minibrowser-mac-10.14.zip"],
          ["mac10.15", "%s/builds/webkit/%s/minibrowser-mac-10.15.zip"],
          ["mac11.0", "%s/builds/webkit/%s/minibrowser-mac-10.15.zip"],
          ["mac11.1", "%s/builds/webkit/%s/minibrowser-mac-10.15.zip"],
          ["win32", "%s/builds/webkit/%s/minibrowser-win64.zip"],
          ["win64", "%s/builds/webkit/%s/minibrowser-win64.zip"],
        ]).get(platform)
      : new Map([
          ["ubuntu18.04", "%s/builds/webkit/%s/webkit-ubuntu-18.04.zip"],
          ["ubuntu20.04", "%s/builds/webkit/%s/webkit-ubuntu-20.04.zip"],
          ["mac10.13", undefined],
          ["mac10.14", "%s/builds/webkit/%s/webkit-mac-10.14.zip"],
          ["mac10.15", "%s/builds/webkit/%s/webkit-mac-10.15.zip"],
          ["mac11.0", "%s/builds/webkit/%s/webkit-mac-10.15.zip"],
          ["mac11.0-arm64", "%s/builds/webkit/%s/webkit-mac-11.0-arm64.zip"],
          ["mac11.1", "%s/builds/webkit/%s/webkit-mac-10.15.zip"],
          ["mac11.1-arm64", "%s/builds/webkit/%s/webkit-mac-11.0-arm64.zip"],
          ["win32", "%s/builds/webkit/%s/webkit-win64.zip"],
          ["win64", "%s/builds/webkit/%s/webkit-win64.zip"],
        ]).get(platform);
  }
}
function revisionURL(browser, platform = browserPaths.hostPlatform) {
  const revision = parseInt(browser.revision, 10);
  const serverHost = getDownloadHost(browser.name, revision);
  const urlTemplate = getDownloadUrl(browser.name, revision, platform);
  utils_1.assert(
    urlTemplate,
    `ERROR: Playwright does not support ${browser.name} on ${platform}`
  );
  return util.format(urlTemplate, serverHost, browser.revision);
}

export async function downloadBrowserWithProgressBar(browsersPath, browser) {
  const browserPath = browserPaths.browserDirectory(browsersPath, browser);
  const progressBarName = `${browser.name} v${browser.revision}`;
  if (await existsAsync(browserPath)) {
    // Already downloaded.
    return false;
  }
  let progressBar;
  let lastDownloadedBytes = 0;
  function progress(downloadedBytes, totalBytes) {
    const delta = downloadedBytes - lastDownloadedBytes;
    // if (!progressBar) {
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
    downloadEmitter.emit("progress", {
      name: progressBarName,
      delta: delta,
      current: toMegabytes(downloadedBytes),
      total: toMegabytes(totalBytes),
    });

    // Done!
    if (downloadedBytes === totalBytes) {
      const finalMsg = `${progressBarName} installed.`;
      downloadEmitter.emit("done", finalMsg);
      console.log(finalMsg);
    }
  }
  const url = revisionURL(browser);
  const zipPath = path.join(
    os.tmpdir(),
    `playwright-download-${browser.name}-${browserPaths.hostPlatform}-${browser.revision}.zip`
  );
  try {
    await downloadFile(url, zipPath, progress);
    await extract(zipPath, { dir: browserPath });
    await chmodAsync(browserPaths.executablePath(browserPath, browser), 0o755);
  } catch (e) {
    process.exitCode = 1;
    throw e;
  } finally {
    if (await existsAsync(zipPath)) await unlinkAsync(zipPath);
  }
  logPolitely(`${progressBarName} downloaded to ${browserPath}`);
  return true;
}
// exports.downloadBrowserWithProgressBar = downloadBrowserWithProgressBar;

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
  const request = httpRequest(url, "GET", (response) => {
    if (response.statusCode !== 200) {
      const error = new Error(
        `Download failed: server returned code ${response.statusCode}. URL: ${url}`
      );
      // consume response data to free up memory
      response.resume();
      reject(error);
      return;
    }
    const file = fs.createWriteStream(destinationPath);
    file.on("finish", () => fulfill());
    file.on("error", (error) => reject(error));
    response.pipe(file);
    totalBytes = parseInt(response.headers["content-length"], 10);
    if (progressCallback) response.on("data", onData);
  });
  request.on("error", (error) => reject(error));
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
    if (url.startsWith("http:")) {
      const proxy = URL.parse(proxyURL);
      options = {
        path: options.href,
        host: proxy.hostname,
        port: proxy.port,
      };
    } else {
      const parsedProxyURL = URL.parse(proxyURL);
      parsedProxyURL.secureProxy = parsedProxyURL.protocol === "https:";
      options.agent = new ProxyAgent(parsedProxyURL);
      options.rejectUnauthorized = false;
    }
  }
  const requestCallback = (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
      httpRequest(res.headers.location, method, response);
    else response(res);
  };
  const request =
    options.protocol === "https:"
      ? require("https").request(options, requestCallback)
      : require("http").request(options, requestCallback);
  request.end();
  return request;
}

export function logPolitely(toBeLogged) {
  const logLevel = process.env.npm_config_loglevel;
  const logLevelDisplay =
    ["silent", "error", "warn"].indexOf(logLevel || "") > -1;
  if (!logLevelDisplay) console.log(toBeLogged); // eslint-disable-line no-console
}
// exports.logPolitely = logPolitely;
//# sourceMappingURL=browserFetcher.js.map
