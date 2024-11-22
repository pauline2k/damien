<template>
  <div>
    <span
      id="screen-reader-alert"
      class="sr-only"
      :aria-live="screenReaderAlert.politeness"
      role="alert"
    >
      {{ screenReaderAlert.message }}
    </span>
    <router-view />
  </div>
</template>

<script setup>
import {useContextStore} from '@/stores/context'

const screenReaderAlert = useContextStore().screenReaderAlert
</script>

<style>
  @import './assets/styles/damien-global.css';
  @import 'v-calendar/style.css';
</style>
