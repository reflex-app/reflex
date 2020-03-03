<template>
  <div>
    <div v-if="part==='header'" id="header">
      <svg
        width="375"
        height="92"
        viewBox="0 0 375 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="375" height="92" fill="white" />
        <rect width="375" height="92" fill="#353739" />
        <rect x="8" y="50" width="359" height="36" rx="18" fill="#5F6367" />
        <rect x="30" y="17" width="33" height="14" fill="#C4C4C4" />
        <rect opacity="0.7" x="292" y="17" width="21" height="12" fill="#C4C4C4" />
        <rect opacity="0.7" x="315" y="17" width="21" height="12" fill="#C4C4C4" />
        <rect opacity="0.7" x="338" y="17" width="21" height="12" fill="#C4C4C4" />
        <rect opacity="0.2" x="338" y="57" width="15" height="20" fill="#C4C4C4" />
      </svg>
    </div>
    <div v-if="part==='footer'" id="footer">
      <svg
        width="375"
        height="82"
        viewBox="0 0 375 82"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="375" height="82" fill="#353739" />
        <rect opacity="0.6" x="20" y="12" width="14" height="24" fill="#C4C4C4" />
        <rect opacity="0.6" x="99" y="12" width="14" height="24" fill="#C4C4C4" />
        <rect opacity="0.6" x="256" y="12" width="24" height="24" fill="#C4C4C4" />
        <rect opacity="0.6" x="329" y="12" width="26" height="24" fill="#C4C4C4" />
        <rect opacity="0.6" x="168" y="4" width="40" height="40" rx="20" fill="#C4C4C4" />
        <rect x="120" y="69" width="134" height="6" rx="3" fill="#FDFDFD" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: ["part"]
};
</script>

<style lang="scss" scoped>
#browser-header {
}
</style>