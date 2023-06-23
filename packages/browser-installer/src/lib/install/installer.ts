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

import fs from 'fs'
import fsAsync from 'fs/promises'
import path from 'path'
import util from 'util'
import removeFolder from 'rimraf'
import lockfile from 'proper-lockfile'
import {
  Registry,
  allBrowserNames,
  isBrowserDirectory,
  BrowserName,
  registryDirectory,
} from '../utils/registry'
import * as browserFetcher from './browserFetcher'
import { getAsBooleanFromENV, calculateSha1 } from '../utils/utils'

const fsMkdirAsync = async (path: string, options: {}) => {
  try {
    return await fsAsync.mkdir(path, options)
  } catch (err) {
    console.error(err)
  }
}

const fsReaddirAsync = util.promisify(fs.readdir.bind(fs))
const fsReadFileAsync = util.promisify(fs.readFile.bind(fs))
const fsExistsAsync = (filePath: string) =>
  fsReadFileAsync(filePath)
    .then(() => true)
    .catch((e) => false)
const fsUnlinkAsync = util.promisify(fs.unlink.bind(fs))
const fsWriteFileAsync = util.promisify(fs.writeFile.bind(fs))
const removeFolderAsync = util.promisify(removeFolder)

const PACKAGE_PATH = path.join(__dirname, '..', '..', '..') // Path to the root of the package

export async function installBrowsersWithProgressBar(
  browserNames: BrowserName[] = allBrowserNames
) {
  // PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD should have a value of 0 or 1
  if (getAsBooleanFromENV('PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD')) {
    browserFetcher.logPolitely(
      'Skipping browsers download because `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` env variable is set'
    )
    return false
  }

  await fsMkdirAsync(registryDirectory, { recursive: true })

  const lockfilePath = path.join(registryDirectory, '__dirlock')
  const releaseLock = await lockfile.lock(registryDirectory, {
    retries: {
      retries: 10,
      // Retry 20 times during 10 minutes with
      // exponential back-off.
      // See documentation at: https://www.npmjs.com/package/retry#retrytimeoutsoptions
      factor: 1.27579,
    },
    onCompromised: (err: Error) => {
      throw new Error(`${err.message} Path: ${lockfilePath}`)
    },
    lockfilePath,
  })
  const linksDir = path.join(registryDirectory, '.links')

  try {
    await fsMkdirAsync(linksDir, { recursive: true })
    await fsWriteFileAsync(
      path.join(linksDir, calculateSha1(PACKAGE_PATH)),
      PACKAGE_PATH
    )
    await validateCache(linksDir, browserNames)
  } finally {
    await releaseLock()
  }
}

async function validateCache(linksDir: string, browserNames: BrowserName[]) {
  // 1. Collect used downloads and package descriptors.
  const usedBrowserPaths: Set<string> = new Set()
  for (const fileName of await fsReaddirAsync(linksDir)) {
    const linkPath = path.join(linksDir, fileName)
    let linkTarget = ''
    try {
      linkTarget = (await fsReadFileAsync(linkPath)).toString()
      const linkRegistry = new Registry(linkTarget)
      for (const browserName of allBrowserNames) {
        if (!linkRegistry.shouldDownload(browserName)) continue
        const usedBrowserPath = linkRegistry.browserDirectory(browserName)
        const browserRevision = linkRegistry.revision(browserName)
        // Old browser installations don't have marker file.
        const shouldHaveMarkerFile =
          (browserName === 'chromium' && browserRevision >= 786218) ||
          (browserName === 'firefox' && browserRevision >= 1128) ||
          (browserName === 'webkit' && browserRevision >= 1307) ||
          // All new applications have a marker file right away.
          (browserName !== 'firefox' &&
            browserName !== 'chromium' &&
            browserName !== 'webkit')
        if (
          !shouldHaveMarkerFile ||
          (await fsExistsAsync(markerFilePath(usedBrowserPath)))
        )
          usedBrowserPaths.add(usedBrowserPath)
      }
    } catch (e) {
      await fsUnlinkAsync(linkPath).catch((e) => {})
    }
  }

  // 2. Delete all unused browsers.
  let downloadedBrowsers = (await fsReaddirAsync(registryDirectory)).map(
    (file) => path.join(registryDirectory, file)
  )
  downloadedBrowsers = downloadedBrowsers.filter((file) =>
    isBrowserDirectory(file)
  )
  const directories = new Set<string>(downloadedBrowsers)
  for (const browserDirectory of usedBrowserPaths) {
    directories.delete(browserDirectory)
  }
  for (const directory of directories) {
    browserFetcher.logPolitely('Removing unused browser at ' + directory)
    await removeFolderAsync(directory).catch((e) => {})
  }

  // 3. Install missing browsers for this package.
  const myRegistry = new Registry(PACKAGE_PATH)
  for (const browserName of browserNames) {
    if (!myRegistry.shouldDownload(browserName)) continue
    await browserFetcher
      .downloadBrowserWithProgressBar(myRegistry, browserName)
      .catch((e) => {
        throw new Error(
          `Failed to download ${browserName}, caused by\n${e.stack}`
        )
      })
    await fsWriteFileAsync(
      markerFilePath(myRegistry.browserDirectory(browserName)),
      ''
    )
  }
}

function markerFilePath(browserDirectory: string): string {
  return path.join(browserDirectory, 'INSTALLATION_COMPLETE')
}
