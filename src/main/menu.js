const { app, Menu, shell } = require('electron')
const isDev = require('electron-is-dev')

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
            shell.openExternal('https://github.com/nwittwer/reflex/issues/new')
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

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        {
          role: 'about',
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

  template[0].submenu.splice(
    1,
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
