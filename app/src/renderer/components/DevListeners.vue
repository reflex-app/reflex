<template>
  <div>
    <CollapsibleContainer title="Event Listeners">
      <div v-for="listener of list" :key="listener.id" class="listener-item">
        <div
          v-for="([key, value], index) in Object.entries(listener)"
          :key="index"
        >
          <!-- Iterate over the listener.element -->
          <template v-if="key === 'element'">
            <div @mouseover="highlightDomElement(listener.id, $event.target)">
              <!-- Iterate over the listener.element's Object { tag, attrs, children } -->
              <div
                v-for="([key, value], index) in Object.entries(
                  jsonStringToObject(listener.element)
                )"
              >
                <template v-if="key === 'tag'">
                  {{ key }}: {{ value }}
                </template>
                <template v-if="key === 'attrs'"> {{ key }}: Yes </template>
                <template v-if="key === 'children'"> {{ key }}: Yes </template>
              </div>
            </div>
          </template>
          <template v-else-if="key === 'callback'">
            <!-- TODO: Vue callbacks are useless currently because it always shows some boilerplate code instead of the real code -->
            <!-- <CollapsibleContainer title="Callback">
              {{ value }}
            </CollapsibleContainer> -->
          </template>
          <template v-else-if="key === 'id'">
            <!-- Don't show ID -->
          </template>
          <template v-else> {{ key }}: {{ value }} </template>
        </div>
      </div>
    </CollapsibleContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRaw, unref, watch } from 'vue'
import { map, uniqueId, isString } from 'lodash'
import CollapsibleContainer from '~/components/CollapsibleContainer.vue'

interface IEventObject {
  id: string
  type: string
  callback: any
  element: string // JSON string representation of the DOM node
}

interface IDomObject {
  tag: string
  attrs?: {}
  children?: any[]
}

const list = ref<IEventObject[]>([]) // The list of EventListeners
const namedCallbacks = ref<any[]>([]) // List of all Event callbacks with namespaces

// Computed

function jsonStringToObject(string: string): IDomObject | {} {
  try {
    if (isString(string) === false) {
      console.error('Expected to receive JSON string!', string)
      return {}
    }

    let parsed = JSON.parse(string)

    if (['window', 'document'].includes(parsed)) {
      parsed = { tag: parsed }
    }

    return parsed
  } catch (e) {
    console.error('Error parsing nodes JSON:', e)
    return {}
  }
}

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

function highlightDomElement(id: string, hoveredElement: HTMLElement) {
  const { element: elementJson } = list.value.find((i) => i.id === id)
  if (!elementJson) console.warn('No ID found')

  if (elementJson === 'null') {
    console.log('Clicked element is null')
    return false
  }

  const elements: IDomObject | 'window' | 'document' = JSON.parse(elementJson)
  if (!elements) {
    console.error('No elements found', elements)
    return false
  }

  if (isString(elements) && ['window', 'document'].includes(elements)) {
    console.warn('Cannot highlight window/document')
    return false
  }

  const nodeMap = new Map()
  const nodes = jsonToNodes(elements, nodeMap)

  // Use the nodeMap to retrieve a reference to the original DOM node
  const root = document.createElement('div')
  root.appendChild(nodes)
  const node = nodeMap.get(nodes)
  // console.log(nodes) // This will log the original DOM node

  const isNodeInDOM = document.body.contains(nodes)
  // console.log('Is node in DOM?', isNodeInDOM)

  if (!isNodeInDOM) {
    // DOM Node is outdated
    // We need to get the new reference
    // We'll start with a JSON string of the DOM object
    const string = JSON.parse(elementJson)
    const tagName = string.tag
    const attrs = string.attrs

    // Example: 'div' + 'data-v-123' + ''
    const selector = `${tagName}${convertAttrsToQuerySelector(attrs)}`
    // console.log(selector)

    const liveNodes = document.querySelectorAll(selector)
    liveNodes.forEach((node) => {
      highlight(node)
    })
    // console.log(liveNodes)
  } else {
    highlight(nodes)
    // console.log(nodes)
  }

  function highlight(node) {
    node.setAttribute('dev_highlighted-element', true) // Add the styles to highlight the element
    hoveredElement.addEventListener('mouseleave', onMouseLeave)

    function onMouseLeave() {
      node.removeAttribute('dev_highlighted-element') // Remove the styles to highlight the element
      hoveredElement.removeEventListener('mouseleave', onMouseLeave)
    }
  }
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
    const raw = window.EventListeners.listeners // pull values from ~/plugins/eventListenerDebug
    // console.log(raw)

    const mapped = map(raw, (listener: EventListener) => {
      // console.log(listener)

      if (!listener.target) {
        console.warn('Skipped listener without target')
        return false
      }

      let element = nodesToJson(listener.target) // DOM Node

      if (element !== null) {
        element = JSON.stringify(element) // Stringify
      } else {
        element = null
      }

      // console.log(element)

      return {
        id: uniqueId(),
        type: listener.type,
        callback: listener.callback,
        // element: stringify(listener.target),
        element: element, // JSON string representation of the DOM node
      }
    }) as IEventObject[] | false

    if (!mapped) return false

    // // Update our Vue Ref, so we can display on the UI
    list.value = mapped
    // console.log(mapped)
  }

  checkEventListeners()
  // setInterval(() => checkEventListeners(), 1000)
})

function nodesToJson(node: any) {
  if (node === document) {
    return 'document'
  }
  if (node === window) {
    return 'window'
  }
  if (!node || !node.tagName) {
    return null
  }
  const obj: any = {
    tag: node.tagName.toLowerCase(),
    attrs: {},
  }
  const attrs = node.attributes
  for (let i = 0; i < attrs.length; i++) {
    obj.attrs[attrs[i].name] = attrs[i].value
  }
  const children = node.childNodes
  if (children.length) {
    obj.children = []
    for (let i = 0; i < children.length; i++) {
      const child = nodesToJson(children[i])
      if (child) {
        obj.children.push(child)
      }
    }
  }
  return obj
}

function jsonToNodes(json, nodeMap) {
  if (json === undefined || json === null) {
    return null
  }
  if (typeof json === 'string' || typeof json === 'number') {
    return document.createTextNode(json.toString())
  }
  const node = document.createElement(json.tag)
  nodeMap.set(json, node)
  if (json.attrs) {
    for (const [name, value] of Object.entries(json.attrs)) {
      node.setAttribute(name, value)
    }
  }
  if (json.children) {
    for (const child of json.children) {
      const childNode = jsonToNodes(child, nodeMap)
      if (childNode) {
        node.appendChild(childNode)
      }
    }
  }
  return node
}

function convertAttrsToQuerySelector(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([key, value]) => {
      if (value) {
        return `[${key}="${value}"]`
      } else {
        return `[${key}]`
      }
    })
    .join('')
}
</script>

<style scoped></style>

<!-- Completely EXPOSED styles -->
<style lang="scss">
[dev_highlighted-element] {
  color: #ff0000 !important;
  box-shadow: 0px 0px 0px 2px #ff0000 inset !important;
  z-index: 2147483647 !important; /* Maximum z-index value */
  // outline: 2px solid !important;
  background-color: rgba(255, 0, 0, 0.1) !important;
  opacity: 0.8 !important;
}

.listener-item {
  border-bottom: 1px solid rgba(white, 0.2);
  padding: 0.5rem 0;

  &:hover {
    cursor: pointer;
  }
}
</style>
