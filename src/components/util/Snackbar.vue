<template>
  <v-snackbar
    v-model="contextStore.snackbarShow"
    aria-live="assertive"
    :color="contextStore.snackbar.color"
    content-class="align-center"
    light
    max-width="unset"
    multi-line
    :timeout="contextStore.snackbar.timeout"
    :top="true"
  >
    <div class="d-flex align-center justify-space-between">
      <div
        id="alert-text"
        aria-live="polite"
        class="font-size-18 mx-4 text-condensed"
        role="alert"
        v-html="contextStore.snackbar.text"
      />
      <div>
        <v-btn
          id="btn-close-alert"
          aria-label="Close this dialog box."
          :color="contextStore.snackbar.color"
          text="Close"
          @click="contextStore.snackbarClose"
        />
      </div>
    </div>
  </v-snackbar>
</template>

<script setup>
import {useContextStore} from '@/stores/context'

const contextStore = useContextStore()
</script>
