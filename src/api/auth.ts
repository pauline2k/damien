import axios from 'axios'
import {getApiBaseUrl} from '@/api/api-utils'
import {useContextStore} from '@/stores/context'

export function devAuthLogIn(uid: string, password: string) {
  return axios.post(`${getApiBaseUrl()}/api/auth/dev_auth_login`, {uid, password}).then(
    response => {
      const contextStore = useContextStore()
      contextStore.setCurrentUser(response.data)
      return contextStore.currentUser
    },
    error => error
  )
}

export function getCasLoginURL() {
  return axios.get(`${getApiBaseUrl()}/api/auth/cas_login_url`)
    .then(response => response.data)
}

export function getCasLogoutUrl() {
  return axios.get(`${getApiBaseUrl()}/api/auth/logout`)
    .then(response => response.data)
}
