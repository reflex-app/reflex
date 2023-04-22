<template>
  <div class="radio-container">
    <div v-for="(channel, index) in channels" :key="index" class="radio-item">
      <input :id="`radio-${index}`" v-model="inputSelection" type="radio" :value="channel" name="radio-group"
        @click="showConfirm($event)" />
      <label :for="`radio-${index}`">{{ channel }}</label>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useIpcRenderer } from '@vueuse/electron'

// Connect w/ Electron
const ipcRenderer = useIpcRenderer()

export default {
  setup() {
    // The selected option in the template
    const channel = ref(null) // Filled w/ value from Main process
    const channels = ['latest', 'beta', 'alpha'] // Update channels to choose from
    const inputSelection = ref(null) // Current selection in UI

    // Fetch the current setting on setup()
    ipcRenderer.send('get-autoupdate-channel')

    // Set the init value
    ipcRenderer.on('get-autoupdate-channel-response', (event, newValue) => {
      channel.value = newValue // This is the value from Main process
      console.info(`Update channel: ${channel.value}`)
      inputSelection.value = newValue
    })

    function showConfirm(event) {
      const newChannel = event.target.value

      const confirmDialog =
        newChannel === 'latest'
          ? 'Are you sure you want to switch to downloading the latest updates?'
          : `Are you sure you want to switch to downloading the ${newChannel} updates? This is a development mode, and there may be bugs.`

      const confirmation = confirm(confirmDialog)

      if (confirmation) {
        // Send the message
        ipcRenderer.send('set-autoupdate-channel', newChannel)

        // Wait for a response
        ipcRenderer.once(
          'set-autoupdate-channel-response',
          (event, channel) => {
            console.log(`Successfully set channel to ${channel}`)
          }
        )
      } else {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    return {
      channels,
      inputSelection,
      showConfirm,
    }
  },
}
</script>

<style lang="scss" scoped>
.radio-container {
  display: flex;

  .radio-item {}
}
</style>
