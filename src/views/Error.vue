<template>
  <v-banner class="pa-8">
    <v-icon
      :icon="mdiAlert"
      color="warning"
      x-large
    />
    <div>
      <h2 class="text-title">Error</h2>
      <div
        id="error-message"
        class="pt-4"
        aria-live="polite"
        role="alert"
      >
        {{ message || 'Uh oh, there was a problem.' }}
      </div>
    </div>
  </v-banner>
</template>

<script setup>
import {mdiAlert} from '@mdi/js'
import {onMounted, ref} from 'vue'
import {useContextStore} from '@/stores/context'
import {useRoute} from 'vue-router'

const message = ref(undefined)

onMounted(() => {
  message.value = useRoute().query.m
  useContextStore().loadingComplete('Error')
})
</script>
