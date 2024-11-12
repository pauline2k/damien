import axios from 'axios'
import {getApiBaseUrl} from '@/api/api-utils'

export function exportEvaluations(termId: string) {
  return axios.post(`${getApiBaseUrl()}/api/evaluations/export?term_id=${termId}`)
}

export function getConfirmed(termId: string) {
  return axios.get(`${getApiBaseUrl()}/api/evaluations/confirmed?term_id=${termId}`)
}

export function getExportStatus() {
  return axios.get(`${getApiBaseUrl()}/api/evaluations/export/status`)
}

export function getExports(termId: string) {
  return axios.get(`${getApiBaseUrl()}/api/evaluations/exports?term_id=${termId}`)
}

export function getValidation(termId: string) {
  return axios.get(`${getApiBaseUrl()}/api/evaluations/validate?term_id=${termId}`)
}
