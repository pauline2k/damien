import axios from 'axios'
import {getApiBaseUrl} from '@/api/api-utils'

export function addEvaluationType(name) {
  return axios.post(`${getApiBaseUrl()}/api/evaluation_type/${name}`)
}

export function deleteEvaluationType(name) {
  return axios.delete(`${getApiBaseUrl()}/api/evaluation_type/${name}`)
}

export function getEvaluationTypes() {
  return axios.get(`${getApiBaseUrl()}/api/evaluation_types`)
}
