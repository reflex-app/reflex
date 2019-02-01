let platform = {
  isMac: false,
  isWindows: false
}

if (navigator.appVersion.indexOf('Mac') != -1) {
  platform.isMac = true
} else if (navigator.appVersion.indexOf('Win') != -1) {
  platform.isWindows = true
} else {
  // Something other than Mac or Windows
}

// Export
export default platform
