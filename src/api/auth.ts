import axios from 'axios'
import store from '@/store'
import {getApiBaseUrl} from '@/api/api-utils'

export function devAuthLogIn(uid: string, password: string) {
  return axios
      .post(`${getApiBaseUrl()}/api/auth/dev_auth_login`, {uid, password})
        .then(data => {
          store.dispatch('context/setCurrentUser', data)
          return store.getters['context/currentUser']
        }, error => error)
}

export function getCasLoginURL() {
  return axios.get(`${getApiBaseUrl()}/api/auth/cas_login_url`)
}

export function getCasLogoutUrl() {
  return axios.get(`${getApiBaseUrl()}/api/auth/logout`)
}
