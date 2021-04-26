<template>
  <div class="radio-container">
    <div v-for="(channel, index) in channels" :key="index" class="radio-item">
      <input
        type="radio"
        v-model="inputSelection"
        :value="channel"
        name="radio-group"
        :id="`radio-${index}`"
        @click="showConfirm($event)"
      />
      <label :for="`radio-${index}`">{{ channel }}</label>
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
const { ipcRenderer } = require('electron')

export default {
  setup() {
    // The selected option in the template
    const channel = ref(null) // Init
    const inputSelection = ref(null)
    const channels = ['latest', 'beta', 'alpha']

    function showConfirm(event) {
      const newChannel = event.target.value
      const confirmation = confirm(
        `Are you sure you want to switch to the ${newChannel} channel?`
      )

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

    // Fetch the current setting
    // Set the init value
    ipcRenderer.send('get-autoupdate-channel')
    ipcRenderer.on('get-autoupdate-channel-response', (event, newValue) => {
      channel.value = newValue // This is the value from Main process
      inputSelection.value = newValue
    })

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

  .radio-item {
  }
}
</style>
