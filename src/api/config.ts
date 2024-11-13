import axios from 'axios'
import {getApiBaseUrl} from '@/api/api-utils'
import {useContextStore} from '@/stores/context'

export function getAutoPublishStatus() {
  return axios.get(`${getApiBaseUrl()}/api/auto_publish`)
    .then(response => response.data)
}

export function setAutoPublishStatus(enabled) {
  return axios.post(`${getApiBaseUrl()}/api/auto_publish/update`, {enabled})
    .then(response => response.data)
}

export function getServiceAnnouncement() {
  return axios.get(`${getApiBaseUrl()}/api/service_announcement`)
    .then(response => response.data)
}

export function updateServiceAnnouncement(text, isLive) {
  return axios.post(`${getApiBaseUrl()}/api/service_announcement/update`, {text, isLive}).then(response => {
      useContextStore().setServiceAnnouncement(response.data)
      return response.data
    })
    .catch(error => error)
}
