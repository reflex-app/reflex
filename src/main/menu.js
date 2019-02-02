const {
  app,
  Menu,
  shell
} = require('electron')

export function setMenu(window) {
  const template = [{
      label: 'Edit',
      submenu: [{
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [{
          role: 'reload'
        },
        {
          role: 'forcereload'
        },
        {
          role: 'toggledevtools'
        },
        {
          type: 'separator'
        },
        // {
        //   role: 'resetzoom'
        // },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          // role: 'zoomin',
          click() {
            window.webContents.send('menu_zoom-in')
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          // role: 'zoomout'
          click() {
            window.webContents.send('menu_zoom-out')
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        },
        {
          label: 'Fit to Screen',
          click() {
            window.webContents.send('menu_zoom-to-fit')
          }
        }
      ]
    },
    {
      role: 'window',
      submenu: [{
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: [{
          label: 'Community',
          click() {
            shell.openExternal('https://spectrum.chat/reflex-app')
          }
        }, {
          label: 'Report a Bug',
          click() {
            shell.openExternal('https://github.com/nwittwer/reflex/issues/new')
          }
        },
        {
          label: 'Follow on Twitter',
          click() {
            shell.openExternal('https://twitter.com/reflex_app')
          }
        }
      ]
    }
  ]

  // if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [{
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services'
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })

  // Edit menu
  template[1].submenu.push({
    type: 'separator'
  }, {
    label: 'Speech',
    submenu: [{
        role: 'startspeaking'
      },
      {
        role: 'stopspeaking'
      }
    ]
  })

  // Window menu
  template[3].submenu = [{
      role: 'minimize'
    },
    {
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      role: 'front'
    }
  ]
  // }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}