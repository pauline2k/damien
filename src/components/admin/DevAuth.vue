<template>
  <v-form class="mb-4 dev-auth" @submit.prevent="logIn">
    <div class="my-8">
      <v-divider color="secondary" />
    </div>
    <v-text-field
      id="dev-auth-uid"
      v-model="uid"
      flat
      light
      outlined
      solo
      placeholder="UID"
      :rules="[v => !!v || 'Required']"
      @keyup.enter="logIn"
    />
    <v-text-field
      id="dev-auth-password"
      v-model="password"
      flat
      light
      outlined
      solo
      placeholder="Password"
      :rules="[v => !!v || 'Required']"
      type="password"
      @keyup.enter="logIn"
    />
    <v-btn
      id="btn-dev-auth-login"
      block
      :style="!uid || !password ? {background: `${themes.light.secondary} !important`, color: '#FFF !important'} : {}"
      class="secondary"
      :disabled="!uid || !password"
      @click="logIn"
    >
      Dev Auth
      <img alt="Damien, the son of the Devil" src="@/assets/damien.svg" class="ml-2 damien-icon" />
    </v-btn>
  </v-form>
</template>

<script setup>
import {devAuthLogIn} from '@/api/auth'
import {get, noop, trim} from 'lodash'
import {putFocusNextTick} from '@/lib/utils'
import {ref} from 'vue'
import {useTheme} from 'vuetify'

const uid = ref(undefined)
const password = ref(undefined)
const themes = useTheme().themes.value

const logIn = () => {
  let uid = trim(this.uid)
  let password = trim(this.password)
  if (uid && password) {
    devAuthLogIn(uid, password).then(user => {
      if (user.isAuthenticated) {
        const redirect = get(this.$router, 'currentRoute.query.redirect')
        this.$router.push({path: redirect || '/'}, noop)
      } else {
        this.reportError('Sorry, user is not authorized to use Course Evaluations.')
      }
    })
  } else if (uid) {
    this.reportError('Password required')
    putFocusNextTick('dev-auth-password')
  } else {
    this.reportError('Both UID and password are required')
    putFocusNextTick('dev-auth-uid')
  }
}
</script>

<style scoped>
.damien-icon {
  height: 20px;
  width: 20px;
}
.damien-icon .cls-1 {
  fill: transparent;
}
.damien-icon .cls-2 {
  fill: currentColor;
}
.dev-auth {
  width: 100%;
}
</style>
