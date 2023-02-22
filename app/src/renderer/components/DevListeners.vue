<template>
  <div>
    <CollapsibleContainer title="Event Listeners">
      <div v-for="listener of list" :key="listener.id">
        <div
          v-for="([key, value], index) in Object.entries(listener)"
          :key="index"
        >
          <template v-if="key === 'element'">
            <div @click="highlightDomElement(listener.id)">
              {{ key }}
            </div>
          </template>
          <template v-if="key === 'callback'">
            <CollapsibleContainer title="Callback">
              {{ key }}
            </CollapsibleContainer>
          </template>
          <template v-else> {{ key }}: {{ value }} </template>
        </div>
      </div>
    </CollapsibleContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRaw, unref, watch } from 'vue'
import {
  chain,
  isEqual,
  zipObject,
  groupBy,
  mapValues,
  map,
  uniqueId,
} from 'lodash'
import { parse, stringify } from 'flatted'
import CollapsibleContainer from '~/components/CollapsibleContainer.vue'

const list = ref<any[]>([]) // The list of EventListeners
const namedCallbacks = ref<any[]>([]) // List of all Event callbacks with namespaces

// Computed
// const byType = computed(() => {
//   return mapValues(
//     groupBy(list.value, (listener) => listener.type),
//     (newArr) =>
//       newArr.map((listener) => {
//         return {
//           target: listener.target,
//           callback: listener.callback,
//           callbackNamed: listener.callback?.__ob__?.value,
//         }
//       })
//   )
// })

// const byTarget = mapValues(
//   groupBy(list.value, (listener) => listener.target),
//   (newArr) =>
//     newArr.map((listener) => {
//       if (listener.callback?.__ob__?.value) {
//         namedCallbacks.value.push(listener)
//       }

//       return {
//         callback: listener.callback?.__ob__?.value,
//       }
//     })
// )

// const getDomElement = computed((el) => {
//   return document.querySelector(el)
// })

function highlightDomElement(id: string) {
  const { element: elementJson } = list.value.find((i) => i.id === id)
  if (!elementJson) console.warn('No ID found')

  if (elementJson === 'null') {
    console.log('Clicked element is null')
    return false
  }

  const elements = JSON.parse(elementJson)
  const nodeMap = new Map()
  const nodes = jsonToNodes(elements, nodeMap)

  // Use the nodeMap to retrieve a reference to the original DOM node
  const root = document.createElement('div')
  root.appendChild(nodes)
  const node = nodeMap.get(nodes)
  console.log(node) // This will log the original DOM node

  console.log(nodes)
  nodes.classList.add('dev_highlighted-element') // Add the styles to highlight the element

  // const nodeMap = new Map();
  // const node = jsonToNodes(elementJson, nodeMap);
  // const root = document.createElement('div');
  // root.appendChild(node);
  // root.style.position = 'absolute';
  // root.style.top = 0;
  // root.style.left = 0;
  // root.style.zIndex = 999999;
  // root.style.border = '3px solid red';
  // document.body.appendChild(root);
  // console.log() nodeMap.get(elementJson);
}

// Watch for changes
// watch(
//   list,
//   (newVal, oldVal) => {
//     console.log(newVal)

//     const hasChanged = isEqual(newVal, oldVal)
//     if (hasChanged || list.value.length === 0) {
//       // List ALL the event listeners
//       // console.table(list, ['target', 'type', 'callback'])

//       // Group by event.type
//       console.table(byType)

//       // Show all the easily identifiable Event callbacks
//       console.log('Named callbacks:')
//       console.table(namedCallbacks, ['type', 'target'])
//     }
//   },
//   { deep: true }
// )

onMounted(() => {
  const checkEventListeners = () => {
    // const list = listAllEventListeners()

    const raw = window.EventListeners.listeners // pull values from ~/plugins/eventListenerDebug
    console.log(raw)

    const mapped = map(raw, (listener: any) => {
      console.log(JSON.stringify(nodesToJson(listener.target)))

      return {
        id: uniqueId(),
        type: listener.type,
        callback: listener.callback,
        // element: stringify(listener.target),
        element: JSON.stringify(nodesToJson(listener.target)),
      }
    })

    // // Update our Vue Ref, so we can display on the UI
    list.value = mapped

    console.log(mapped)
  }

  checkEventListeners()

  // setInterval(() => checkEventListeners(), 1000)
})

function getCircularReplacer() {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

function listAllEventListeners() {
  // https://www.sqlpac.com/en/documents/javascript-listing-active-event-listeners.html
  const allElements = Array.prototype.slice.call(document.querySelectorAll('*'))
  allElements.push(document)
  allElements.push(window)

  const types = []

  for (let ev in window) {
    if (/^on/.test(ev)) types[types.length] = ev
  }

  let elements: any[] = []
  for (let i = 0; i < allElements.length; i++) {
    const currentElement = allElements[i]

    // Events defined in attributes
    for (let j = 0; j < types.length; j++) {
      if (typeof currentElement[types[j]] === 'function') {
        elements.push({
          node: currentElement,
          type: types[j],
          func: currentElement[types[j]].toString(),
        })
      }
    }

    // Events defined with addEventListener
    if (typeof currentElement._getEventListeners === 'function') {
      evts = currentElement._getEventListeners()
      if (Object.keys(evts).length > 0) {
        for (let evt of Object.keys(evts)) {
          for (k = 0; k < evts[evt].length; k++) {
            elements.push({
              node: currentElement,
              type: evt,
              func: evts[evt][k].listener.toString(),
            })
          }
        }
      }
    }
  }

  return elements.sort()
}

function nodesToJson(node) {
  if (node.nodeType !== 1) {
    return null
  }
  const obj = {
    tag: node.nodeName && node.nodeName.toLowerCase(),
    attrs: {},
    children: [],
  }
  const attrs = node.attributes
  for (let i = 0; i < attrs.length; i++) {
    obj.attrs[attrs[i].name] = attrs[i].value
  }
  if (node.hasChildNodes()) {
    const children = node.childNodes
    for (let i = 0; i < children.length; i++) {
      const child = nodesToJson(children[i])
      if (child) {
        obj.children.push(child)
      }
    }
  }
  return obj
}

function jsonToNodes(obj, nodeMap = new Map()) {
  if (!obj || !obj.tag) {
    return null
  }
  const node = document.createElement(obj.tag)
  nodeMap.set(obj, node)
  const attrs = obj.attrs || {}
  for (let name in attrs) {
    node.setAttribute(name, attrs[name])
  }
  const children = obj.children || []
  for (let i = 0; i < children.length; i++) {
    const childNode = jsonToNodes(children[i], nodeMap)
    if (childNode) {
      node.appendChild(childNode)
    }
  }
  return node
}
</script>

<style scoped></style>

<!-- Completely EXPOSED styles -->
<style lang="scss">
.dev_highlighted-element {
  &:after {
    content: '';
    background: yellow;
    border: 1px solid red;
    height: 100%;
    width: 100%;
  }
}
</style>
