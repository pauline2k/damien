<template>
  <div :class="`evaluation-error text-${color} text-${shade} d-flex my-1`">
    <v-icon
      small
      class="align-self-start mr-1"
      :class="`text--${shade}`"
      :color="color"
      :icon="mdiAlertCircle"
    />
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
import {useTheme} from 'vuetify'
import {mdiAlertCircle} from '@mdi/js'
import {computed} from 'vue'

defineProps({
  color: {
    default: 'error',
    required: false,
    type: String
  },
  message: {
    required: true,
    type: String
  },
  hover: {
    required: false,
    type: Boolean
  }
})

const theme = useTheme()
const shade = computed(() => {
  return theme.global.current.value.dark && !this.hover ? 'lighten-3' : 'darken-1'
})
</script>

<style scoped>
.evaluation-error {
  font-size: 0.9em;
  font-style: italic;
  line-height: 1.2em;
}
</style>
