import axios from 'axios'
import {getApiBaseUrl} from '@/api/api-utils'

export function getSection(courseNumber: string, termId: string) {
  return axios.get(`${getApiBaseUrl()}/api/section/${courseNumber}?term_id=${termId}`)
    .then(response => response.data)
}
