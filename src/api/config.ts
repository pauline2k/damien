import axios from 'axios'
import store from '../store'
import {getApiBaseUrl} from '@/api/api-utils'

export function getAutoPublishStatus() {
  return axios.get(`${getApiBaseUrl()}/api/auto_publish`)
}

export function setAutoPublishStatus(enabled) {
  return axios.post(`${getApiBaseUrl()}/api/auto_publish/update`, {enabled})
}

export function getServiceAnnouncement() {
  return axios.get(`${getApiBaseUrl()}/api/service_announcement`)
}

export function updateServiceAnnouncement(text, isLive) {
  return axios
    .post(`${getApiBaseUrl()}/api/service_announcement/update`, {text, isLive})
    .then(response => {
      store.commit('context/setServiceAnnouncement', response)
      return response
    })
    .catch(error => error)
}
