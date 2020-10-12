const log = require("electron-log");
const { ipcMain, app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
// const isDev = process.argv.includes("ELECTRON_IS_DEV");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

export default function init(window) {
  let UPDATE_AVAILABLE = null;
  const win = window.webContents;

  function sendStatusToWindow(text) {
    win.send("message", text);
  }

  win.on("did-finish-load", () => {
    if (isDev) {
      sendStatusToWindow(
        "Not checking for updates in dev mode, triggering example instead."
      );
      win.send("DOWNLOAD_PROGRESS", "10");

      setTimeout(() => {
        win.send("DOWNLOAD_PROGRESS", "30");
      }, 3000);

      setTimeout(() => {
        win.send("DOWNLOAD_PROGRESS", "60");
      }, 5000);

      setTimeout(() => {
        win.send("DOWNLOAD_PROGRESS", "100");
      }, 7000);
    }

    // Check for updates
    if (!isDev) {
      autoUpdater.checkForUpdates();
      // autoUpdater.checkForUpdatesAndNotify()
    }
  });

  autoUpdater.on("checking-for-update", () => {
    log.info("checking for update");
    sendStatusToWindow("Checking for update...");
  });

  autoUpdater.on("update-not-available", info => {
    log.info("update not available");
    sendStatusToWindow("Update not available.");
    UPDATE_AVAILABLE = false;
  });

  // We can now know if there's an available update
  autoUpdater.on("update-available", info => {
    log.info("update available");
    sendStatusToWindow("Update available.");
    UPDATE_AVAILABLE = true;
  });

  // Tracking the progress
  // (All of this is sent to the renderer)
  autoUpdater.on("download-progress", progressObj => {
    let logMessage = "Download speed: " + progressObj.bytesPerSecond;
    logMessage = logMessage + " - Downloaded " + progressObj.percent + "%";
    logMessage =
      logMessage +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
    sendStatusToWindow(logMessage);

    // Send the current progress to our IPC window
    window.webContents.send("DOWNLOAD_PROGRESS", progressObj.percent);
  });

  /**
   * Downloaded!
   */
  autoUpdater.on("update-downloaded", info => {
    log.info("update downloaded");
    sendStatusToWindow("Update downloaded");
  });

  /**
   * Listen for user to click on the
   * install button --> install & restart
   */
  ipcMain.on("TRIGGER_INSTALL", () => {
    if (UPDATE_AVAILABLE === true) {
      setImmediate(() => {
        ensureSafeQuitAndInstall();
        autoUpdater.quitAndInstall(false);
      });
    } else {
      console.log("No update available");
    }
  });

  /**
   * Handle errors
   */
  autoUpdater.on("error", err => {
    log.info("error in auto-updater");
    sendStatusToWindow("Error in auto-updater. " + err);
  });
}

/**
 * ensureSafeQuitAndInstall
 * Make sure Electron quits properly
 * https://github.com/electron-userland/electron-builder/issues/1604#issuecomment-372091881
 */
function ensureSafeQuitAndInstall() {
  app.removeAllListeners("window-all-closed");
  var browserWindows = BrowserWindow.getAllWindows();
  browserWindows.forEach(function(browserWindow) {
    browserWindow.removeAllListeners("close");
  });
}
