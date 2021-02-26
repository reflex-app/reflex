!function webpackUniversalModuleDefinition(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.electronPlaywrightBrowserInstaller=r():e.electronPlaywrightBrowserInstaller=r()}(this,(function(){return(()=>{"use strict";var e={391:(e,r,i)=>{i.r(r),i.d(r,{Installer:()=>f,getPackagedPlaywrightExecPath:()=>getPackagedPlaywrightExecPath});var t=i(747);const o=require("playwright-core");var n=i.n(o),s=i(312),a=i(481),c=i(906);function _defineProperties(e,r){for(var i=0;i<r.length;i++){var t=r[i];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}const u="electron-playwright-browser-installer",m=["log","error","info"];if(a.log){const generator=e=>{const r=a[e];a[e]=function(){Array.prototype.unshift.call(arguments,`${u.toUpperCase()}:`),r.apply(this,arguments)}};m.map(generator)}const{installBrowsersWithProgressBar:l}=i(399);let f=function(){function Installer(e={}){!function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,Installer),e=e||{},this.browsers=e.browsers||["chromium","firefox","webkit"]}return function _createClass(e,r,i){return r&&_defineProperties(e.prototype,r),i&&_defineProperties(e,i),e}(Installer,[{key:"run",value:async function run(){await this.checkIfInstalled()?a.log("Browsers are installed."):(a.log("Browsers are NOT installed!"),await this.install())}},{key:"checkIfInstalled",value:function checkIfInstalled(e){return a.log("Checking if browsers are installed..."),!1}},{key:"install",value:async function install(e={browsers:this.browsers}){if(a.warn("Env var PLAYWRIGHT_BROWSERS_PATH is missing or incorrect"),!e.browsers.length)return a.error("No browsers were passed in to install"),!1;for(const r of e.browsers)a.log(`Path: ${n()[r].executablePath()}`);s.J.on("progress",(({current:e,total:r,name:i})=>{const t=`Downloading ${i} - ${e}/${r}`;a.log(t)})),s.J.on("done",(async()=>{})),await l(__dirname).catch((e=>{a.error(`Failed to install browsers, caused by\n${e.stack}`),c.exit(1)}));return!0===await(async()=>{const r=await async function ls(e){try{const r=[],i=await t.promises.opendir(e);for await(const e of i)r.push(e.name);return r}catch(e){return a.error(e),!1}}(`${__dirname}/.local-browsers`),{browsers:i}=e;return i.every((e=>r.find((r=>r.includes(e)))))})()?(a.log("Browsers are installed."),!0):(a.error("Browsers are NOT installed!"),!1)}}]),Installer}();function getPackagedPlaywrightExecPath(e){e||a.error("No browser name given.");const r=n()[e].executablePath(),i=function replaceAll(e,r){const i=new RegExp(Object.keys(r).join("|"),"gi");return e.replace(i,(function(e){return r[e.toLowerCase()]}))}(r,{playwright:"electron-playwright-browser-installer","app.asar":"app.asar.unpacked"});return a.log("Is the path the same as initially?",r===i,`Changed to: ${i}`),i}},312:(e,r,i)=>{i.d(r,{J:()=>n});var t=i(481);const{EventEmitter:o}=i(614),n=new o;n.on("progress",(async({current:e,total:r,name:i})=>{const o=`Downloading ${i} - ${e}/${r}`;t.log(o)})),n.on("done",(async()=>{}))},772:(e,r,i)=>{i.r(r),i.d(r,{downloadBrowserWithProgressBar:()=>downloadBrowserWithProgressBar,logPolitely:()=>logPolitely});var t=i(312),o=i(481),n=i(906);Object.defineProperty(r,"__esModule",{value:!0}),exports.logPolitely=exports.downloadBrowserWithProgressBar=void 0;const s=i(882),a=i(747),c=i(87),u=i(622),m=(i(7),i(925)),l=i(835),f=i(669),p=i(727),w=i(313),d=i(949),h=f.promisify(a.unlink.bind(a)),b=f.promisify(a.chmod.bind(a)),existsAsync=e=>new Promise((r=>a.stat(e,(e=>r(!e))))),g=792639;function revisionURL(e,r=w.hostPlatform){const i=parseInt(e.revision,10),t=function getDownloadHost(e,r){const i="chromium"===e&&r<g?"https://storage.googleapis.com":"https://playwright.azureedge.net";return p.getFromENV({chromium:"PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST",firefox:"PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST",webkit:"PLAYWRIGHT_WEBKIT_DOWNLOAD_HOST"}[e])||p.getFromENV("PLAYWRIGHT_DOWNLOAD_HOST")||i}(e.name,i),o=function getDownloadUrl(e,r,i){if("chromium"===e)return r<g?new Map([["ubuntu18.04","%s/chromium-browser-snapshots/Linux_x64/%d/chrome-linux.zip"],["ubuntu20.04","%s/chromium-browser-snapshots/Linux_x64/%d/chrome-linux.zip"],["mac10.13","%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],["mac10.14","%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],["mac10.15","%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],["mac11.0","%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],["mac11.1","%s/chromium-browser-snapshots/Mac/%d/chrome-mac.zip"],["win32","%s/chromium-browser-snapshots/Win/%d/chrome-win.zip"],["win64","%s/chromium-browser-snapshots/Win_x64/%d/chrome-win.zip"]]).get(i):new Map([["ubuntu18.04","%s/builds/chromium/%s/chromium-linux.zip"],["ubuntu20.04","%s/builds/chromium/%s/chromium-linux.zip"],["mac10.13","%s/builds/chromium/%s/chromium-mac.zip"],["mac10.14","%s/builds/chromium/%s/chromium-mac.zip"],["mac10.15","%s/builds/chromium/%s/chromium-mac.zip"],["mac11.0","%s/builds/chromium/%s/chromium-mac.zip"],["mac11.0-arm64","%s/builds/chromium/%s/chromium-mac-arm64.zip"],["mac11.1","%s/builds/chromium/%s/chromium-mac.zip"],["mac11.1-arm64","%s/builds/chromium/%s/chromium-mac-arm64.zip"],["win32","%s/builds/chromium/%s/chromium-win32.zip"],["win64","%s/builds/chromium/%s/chromium-win64.zip"]]).get(i);if("firefox"===e)return r<1140?new Map([["ubuntu18.04","%s/builds/firefox/%s/firefox-linux.zip"],["ubuntu20.04","%s/builds/firefox/%s/firefox-linux.zip"],["mac10.13","%s/builds/firefox/%s/firefox-mac.zip"],["mac10.14","%s/builds/firefox/%s/firefox-mac.zip"],["mac10.15","%s/builds/firefox/%s/firefox-mac.zip"],["mac11.0","%s/builds/firefox/%s/firefox-mac.zip"],["mac11.1","%s/builds/firefox/%s/firefox-mac.zip"],["win32","%s/builds/firefox/%s/firefox-win32.zip"],["win64","%s/builds/firefox/%s/firefox-win64.zip"]]).get(i):new Map([["ubuntu18.04","%s/builds/firefox/%s/firefox-ubuntu-18.04.zip"],["ubuntu20.04","%s/builds/firefox/%s/firefox-ubuntu-18.04.zip"],["mac10.13","%s/builds/firefox/%s/firefox-mac-10.14.zip"],["mac10.14","%s/builds/firefox/%s/firefox-mac-10.14.zip"],["mac10.15","%s/builds/firefox/%s/firefox-mac-10.14.zip"],["mac11.0","%s/builds/firefox/%s/firefox-mac-10.14.zip"],["mac11.0-arm64","%s/builds/firefox/%s/firefox-mac-10.14.zip"],["mac11.1","%s/builds/firefox/%s/firefox-mac-10.14.zip"],["mac11.1-arm64","%s/builds/firefox/%s/firefox-mac-10.14.zip"],["win32","%s/builds/firefox/%s/firefox-win32.zip"],["win64","%s/builds/firefox/%s/firefox-win64.zip"]]).get(i);if("webkit"===e)return r<1317?new Map([["ubuntu18.04","%s/builds/webkit/%s/minibrowser-gtk-wpe.zip"],["ubuntu20.04","%s/builds/webkit/%s/minibrowser-gtk-wpe.zip"],["mac10.13",void 0],["mac10.14","%s/builds/webkit/%s/minibrowser-mac-10.14.zip"],["mac10.15","%s/builds/webkit/%s/minibrowser-mac-10.15.zip"],["mac11.0","%s/builds/webkit/%s/minibrowser-mac-10.15.zip"],["mac11.1","%s/builds/webkit/%s/minibrowser-mac-10.15.zip"],["win32","%s/builds/webkit/%s/minibrowser-win64.zip"],["win64","%s/builds/webkit/%s/minibrowser-win64.zip"]]).get(i):new Map([["ubuntu18.04","%s/builds/webkit/%s/webkit-ubuntu-18.04.zip"],["ubuntu20.04","%s/builds/webkit/%s/webkit-ubuntu-20.04.zip"],["mac10.13",void 0],["mac10.14","%s/builds/webkit/%s/webkit-mac-10.14.zip"],["mac10.15","%s/builds/webkit/%s/webkit-mac-10.15.zip"],["mac11.0","%s/builds/webkit/%s/webkit-mac-10.15.zip"],["mac11.0-arm64","%s/builds/webkit/%s/webkit-mac-11.0-arm64.zip"],["mac11.1","%s/builds/webkit/%s/webkit-mac-10.15.zip"],["mac11.1-arm64","%s/builds/webkit/%s/webkit-mac-11.0-arm64.zip"],["win32","%s/builds/webkit/%s/webkit-win64.zip"],["win64","%s/builds/webkit/%s/webkit-win64.zip"]]).get(i)}(e.name,i,r);return p.assert(o,`ERROR: Playwright does not support ${e.name} on ${r}`),f.format(o,t,e.revision)}async function downloadBrowserWithProgressBar(e,r){const i=w.browserDirectory(e,r),m=`${r.name} v${r.revision}`;if(await existsAsync(i))return!1;const l=revisionURL(r),f=u.join(c.tmpdir(),`playwright-download-${r.name}-${w.hostPlatform}-${r.revision}.zip`);try{await function downloadFile(e,r,i){let fulfill=()=>{},reject=()=>{},t=0,o=0;const n=new Promise(((e,r)=>{fulfill=e,reject=r}));return httpRequest(e,"GET",(t=>{if(t.statusCode!==200){const r=new Error(`Download failed: server returned code ${t.statusCode}. URL: ${e}`);t.resume();reject(r);return}const n=a.createWriteStream(r);n.on("finish",(()=>fulfill()));n.on("error",(e=>reject(e)));t.pipe(n);o=parseInt(t.headers["content-length"],10);if(i)t.on("data",onData)})).on("error",(e=>reject(e))),n;function onData(e){t+=e.length,i(t,o)}}(l,f,(function progress(e,r){const i=e-0;if(t.J.emit("progress",{name:m,delta:i,current:toMegabytes(e),total:toMegabytes(r)}),e===r){const e=`${m} installed.`;t.J.emit("done",e),o.log(e)}})),await s(f,{dir:i}),await b(w.executablePath(i,r),493)}catch(e){throw n.exitCode=1,e}finally{await existsAsync(f)&&await h(f)}return logPolitely(`${m} downloaded to ${i}`),!0}function toMegabytes(e){const r=e/1024/1024;return Math.round(10*r)/10+" Mb"}function httpRequest(e,r,t){let o=l.parse(e);o.method=r;const n=m.getProxyForUrl(e);if(n)if(e.startsWith("http:")){const e=l.parse(n);o={path:o.href,host:e.hostname,port:e.port}}else{const e=l.parse(n);e.secureProxy="https:"===e.protocol,o.agent=new d(e),o.rejectUnauthorized=!1}const requestCallback=e=>{e.statusCode>=300&&e.statusCode<400&&e.headers.location?httpRequest(e.headers.location,r,t):t(e)},s="https:"===o.protocol?i(211).request(o,requestCallback):i(605).request(o,requestCallback);return s.end(),s}function logPolitely(e){const r=n.env.npm_config_loglevel;["silent","error","warn"].indexOf(r||"")>-1||o.log(e)}},399:(e,r,i)=>{i.r(r),i.d(r,{installBrowsersWithProgressBar:()=>installBrowsersWithProgressBar,validateCache:()=>validateCache,readBrowsersToDownload:()=>readBrowsersToDownload});var t=i(481);Object.defineProperty(r,"__esModule",{value:!0});const o=i(417),n=i(747),s=i(622),a=i(669),c=i(192),u=i(183),m=i(313),l=i(727),f=i(772),p=a.promisify(n.mkdir.bind(n)),w=a.promisify(n.readdir.bind(n)),d=a.promisify(n.readFile.bind(n)),h=a.promisify(n.unlink.bind(n)),b=a.promisify(n.writeFile.bind(n)),g=a.promisify(c);async function installBrowsersWithProgressBar(e){if(t.error("Missing or incorrect PLAYWRIGHT_BROWSERS_PATH env"),l.getAsBooleanFromENV("PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD"))return f.logPolitely("Skipping browsers download because `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` env variable is set"),!1;const r=m.browsersPath(e);await p(r,{recursive:!0});const i=s.join(r,"__dirlock"),n=await u.lock(r,{retries:{retries:10,factor:1.27579},onCompromised:e=>{throw new Error(`${e.message} Path: ${i}`)},lockfilePath:i}),a=s.join(r,".links");await p(a,{recursive:!0}),await b(s.join(a,function sha1(e){const r=o.createHash("sha1");return r.update(e),r.digest("hex")}(e)),e),await validateCache(e,r,a),await n()}async function validateCache(e,r,i){const t=new Set;for(const e of await w(i)){const n=s.join(i,e);let a="";try{a=(await d(n)).toString();const e=await readBrowsersToDownload(a);for(const i of e){const e=m.browserDirectory(r,i),n=parseInt(i.revision,10);("chromium"===i.name&&n>=786218||"firefox"===i.name&&n>=1128||"webkit"===i.name&&n>=1307)&&!await(o=m.markerFilePath(r,i),d(o).then((()=>!0)).catch((e=>!1)))||t.add(e)}}catch(e){a&&f.logPolitely("Failed to process descriptor at "+a),await h(n).catch((e=>{}))}}var o;let n=(await w(r)).map((e=>s.join(r,e)));n=n.filter((e=>m.isBrowserDirectory(e)));const a=new Set(n);for(const e of t)a.delete(e);for(const e of a)f.logPolitely("Removing unused browser at "+e),await g(e).catch((e=>{}));const c=await readBrowsersToDownload(e);for(const e of c)await f.downloadBrowserWithProgressBar(r,e),await b(m.markerFilePath(r,e),"")}async function readBrowsersToDownload(e){return JSON.parse((await d(s.join(e,"browsers.json"))).toString()).browsers.filter((e=>!1!==e.download))}},313:(e,r,i)=>{var t=i(906);Object.defineProperty(r,"__esModule",{value:!0}),r.isBrowserDirectory=r.markerFilePath=r.browserDirectory=r.browsersPath=r.executablePath=r.windowsExeAndDllDirectories=r.linuxLddDirectories=r.hostPlatform=void 0;const o=i(129),n=i(87),s=i(622),a=i(967);i(727);r.hostPlatform=(()=>{const e=n.platform();if("darwin"===e){const e=o.execSync("sw_vers -productVersion",{stdio:["ignore","pipe","ignore"]}).toString("utf8").trim().split(".").slice(0,2).join(".");let r=!1;e.startsWith("10.")||(r="1"===o.execSync("sysctl -in hw.optional.arm64",{stdio:["ignore","pipe","ignore"]}).toString().trim());return`mac${e}${r?"-arm64":""}`}if("linux"===e){const e=a.getUbuntuVersionSync();return parseInt(e,10)<=19?"ubuntu18.04":"ubuntu20.04"}return"win32"===e?"x64"===n.arch()?"win64":"win32":e})(),r.linuxLddDirectories=function linuxLddDirectories(e,r){return"chromium"===r.name?[s.join(e,"chrome-linux")]:"firefox"===r.name?[s.join(e,"firefox")]:"webkit"===r.name?[s.join(e,"minibrowser-gtk"),s.join(e,"minibrowser-gtk","bin"),s.join(e,"minibrowser-gtk","lib"),s.join(e,"minibrowser-wpe"),s.join(e,"minibrowser-wpe","bin"),s.join(e,"minibrowser-wpe","lib")]:[]},r.windowsExeAndDllDirectories=function windowsExeAndDllDirectories(e,r){return"chromium"===r.name?[s.join(e,"chrome-win")]:"firefox"===r.name?[s.join(e,"firefox")]:"webkit"===r.name?[e]:[]},r.executablePath=function executablePath(e,i){let t;return"chromium"===i.name&&(t=new Map([["ubuntu18.04",["chrome-linux","chrome"]],["ubuntu20.04",["chrome-linux","chrome"]],["mac10.13",["chrome-mac","Chromium.app","Contents","MacOS","Chromium"]],["mac10.14",["chrome-mac","Chromium.app","Contents","MacOS","Chromium"]],["mac10.15",["chrome-mac","Chromium.app","Contents","MacOS","Chromium"]],["mac11.0",["chrome-mac","Chromium.app","Contents","MacOS","Chromium"]],["mac11.0-arm64",["chrome-mac","Chromium.app","Contents","MacOS","Chromium"]],["mac11.1",["chrome-mac","Chromium.app","Contents","MacOS","Chromium"]],["mac11.1-arm64",["chrome-mac","Chromium.app","Contents","MacOS","Chromium"]],["win32",["chrome-win","chrome.exe"]],["win64",["chrome-win","chrome.exe"]]]).get(r.hostPlatform)),"firefox"===i.name&&(t=new Map([["ubuntu18.04",["firefox","firefox"]],["ubuntu20.04",["firefox","firefox"]],["mac10.13",["firefox","Nightly.app","Contents","MacOS","firefox"]],["mac10.14",["firefox","Nightly.app","Contents","MacOS","firefox"]],["mac10.15",["firefox","Nightly.app","Contents","MacOS","firefox"]],["mac11.0",["firefox","Nightly.app","Contents","MacOS","firefox"]],["mac11.0-arm64",["firefox","Nightly.app","Contents","MacOS","firefox"]],["mac11.1",["firefox","Nightly.app","Contents","MacOS","firefox"]],["mac11.1-arm64",["firefox","Nightly.app","Contents","MacOS","firefox"]],["win32",["firefox","firefox.exe"]],["win64",["firefox","firefox.exe"]]]).get(r.hostPlatform)),"webkit"===i.name&&(t=new Map([["ubuntu18.04",["pw_run.sh"]],["ubuntu20.04",["pw_run.sh"]],["mac10.13",void 0],["mac10.14",["pw_run.sh"]],["mac10.15",["pw_run.sh"]],["mac11.0",["pw_run.sh"]],["mac11.0-arm64",["pw_run.sh"]],["mac11.1",["pw_run.sh"]],["mac11.1-arm64",["pw_run.sh"]],["win32",["Playwright.exe"]],["win64",["Playwright.exe"]]]).get(r.hostPlatform)),t?s.join(e,...t):void 0};const c=s.join(function cacheDirectory(){const e=n.platform();if("linux"===e)return t.env.XDG_CACHE_HOME||s.join(n.homedir(),".cache");if("darwin"===e)return s.join(n.homedir(),"Library","Caches");if("win32"===e)return t.env.LOCALAPPDATA||s.join(n.homedir(),"AppData","Local");throw new Error("Unsupported platform: "+e)}(),"ms-playwright");function browserDirectory(e,r){return s.join(e,`${r.name}-${r.revision}`)}r.browsersPath=function browsersPath(e){return c||s.join(e,".local-browsers")},r.browserDirectory=browserDirectory,r.markerFilePath=function markerFilePath(e,r){return s.join(browserDirectory(e,r),"INSTALLATION_COMPLETE")},r.isBrowserDirectory=function isBrowserDirectory(e){const r=s.basename(e);return r.startsWith("chromium-")||r.startsWith("firefox-")||r.startsWith("webkit-")}},967:(e,r,i)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.getUbuntuVersionSync=r.getUbuntuVersion=void 0;const t=i(747),o=i(87),n=i(669).promisify(t.readFile.bind(t));function getUbuntuVersionInternal(e){const r=new Map;for(const i of e.split("\n")){const e=i.split("="),t=e.shift();let o=e.join("=").trim();o.startsWith('"')&&o.endsWith('"')&&(o=o.substring(1,o.length-1)),t&&r.set(t.toLowerCase(),o)}return r.get("name")&&"ubuntu"===r.get("name").toLowerCase()&&r.get("version_id")||""}r.getUbuntuVersion=async function getUbuntuVersion(){if("linux"!==o.platform())return"";const e=await n("/etc/os-release","utf8").catch((e=>""));return e?getUbuntuVersionInternal(e):""},r.getUbuntuVersionSync=function getUbuntuVersionSync(){if("linux"!==o.platform())return"";try{const e=t.readFileSync("/etc/os-release","utf8");return e?getUbuntuVersionInternal(e):""}catch(e){return""}}},727:(e,r,i)=>{var t=i(906);Object.defineProperty(r,"__esModule",{value:!0}),r.createGuid=r.calculateSha1=r.monotonicTime=r.headersArrayToObject=r.headersObjectToArray=r.mkdirIfNeeded=r.getAsBooleanFromENV=r.getFromENV=r.isUnderTest=r.setUnderTest=r.isDebugMode=r.isError=r.isObject=r.isRegExp=r.isString=r.debugAssert=r.assert=r.makeWaitForNextTask=void 0;const o=i(622),n=i(747),s=i(669),a=i(417),c=s.promisify(n.mkdir.bind(n));r.makeWaitForNextTask=function makeWaitForNextTask(){if(parseInt(t.versions.node,10)>=11)return setImmediate;let e=!1;const r=[],loop=()=>{const i=r.shift();i?(setImmediate(loop),i()):e=!1};return i=>{r.push(i),e||(e=!0,setImmediate(loop))}},r.assert=function assert(e,r){if(!e)throw new Error(r)},r.debugAssert=function debugAssert(e,r){if(isUnderTest()&&!e)throw new Error(r)},r.isString=function isString(e){return"string"==typeof e||e instanceof String},r.isRegExp=function isRegExp(e){return e instanceof RegExp||"[object RegExp]"===Object.prototype.toString.call(e)},r.isObject=function isObject(e){return"object"==typeof e&&null!==e},r.isError=function isError(e){return e instanceof Error||e&&e.__proto__&&"Error"===e.__proto__.name};const u=!!getFromENV("PWDEBUG");r.isDebugMode=function isDebugMode(){return u};let m=!1;function isUnderTest(){return m}function getFromENV(e){let r=t.env[e];return r=void 0===r?t.env[`npm_config_${e.toLowerCase()}`]:r,r=void 0===r?t.env[`npm_package_config_${e.toLowerCase()}`]:r,r}r.setUnderTest=function setUnderTest(){m=!0},r.isUnderTest=isUnderTest,r.getFromENV=getFromENV,r.getAsBooleanFromENV=function getAsBooleanFromENV(e){const r=getFromENV(e);return!!r&&"false"!==r&&"0"!==r},r.mkdirIfNeeded=async function mkdirIfNeeded(e){await c(o.dirname(e),{recursive:!0}).catch((()=>{}))},r.headersObjectToArray=function headersObjectToArray(e){const r=[];for(const i in e)Object.is(e[i],void 0)||r.push({name:i,value:e[i]});return r},r.headersArrayToObject=function headersArrayToObject(e,r){const i={};for(const{name:t,value:o}of e)i[r?t.toLowerCase():t]=o;return i},r.monotonicTime=function monotonicTime(){const[e,r]=t.hrtime();return 1e3*e+(r/1e3|0)/1e3},r.calculateSha1=function calculateSha1(e){const r=a.createHash("sha1");return r.update(e),r.digest("hex")},r.createGuid=function createGuid(){return a.randomBytes(16).toString("hex")}},129:e=>{e.exports=require("child_process")},481:e=>{e.exports=require("console-browserify")},417:e=>{e.exports=require("crypto")},614:e=>{e.exports=require("events")},882:e=>{e.exports=require("extract-zip")},747:e=>{e.exports=require("fs")},605:e=>{e.exports=require("http")},211:e=>{e.exports=require("https")},949:e=>{e.exports=require("https-proxy-agent")},87:e=>{e.exports=require("os")},622:e=>{e.exports=require("path")},906:e=>{e.exports=require("process/browser")},7:e=>{e.exports=require("progress")},183:e=>{e.exports=require("proper-lockfile")},925:e=>{e.exports=require("proxy-from-env")},192:e=>{e.exports=require("rimraf")},835:e=>{e.exports=require("url")},669:e=>{e.exports=require("util")}},r={};function __webpack_require__(i){if(r[i])return r[i].exports;var t=r[i]={exports:{}};return e[i](t,t.exports,__webpack_require__),t.exports}return __webpack_require__.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(r,{a:r}),r},__webpack_require__.d=(e,r)=>{for(var i in r)__webpack_require__.o(r,i)&&!__webpack_require__.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:r[i]})},__webpack_require__.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__(391)})()}));
//# sourceMappingURL=main.js.map