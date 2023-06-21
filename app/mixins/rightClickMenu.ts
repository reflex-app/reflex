/**
 * Creates a generic right-click menu
 */

import { Menu, MenuItem, getCurrentWindow } from '@electron/remote' // TODO Migrate to @electron/remote and move this logic to main process
import isElectron from 'is-electron'
import { VueElement, VueElementConstructor } from 'vue'
import Trigger from '~/components/CrossBrowser/Screenshots/Trigger.vue'
import { useArtboardsStore } from '~/store/artboards'
import { Artboard } from '~/store/artboards'

export default function (artboard: Artboard) {
  const { $bus } = useNuxtApp()

  if (!artboard) return false
  const artboardFrame = getArtboard(artboard.id).querySelector('webview')

  // Require DOMElement and Electron context
  if (!artboardFrame || !isElectron()) return false

  const menu = new Menu()
  menu.append(
    new MenuItem({
      label: 'Duplicate',
      click() {
        const store = useArtboardsStore()
        store.duplicateArtboard(artboard)
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Rotate',
      click() {
        const store = useArtboardsStore()
        store.resizeArtboard({
          id: artboard.id,
          width: artboard.height,
          height: artboard.width,
        })
      },
    })
  )
  menu.append(
    new MenuItem({
      label: artboard.isVisible ? 'Hide' : 'Show',
      click() {
        const store = useArtboardsStore()
        store.changeArtboardVisibility(artboard.id)
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Open DevTools',
      click() {
        artboardFrame.openDevTools()
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Preview Cross-browser',
      click() {
        try {
          // TODO: Find a more pragmatic way to do this

          // interface CustomVueComponent extends HTMLElement {
          //   __vueComponent__: ComponentPublicInstance
          // }

          // // Emit an event to the correct artboard
          // const el: CustomVueComponent | null = getArtboard(
          //   artboard.id
          // ) as CustomVueComponent
          // if (!el) return false

          // const getVueInstance = (el: CustomVueComponent | null) => {
          //   while (el) {
          //     if (el.__vueComponent__) {
          //       return el.__vueComponent__
          //     } else {
          //       // console.log('lokign up parent')
          //       // el = el.parentNode as CustomVueComponent
          //       el = el.parentNode as CustomVueComponent
          //       console.log(el.childNodes)
          //     }
          //   }
          // }

          // // const instance = getVueInstance(el)
          // if (!instance) return false

          // console.log(
          //   el,
          //   instance,
          //   instance.$refs['artboard'],
          //   instance.$.subTree.children
          // )

          // console.log(instance.$.subTree.children.map((i) => i.type.name))

          // // Find the child component in which to trigger a function

          // const childCrossBrowserComponent = instance.$.subTree.children.find(
          //   (child) => child.type.name === 'CrossBrowserScreenshots'
          // )
          // console.log(childCrossBrowserComponent)

          // const childCrossBrowserComponent = instance.$children.find((obj) =>
          //   obj.$vnode.tag.includes('CrossBrowserScreenshots')
          // )

          // 1. Find the artboard
          getArtboard(artboard.id)

          // 2. Emit an event to the correct artboard
          // TODO: Typings not working here?
          $bus.emit('cross-browser:take-screenshots', artboard.id)
        } catch (err) {
          console.log(`Cross-browser error: ${err}`)
        }
      },
    })
  )
  menu.append(
    new MenuItem({
      label: 'Delete',
      click() {
        const store = useArtboardsStore()
        store.removeArtboard(artboard.id)
      },
    })
  )
  menu.popup(getCurrentWindow())
}

function getArtboard(id: string) {
  // TODO add test here, selectors are brittle
  // This could probably be a Store action
  try {
    return document.querySelector(`[artboard-id="${id}"]`)
  } catch (err) {
    console.error('Failed to query DOM element')
  }
}
