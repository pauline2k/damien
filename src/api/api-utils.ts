import store from '@/store'

export function getApiBaseUrl() {
  return store.getters['context/config'].apiBaseUrl
}

export function getConfig() {
  return store.getters['context/config']
}
