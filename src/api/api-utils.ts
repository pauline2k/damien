import {useContextStore} from '@/stores/context'

export function getApiBaseUrl() {
  return useContextStore().config.apiBaseUrl
}

export function getConfig() {
  return useContextStore().config
}
