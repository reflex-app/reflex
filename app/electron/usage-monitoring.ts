import si from 'systeminformation'
import { app, BrowserWindow } from 'electron'
import { RuntimeConfig } from './config'

let cpuInterval: string | number | NodeJS.Timeout | undefined
let memoryInterval: string | number | NodeJS.Timeout | undefined

const cpuThreshold = 85 // 85% CPU usage threshold
const memoryThreshold = 90 // 90% memory usage threshold

let currentWindow: BrowserWindow | null = null

const emitToRenderer = (channel: string, ...args: any[]) => {
  if (currentWindow) {
    currentWindow.webContents.send(channel, ...args)
  } else {
    throw new Error('No focused window found')
  }
}

export default function startMonitoring() {
  const appConfig = RuntimeConfig.getInstance()
  currentWindow = appConfig.window

  monitorCPUUsage()
  monitorMemoryUsage()

  // Register before-quit event listener
  app.on('before-quit', () => {
    // Clear the monitoring intervals
    clearInterval(cpuInterval)
    clearInterval(memoryInterval)
  })
}

function monitorCPUUsage() {
  cpuInterval = setInterval(async () => {
    try {
      const cpuData = await si.currentLoad()
      const cpuUsagePercent = cpuData.currentLoad

      emitToRenderer('perf-cpu', Math.round(cpuUsagePercent)) // Send CPU usage to renderer process

      if (cpuUsagePercent >= cpuThreshold) {
        const warningMessage = `High memory usage: ${cpuUsagePercent.toFixed(
          2
        )}%`
        console.warn(warningMessage)
        emitToRenderer('perf-warning', warningMessage)
      } else {
        console.info('CPU usage:', cpuUsagePercent.toFixed(2), '%')
      }
    } catch (err) {
      console.debug('Error retrieving CPU usage:', err)
    }
  }, 1000)
}

function monitorMemoryUsage() {
  memoryInterval = setInterval(async () => {
    try {
      const memData = await si.mem()
      const totalMemory = memData.total
      const usedMemory = memData.active
      const memoryUsagePercent = (usedMemory / totalMemory) * 100

      emitToRenderer('perf-memory', Math.round(memoryUsagePercent)) // Send memory usage to renderer process

      if (memoryUsagePercent >= memoryThreshold) {
        const warningMessage = `High memory usage: ${memoryUsagePercent.toFixed(
          2
        )}%`
        console.warn(warningMessage)
        emitToRenderer('perf-warning', warningMessage)
      } else {
        console.info('Memory usage:', memoryUsagePercent.toFixed(2), '%')
      }
    } catch (err) {
      console.error('Error retrieving memory usage:', err)
    }
  }, 1000)
}
