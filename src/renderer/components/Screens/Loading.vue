<template>
  <div>
    <div v-show="isLoading" class="loader">
      <div class="content">
        <div class="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';

.loader {
  position: absolute;
  top: 0;
  right: 2rem;
  display: block;

  .content {
    left: 50%;
    transform: translateX(-50%);
    color: white;
    position: absolute;
  }

  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
  }

  .lds-ripple div {
    position: absolute;
    border: 4px solid $accent-color;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }

  @keyframes lds-ripple {
    0% {
      top: 20px;
      left: 20px;
      width: 0;
      height: 0;
      opacity: 1;
    }

    100% {
      top: -1px;
      left: -1px;
      width: 42px;
      height: 42px;
      opacity: 0;
    }
  }
}
</style>
