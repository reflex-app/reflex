<template>
  <div v-if="icon" class="icon" :class="iconColorHandler" v-html="icon" />
</template>

<script setup lang="ts">
import { useIconStore } from "@/store/icons";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'dark'
  }
})

const iconStore = useIconStore();

const icon = ref(null)

const iconColorHandler = computed(() => {
  switch (props.color) {
    case 'dark':
      return 'icon--dark'

    case 'light':
      return 'icon--light'

    case 'accent':
      return 'icon--accent'

    default:
      throw new Error('Color not found')
  }
})

onMounted(async () => {
  // Look up icons in store
  const arr = Object.entries(iconStore.icons).filter((i) => {
    return i[0] === props.name;
  });

  const fn = arr[0][1]

  if (!fn) {
    console.error('Icon not found', props.name)
  }

  // Set icon value
  icon.value = await fn?.().then((res: any) => {
    return res;
  });
})


</script>

<style lang="scss" scoped>
@import '@/scss/_variables';

.icon {
  display: inline-block;
  height: 24px;
  width: 24px;
  // mask-repeat: no-repeat;
  // mask-position: center;
  // // TODO The following should be autoprefixed...
  // -webkit-mask-repeat: no-repeat;
  // -webkit-mask-position: center;

  &.icon--dark {
    // background: black;

    &:deep path {
      stroke: black;
    }
  }

  &.icon--light {
    // background: white;

    &:deep path {
      stroke: white;
    }
  }

  &.icon--accent {
    background: $accent-color;
  }
}
</style>
