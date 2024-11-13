import axios from 'axios'
import {getApiBaseUrl} from '@/api/api-utils'

export function addEvaluationType(name) {
  return axios.post(`${getApiBaseUrl()}/api/evaluation_type/${name}`)
    .then(response => response.data)
}

export function deleteEvaluationType(name) {
  return axios.delete(`${getApiBaseUrl()}/api/evaluation_type/${name}`)
}

export function getEvaluationTypes(): any {
  return axios.get(`${getApiBaseUrl()}/api/evaluation_types`)
    .then(response => response.data)
}
