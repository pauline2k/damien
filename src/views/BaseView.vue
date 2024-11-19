<template>
  <a
    id="skip-to-content-link"
    href="#content"
    class="sr-only"
    tabindex="0"
  >
    Skip to main content
  </a>
  <v-layout ref="layout">
    <v-app-bar
      app
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
      aria-labelledby="nav-header"
      class="font-size-14 pt-2"
      color="secondary"
      permanent
      :rail="isSidebarCollapsed"
      rail-width="50"
      role="navigation"
      :scrim="false"
      tag="nav"
      width="150"
    >
      <template #prepend>
        <h2 id="nav-header" class="sr-only" tabindex="-1">Main Menu</h2>
      </template>
      <template #append>
        <div class="d-flex justify-end pa-2">
          <v-btn
            id="sidebar-toggle-btn"
            aria-hidden
            class="px-0"
            color="primary-contrast"
            variant="tonal"
            min-width="34"
            @click="() => isSidebarCollapsed = !isSidebarCollapsed"
          >
            <v-icon :icon="isSidebarCollapsed ? mdiArrowExpandRight : mdiArrowCollapseLeft" />
          </v-btn>
        </div>
      </template>
      <v-list-item
        v-for="(item, index) in navItems"
        :id="`sidebar-link-${index}`"
        :key="index"
        class="text-primary-contrast py-4 px-3"
        link
        role="link"
        @click="toRoute(item.path)"
      >
        <div class="align-center d-flex">
          <v-icon :icon="item.icon" />
          <div class="ml-3 text-no-wrap" role="link">
            {{ item.title }}
          </div>
        </div>
      </v-list-item>
      <v-list-item
        :id="`sidebar-link-${size(navItems)}`"
        class="text-primary-contrast py-4 px-3"
        @click="toggleColorScheme"
      >
        <div class="align-center d-flex">
          <v-icon aria-label="Lightbulb icon" :icon="mdiLightbulb" />
          <div class="ml-3 text-no-wrap" role="button">
            {{ theme.global.current.value.dark ? 'Light' : 'Dark' }} mode
          </div>
        </div>
      </v-list-item>
    </v-navigation-drawer>
    <v-main id="content" class="ma-0" :style="`--v-layout-bottom: ${footerHeight}px;`">
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
  </v-layout>
</template>

<script setup>
import DamienFooter from '@/components/util/DamienFooter'
import Snackbar from '@/components/util/Snackbar'
import Spinner from '@/components/util/Spinner'
import {alertScreenReader, stripAnchorRef} from '@/lib/utils'
import {computed, onMounted, ref} from 'vue'
import {get, map, size} from 'lodash'
import {getCasLogoutUrl} from '@/api/auth'
import {
  mdiAccountGroup,
  mdiAlertCircle,
  mdiArrowCollapseLeft,
  mdiArrowExpandRight,
  mdiLightbulb,
  mdiListStatus,
  mdiPlaylistEdit
} from '@mdi/js'
import {useContextStore} from '@/stores/context'
import {useTheme} from 'vuetify'
import {useRoute, useRouter} from 'vue-router'

const contextStore = useContextStore()
const currentUser = contextStore.currentUser
const isSidebarCollapsed = ref(false)
const layout = ref()
const navItems = ref(undefined)
const route = useRoute()
const router = useRouter()
const theme = useTheme()

const footerHeight = computed(() => {
  const footer = layout.value ? layout.value.getLayoutItem('footer') : null
  return get(footer, 'size', 60)
})

onMounted(() => {
  prefersColorScheme()
  if (currentUser.isAdmin) {
    navItems.value = [
      {title: 'Status', icon: mdiListStatus, path: '/status'},
      {title: 'Publish', icon: mdiAlertCircle, path: '/publish'},
      {title: 'Departments', icon: mdiAccountGroup, path: '/departments'},
      {title: 'Settings', icon: mdiPlaylistEdit, path: '/lists'}
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
pre {
  white-space: pre-line;
}
</style>
