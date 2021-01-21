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
exports.getUbuntuVersionSync = exports.getUbuntuVersion = void 0;
const fs = require("fs");
const os = require("os");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile.bind(fs));
async function getUbuntuVersion() {
    if (os.platform() !== 'linux')
        return '';
    const osReleaseText = await readFileAsync('/etc/os-release', 'utf8').catch(e => '');
    if (!osReleaseText)
        return '';
    return getUbuntuVersionInternal(osReleaseText);
}
exports.getUbuntuVersion = getUbuntuVersion;
function getUbuntuVersionSync() {
    if (os.platform() !== 'linux')
        return '';
    try {
        const osReleaseText = fs.readFileSync('/etc/os-release', 'utf8');
        if (!osReleaseText)
            return '';
        return getUbuntuVersionInternal(osReleaseText);
    }
    catch (e) {
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
        if (value.startsWith('"') && value.endsWith('"'))
            value = value.substring(1, value.length - 1);
        if (!name)
            continue;
        fields.set(name.toLowerCase(), value);
    }
    if (!fields.get('name') || fields.get('name').toLowerCase() !== 'ubuntu')
        return '';
    return fields.get('version_id') || '';
}
//# sourceMappingURL=ubuntuVersion.js.map