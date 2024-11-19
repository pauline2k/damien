<template>
  <v-app :style="{background: theme.global.current.value.dark ? theme.themes.value.dark.colors.background : theme.themes.value.light.colors.background}">
    <a
      id="skip-to-content-link"
      href="#content"
      class="sr-only"
      tabindex="0"
    >
      Skip to main content
    </a>
    <v-app-bar
      app
      class="align-center nav"
      clipped-left
      color="primary"
      dark
    >
      <div class="text-h4 ml-3 text-no-wrap">
        Course Evaluations
      </div>
      <div class="ml-auto pr-4">
        <v-menu offset-y rounded="lg">
          <template #activator="{props: menuProps}">
            <v-btn
              id="btn-main-menu"
              color="secondary"
              variant="flat"
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
    <v-navigation-drawer
      color="secondary"
      :mobile="false"
      :rail="rail"
      @mouseenter="() => rail = false"
      @mouseleave="() => rail = true"
    >
      <v-list-item
        v-for="(item, index) in navItems"
        :id="`sidebar-link-${index}`"
        :key="index"
        class="sidebar-link"
        link
        role="link"
        @click="toRoute(item.path)"
      >
        <div class="align-center d-flex">
          <v-icon :icon="item.icon" />
          <v-slide-x-transition>
            <div v-show="!rail" class="ml-2 text-no-wrap">
              {{ item.title }}
            </div>
          </v-slide-x-transition>
        </div>
      </v-list-item>
      <v-list-item
        :id="`sidebar-link-${size(navItems)}`"
        class="mt-auto pr-1 sidebar-link text-primary-contrast"
        @click="toggleColorScheme"
      >
        <div class="align-center d-flex">
          <v-icon aria-label="Lightbulb icon" :icon="mdiLightbulb" />
          <v-slide-x-transition>
            <div v-show="!rail" class="ml-2 text-no-wrap">
              {{ theme.global.current.value.dark ? 'Light' : 'Dark' }} mode
            </div>
          </v-slide-x-transition>
        </div>
      </v-list-item>
    </v-navigation-drawer>
    <v-main id="content" class="ma-0">
      <Snackbar />
      <Spinner v-if="contextStore.loading" />
      <div
        v-if="contextStore.serviceAnnouncement && contextStore.serviceAnnouncement.isLive"
        class="service-announcement"
      >
        <pre>
          <span
            id="service-announcement"
            v-linkified
            class="body-2"
            aria-live="polite"
            role="alert"
            v-html="contextStore.serviceAnnouncement.text"
          />
        </pre>
      </div>
      <router-view :key="stripAnchorRef(route.fullPath)" class="px-4"></router-view>
    </v-main>
    <DamienFooter />
  </v-app>
</template>

<script setup>
import DamienFooter from '@/components/util/DamienFooter'
import Snackbar from '@/components/util/Snackbar'
import Spinner from '@/components/util/Spinner'
import {alertScreenReader, stripAnchorRef} from '@/lib/utils'
import {getCasLogoutUrl} from '@/api/auth'
import {map, size} from 'lodash'
import {mdiAccountGroup, mdiAlertCircle, mdiLightbulb, mdiListStatus, mdiPlaylistEdit} from '@mdi/js'
import {onMounted, ref} from 'vue'
import {useContextStore} from '@/stores/context'
import {useTheme} from 'vuetify'
import {useRoute, useRouter} from 'vue-router'

const contextStore = useContextStore()
const currentUser = contextStore.currentUser
const navItems = ref(undefined)
const rail = ref(true)
const route = useRoute()
const router = useRouter()
const theme = useTheme()

onMounted(() => {
  prefersColorScheme()
  if (currentUser.isAdmin) {
    navItems.value = [
      {title: 'Status Board', icon: mdiListStatus, path: '/status'},
      {title: 'Publish', icon: mdiAlertCircle, path: '/publish'},
      {title: 'Group Management', icon: mdiAccountGroup, path: '/departments'},
      {title: 'List Management', icon: mdiPlaylistEdit, path: '/lists'}
    ]
  } else if (size(currentUser.departments)) {
    navItems.value = map(currentUser.departments, department => {
      const firstInitial = department.name.charAt(0).toLowerCase()
      return {
        title: department.name,
        icon: `mdi-alpha-${firstInitial}-circle`,
        path: `/department/${department.id}`
      }
    })
  }
})

const logOut = () => {
  alertScreenReader('Logging out')
  getCasLogoutUrl().then(data => window.location.href = data.casLogoutUrl)
}

const prefersColorScheme = () => {
  let prefersDarkMode
  if (window.localStorage.getItem('prefersDarkMode')) {
    prefersDarkMode = window.localStorage.getItem('prefersDarkMode') === 'true'
  } else {
    prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  theme.global.name.value = prefersDarkMode ? 'dark' : 'light'
}

const toggleColorScheme = () => {
  const getDark = !theme.global.current.value.dark
  theme.global.name.value = getDark ? 'dark' : 'light'
  window.localStorage.setItem('prefersDarkMode', `${getDark}`)
}

const toRoute = path => router.push({path})
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
pre {
  white-space: pre-line;
}
</style>
