<template>
  <footer id="footer" class="bg-secondary-darken-2 footer">
    <v-container fluid>
      <v-row no-gutters>
        <v-col aria-label="Feedback" class="text-left">
          Problem? Question?
          <a
            id="damien-support-mailto"
            class="text-decoration-none text-white"
            :href="`mailto:${emailSupport}`"
            target="_blank"
          >
            Email us at {{ emailSupport }}
            <span class="sr-only"> (opens a new window)</span>
          </a>
        </v-col>
        <v-col>
          <div class="float-right">
            <span v-if="contextStore.config.isVueAppDebugMode && screenReaderAlert.message">
              {{ screenReaderAlert.message }}
            </span>
            <span v-if="!contextStore.config.isVueAppDebugMode || !screenReaderAlert.message">
              <v-icon :icon="mdiCopyright" size="small" /> {{ new Date().getFullYear() }}
              The Regents of the University of California
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup>
import {mdiCopyright} from '@mdi/js'
import {useContextStore} from '@/stores/context'

const contextStore = useContextStore()
const emailSupport = contextStore.config.emailSupport
const screenReaderAlert = contextStore.screenReaderAlert
</script>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 1100;
}
</style>
