<template>
  <v-banner class="pa-8">
    <v-icon
      icon="mdi-alert"
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

export default {
  name: 'Error',
  mixins: [Util],
  data: () => ({
    message: undefined
  }),
  mounted() {
    this.message = this.$route.query.m
    useContextStore().loadingComplete('Error')
  }
}
</script>
