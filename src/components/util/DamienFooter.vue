<template>
  <v-footer
    id="footer"
    app
    class="footer"
    color="secondary darken-1"
    dark
  >
    <v-container fluid class="pa-1">
      <v-row no-gutters justify="space-between">
        <v-col aria-label="Feedback">
          Problem? Question?
          <a
            id="damien-support-mailto"
            class="white--text"
            :href="`mailto:${emailSupport}`"
            target="_blank"
          >
            Email us at {{ emailSupport }}
            <span class="sr-only"> (opens a new window)</span>
          </a>
        </v-col>
        <v-col>
          <div class="float-right">
            <span v-if="contextStore.config.isVueAppDebugMode && contextStore.screenReaderAlert">
              {{ contextStore.screenReaderAlert }}
            </span>
            <span v-if="!contextStore.config.isVueAppDebugMode || !contextStore.screenReaderAlert">
              <v-icon :icon="mdiCopyright" size="small" /> {{ new Date().getFullYear() }}
              The Regents of the University of California
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import {mdiCopyright} from '@mdi/js'
import {useContextStore} from '@/stores/context'

const contextStore = useContextStore()
const emailSupport = contextStore.config.emailSupport
</script>

<style scoped>
.footer {
  z-index: 205;
}
</style>
