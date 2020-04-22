<template>
  <div>
    <Loading :is-loading="state.isLoading" />
    <WebPage
      :id="id"
      :allow-interactions="true"
      @loadstart="state.isLoading = true"
      @loadend="state.isLoading = false"
    />
  </div>
</template>

<script>
import WebPage from '@/components/Screens/WebPage.vue'
import Loading from '@/components/Screens/Loading.vue'
export default {
  components: {
    WebPage,
    Loading,
  },
  props: {
    /**
     * Expects an artboard ID
     */
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      state: {
        isLoading: false,
      },
    }
  },
}
</script>

<style lang="scss" scoped></style>
