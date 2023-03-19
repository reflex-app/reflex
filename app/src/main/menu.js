const { app, Menu, shell } = require('electron')
const isDev = require('electron-is-dev')
import { checkForUpdates } from './updates/check-for-update'

const isMac = process.platform === 'darwin'

export function setMenu(window) {
  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo',
        },
        {
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
        },
        {
          role: 'copy',
        },
        {
          role: 'paste',
        },
        {
          role: 'pasteandmatchstyle',
        },
        {
          role: 'delete',
        },
        {
          role: 'selectall',
        },
        {
          type: 'separator',
        },
        {
          label: 'Speech',
          submenu: [
            {
              role: 'startspeaking',
            },
            {
              role: 'stopspeaking',
            },
          ],
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        // {
        //   role: 'resetzoom'
        // },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          // role: 'zoomin',
          click() {
            window.webContents.send('menu_zoom-in')
          },
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          // role: 'zoomout'
          click() {
            window.webContents.send('menu_zoom-out')
          },
        },
        {
          type: 'separator',
        },
        {
          role: 'togglefullscreen',
        },
        {
          label: 'Center to Screen',
          accelerator: 'CmdOrCtrl+0',
          click() {
            window.webContents.send('menu_zoom-to-fit')
          },
        },
        {
          type: 'separator',
        },
        // {
        //   role: 'reload'
        // },
        {
          role: 'forcereload',
        },
        {
          role: 'toggledevtools',
        },
      ],
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize',
        },
        {
          role: 'close',
        },
        {
          role: 'zoom',
        },
        {
          type: 'separator',
        },
        {
          role: 'front',
        },
      ],
    },
    {
      role: 'help',
      submenu: [
        //   {
        //   label: 'Community',
        //   click() {
        //     shell.openExternal('https://spectrum.chat/reflex-app')
        //   }
        // },
        {
          label: 'Report a Bug',
          click() {
            shell.openExternal(
              'https://github.com/reflex-app/reflex/issues/new'
            )
          },
        },
        {
          label: 'Follow on Twitter',
          click() {
            shell.openExternal('https://twitter.com/reflex_app')
          },
        },
      ],
    },
  ]

  if (isMac) {
    template.unshift({
      label: app.name,
      submenu: [
        {
          role: 'about',
        },
        {
          id: 'check-for-updates',
          parentId: isMac ? 'mac' : 'help',
          orderNumber: isMac ? 20 : 50,
          label: 'Check for updates...',
          enabled: true, // TODO: Make this reactive; currently doesn't change
          click: async (menuItem) => await checkForUpdates(menuItem),
        },
        {
          type: 'separator',
        },
        {
          role: 'services',
        },
        {
          type: 'separator',
        },
        {
          role: 'hide',
        },
        {
          role: 'hideothers',
        },
        {
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          role: 'quit',
        },
      ],
    })
  }

  // Reset Reflex
  template[0].submenu.splice(
    isMac ? 2 : 1, // place after "About" on Mac
    0,
    {
      type: 'separator',
    },
    {
      label: `Reset ${app.name}...`,
      click() {
        window.webContents.send('menu_reset-app')
      },
    }
  )
  // If in Dev mode, add menu
  if (isDev) {
    template.splice(4, 0, {
      label: 'Developer',
      submenu: [
        {
          label: 'Show Canvas Debugger',
          click() {
            window.webContents.send('menu_show-developer-canvas-debugger')
          },
        },
      ],
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
