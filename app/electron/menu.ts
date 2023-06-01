import { app, Menu, MenuItem, shell } from 'electron'
import isDev from 'electron-is-dev'
import { checkForUpdates } from './updates/check-for-update'

const isMac = process.platform === 'darwin'

const checkForUpdatesMenuItem = {
  id: 'check-for-updates',
  parentId: isMac ? 'mac' : 'help',
  orderNumber: isMac ? 20 : 50,
  label: 'Check for updates...',
  enabled: true, // TODO: Make this reactive; currently doesn't change
  click: (menuItem: MenuItem) => checkForUpdates(menuItem),
}

export function setMenu(window: Electron.BrowserWindow) {
  const template: (
    | Electron.MenuItem
    | Electron.MenuItemConstructorOptions
    | {}
  )[] = [
    // conditional menu item for macOS
    isMac
      ? {
          label: app.name,
          submenu: [
            { role: 'about' },
            checkForUpdatesMenuItem, // Check for Updates (MacOS)
            {
              type: 'separator',
            },
            // Reset Reflex (MacOS)
            {
              label: `Reset ${app.name}...`,
              click() {
                window.webContents.send('menu_reset-app')
              },
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
        }
      : {},
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
    // If in Dev mode, add Developer menu
    ...(isDev
      ? [
          {
            label: 'Developer',
            submenu: [
              {
                label: 'Show Canvas Debugger',
                click() {
                  window.webContents.send('menu_show-developer-canvas-debugger')
                },
              },
            ],
          },
        ]
      : []),
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

  const menu = Menu.buildFromTemplate(template)

  // Initiate the menu
  Menu.setApplicationMenu(menu)
}
