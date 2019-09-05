<template>
  <div class="size-shifter-container">
    <div class="size-shifter-item is-active">
      <div class="title">⌘1</div>
      <div class="size">360x480</div>
    </div>
    <div class="size-shifter-item">
      <div class="title">⌘2</div>
      <div class="size">360x480</div>
    </div>
    <div class="size-shifter-item">
      <div class="title">⌘3</div>
      <div class="size">360x480</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.size-shifter-container {
  display: flex;
  overflow: hidden;
  width: 100%;
  background: #e0e0e0;
  border-radius: 30px;
}

.size-shifter-item {
  padding: 0.25rem 1.5rem;
  font-size: 80%;
  border: 1px solid transparent;
  border-radius: 30px;

  &.is-active {
    background: white;
    border: 1px solid #858585;
  }
}
</style>