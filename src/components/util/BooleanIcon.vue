<template>
  <v-icon
    class="pb-1"
    :class="model ? 'text-success' : 'text-muted'"
    :icon="model ? mdiCheckCircle : mdiMinusCircle"
    size="small"
  />
</template>

<script setup>
import {mdiCheckCircle, mdiMinusCircle} from '@mdi/js'

defineProps({
  model: {
    required: true,
    type: Boolean
  }
})
</script>
