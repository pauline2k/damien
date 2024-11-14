<template>
  <v-snackbar
    v-model="snackbarShow"
    aria-live="assertive"
    :color="snackbar.color"
    content-class="align-center"
    light
    max-width="unset"
    multi-line
    :timeout="snackbar.timeout"
    :top="true"
  >
    <div class="d-flex align-center justify-space-between">
      <div
        id="alert-text"
        aria-live="polite"
        class="font-size-18 mx-4 text-condensed"
        role="alert"
        v-html="snackbar.text"
      />
      <div>
        <v-btn
          id="btn-close-alert"
          aria-label="Close this dialog box."
          :color="snackbar.color"
          text="Close"
          @click="snackbarClose"
        />
      </div>
    </div>
  </v-snackbar>
</template>

<script setup>
import {storeToRefs} from 'pinia'
import {useContextStore} from '@/stores/context'

const {snackbar, snackbarClose, snackbarShow} = storeToRefs(useContextStore())
</script>
