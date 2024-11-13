<template>
  <v-app :style="{background: $vuetify.theme.dark ? $vuetify.theme.themes.dark.background : $vuetify.theme.themes.light.background}">
    <a
      id="skip-to-content-link"
      href="#content"
      class="sr-only"
      tabindex="0"
    >
      Skip to main content
    </a>
    <v-navigation-drawer
      app
      permanent
      class="nav"
      color="secondary"
      :expand-on-hover="true"
      :mini-variant="true"
      mini-variant-width="56"
      clipped
      :right="false"
      dark
    >
      <v-list
        aria-label="Main"
        nav
        role="navigation"
      >
        <v-list-item
          v-for="(item, index) in navItems"
          :id="`sidebar-link-${index}`"
          :key="index"
          role="link"
          class="primary-contrast--text sidebar-link pr-1"
          link
          @click="toRoute(item.path)"
          @keypress.enter.prevent="toRoute(item.path)"
        >
          <v-list-item-title class="py-2">
            <div>
              <img alt="Lightbulb icon" :src="`@/${item.icon}`" />
            </div>
            <v-list-item-title class="d-flex text-wrap sidebar-link-content">
              <span class="align-self-center">{{ item.title }}</span>
            </v-list-item-title>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          :id="`sidebar-link-${size(navItems)}`"
          class="primary-contrast--text sidebar-link pr-1"
          @click="toggleColorScheme"
          @keypress.enter.prevent="toggleColorScheme"
        >
          <v-icon>
            <img alt="Lightbulb icon" src="@/assets/lightbulb-outline.svg" />
          </v-icon>
          <div>
            <v-list-item-title>{{ $vuetify.theme.dark ? 'Light' : 'Dark' }} mode</v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      class="align-center nav"
      clipped-left
      color="primary"
      dark
    >
      <div class="display-1 mr-4 text-no-wrap">
        Course Evaluations
      </div>
      <div>
        <v-spacer>
          <v-chip
            v-if="config.isVueAppDebugMode && screenReaderAlert"
            id="screen-reader-alert-debug"
            class="sr-debug font-italic"
            color="primary-contrast"
            outlined
          >
            {{ screenReaderAlert }}
          </v-chip>
        </v-spacer>
      </div>
      <div class="ml-auto">
        <v-menu offset-y rounded="lg">
          <template #activator="{props: menuProps}">
            <v-btn
              id="btn-main-menu"
              color="secondary"
              dark
              v-bind="menuProps"
            >
              <span class="sr-only">User profile for </span>{{ currentUser.firstName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item id="menu-item-log-out" link @click="logOut">
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <v-main id="content" class="ma-0">
      <Snackbar />
      <Spinner v-if="loading" />
      <div
        v-if="serviceAnnouncement && serviceAnnouncement.isLive"
        class="service-announcement"
      >
        <pre>
          <span
            id="service-announcement"
            v-linkified
            class="body-2"
            aria-live="polite"
            role="alert"
            v-html="serviceAnnouncement.text"
          />
        </pre>
      </div>
      <router-view :key="stripAnchorRef($route.fullPath)" class="px-4"></router-view>
    </v-main>
    <DamienFooter />
  </v-app>
</template>

<script>
import Context from '@/mixins/Context'
import DamienFooter from '@/components/util/DamienFooter'
import Snackbar from '@/components/util/Snackbar'
import Spinner from '@/components/util/Spinner'
import Util from '@/mixins/Util'
import {getCasLogoutUrl} from '@/api/auth'
import {map, noop, size} from 'lodash'
import {useContextStore} from '@/stores/context'

export default {
  name: 'BaseView',
  components: {
    DamienFooter,
    Snackbar,
    Spinner
  },
  mixins: [Context, Util],
  data: () => ({
    navItems: undefined,
  }),
  computed: {
    currentUser() {
      return useContextStore().currentUser
    }
  },
  created() {
    this.prefersColorScheme()
    if (this.currentUser.isAdmin) {
      this.navItems = [
        {title: 'Status Board', icon: 'assets/list-status.svg', path: '/status'},
        {title: 'Publish', icon: 'assets/exclamation-circle-solid.svg', path: '/publish'},
        {title: 'Group Management', icon: 'assets/account-group.svg', path: '/departments'},
        {title: 'List Management', icon: 'assets/playlist-edit.svg', path: '/lists'}
      ]
    } else if (size(this.currentUser.departments)) {
      this.navItems = map(this.currentUser.departments, department => {
        const firstInitial = department.name.charAt(0).toLowerCase()
        return {
          title: department.name,
          icon: `mdi-alpha-${firstInitial}-circle`,
          path: `/department/${department.id}`
        }
      })
    }
  },
  methods: {
    logOut() {
      this.alertScreenReader('Logging out')
      getCasLogoutUrl().then(data => window.location.href = data.casLogoutUrl)
    },
    prefersColorScheme() {
      if (window.localStorage.getItem('prefersDarkMode')) {
        this.$vuetify.theme.dark = window.localStorage.getItem('prefersDarkMode') === 'true'
      } else {
        this.$vuetify.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    },
    size,
    toggleColorScheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      window.localStorage.setItem('prefersDarkMode', this.$vuetify.theme.dark)
    },
    toRoute(path) {
      this.$router.push({path}, noop)
    }
  }
}
</script>

<style scoped>
.nav {
  z-index: 204 !important;
}
.service-announcement {
  background-color: #f0ad4e;
  color: #000;
  margin: 0;
  padding: 10px 15px;
  position: sticky;
  top: 56px;
  width: 100%;
  z-index: 2;
}
.sidebar-link {
  height: 60px;
  max-height: 60px;
}
.sidebar-link-content {
  height: 56px;
  overflow: hidden;
}
.sr-debug {
  width: fit-content;
}
pre {
  white-space: pre-line;
}
</style>
