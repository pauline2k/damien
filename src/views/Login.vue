<template>
  <v-app>
    <Snackbar />
    <v-container class="background-lecture-hall" fill-height fluid>
      <v-main>
        <v-card
          class="mx-auto px-8 py-6 frosted accent-border accent--text"
          max-width="600"
          outlined
        >
          <div class="text-center">
            <h1 id="page-title">
              <strong>Welcome to Course Evaluations</strong>
              {{ contextStore.config.currentTermName }}
            </h1>
          </div>
          <v-card-actions class="px-16 pt-12 d-flex flex-column">
            <v-btn
              id="log-in"
              aria-label="Log in to Course Evaluations. (You will be sent to CalNet login page.)"
              block
              color="accent"
              large
              @click.stop="logIn"
              @keypress.enter.prevent.stop="logIn"
            >
              Sign In
              <v-icon class="pl-2" :icon="mdiArrowRightCircleOutline" />
            </v-btn>
            <DevAuth v-if="contextStore.config.devAuthEnabled" />
          </v-card-actions>
        </v-card>
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup>
import {useContextStore} from '@/stores/context'
const contextStore = useContextStore()
</script>

<script>
import DevAuth from '@/components/admin/DevAuth'
import Snackbar from '@/components/util/Snackbar'
import {alertScreenReader, putFocusNextTick} from '@/lib/utils'
import {get} from 'lodash'
import {getCasLoginURL} from '@/api/auth'
import {mdiArrowRightCircleOutline} from '@mdi/js'

export default {
  name: 'Login',
  components: {
    DevAuth,
    Snackbar
  },
  data: () => ({
    mdiArrowRightCircleOutline
  }),
  created() {
    putFocusNextTick('page-title')
    const error = get(this.$route, 'query.error')
    if (error) {
      useContextStore().snackbarReportError(error)
    } else {
      alertScreenReader(`Welcome to Course Evaluations - ${useContextStore().config.currentTermName}. Please log in.`)
    }
  },
  methods: {
    logIn() {
      getCasLoginURL().then(data => window.location.href = data.casLoginUrl)
    }
  }
}
</script>

<style scoped>
.accent-border {
  border: 1px solid #F04A00 !important;
}
.background-lecture-hall {
  background: url('~@/assets/lecture_hall_background.jpg') no-repeat center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.frosted {
  background-color: rgba(255, 255, 255, 0.8) !important;
}
h1 strong {
  display: block;
  font-size: 65%;
}
</style>
