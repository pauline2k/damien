<template>
  <v-banner class="pa-8">
    <v-icon
      :icon="mdiAlert"
      color="warning"
      x-large
    />
    <div>
      <h2 :style="{color: titleHexColor}">Error</h2>
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

<script>
import Util from '@/mixins/Util'
import {useContextStore} from '@/stores/context'
import {mdiAlert} from '@mdi/js'

export default {
  name: 'Error',
  mixins: [Util],
  data: () => ({
    mdiAlert,
    message: undefined
  }),
  mounted() {
    this.message = this.$route.query.m
    useContextStore().loadingComplete('Error')
  }
}
</script>
