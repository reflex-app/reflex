"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const _ffmpegExecutable = (exports.printDepsWindowsExecutable = void 0);
export { _ffmpegExecutable as ffmpegExecutable };
import { existsSync } from "fs";
import { arch } from "os";
import { join, dirname } from "path";

function printDepsWindowsExecutable() {
  return pathToExecutable(["bin", "PrintDeps.exe"]);
}

const _printDepsWindowsExecutable = printDepsWindowsExecutable;
export { _printDepsWindowsExecutable as printDepsWindowsExecutable };

function ffmpegExecutable() {
  let ffmpegName;
  if (process.platform === "win32")
    ffmpegName = arch() === "x64" ? "ffmpeg-win64.exe" : "ffmpeg-win32.exe";
  else if (process.platform === "darwin") ffmpegName = "ffmpeg-mac";
  else ffmpegName = "ffmpeg-linux";
  return pathToExecutable(["third_party", "ffmpeg", ffmpegName]);
}

const _ffmpegExecutable = ffmpegExecutable;
export { _ffmpegExecutable as ffmpegExecutable };

function pathToExecutable(relative) {
  const defaultPath = join(__dirname, "..", "..", ...relative);
  const localPath = join(
    dirname(process.argv[0]),
    relative[relative.length - 1]
  );
  try {
    if (existsSync(defaultPath)) return defaultPath;
  } catch (e) {}
  try {
    if (existsSync(localPath)) return localPath;
  } catch (e) {}
}
//# sourceMappingURL=binaryPaths.js.map
