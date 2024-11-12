import axios from 'axios'
import {getApiBaseUrl} from '@/api/api-utils'

export function getUserDepartmentForms(uid: string) {
  return axios.get(`${getApiBaseUrl()}/api/user/${uid}/forms`)
}

export function searchUsers(snippet: string, excludeUids: string[]) {
  return axios.post(`${getApiBaseUrl()}/api/user/search`, {snippet, excludeUids}).then(response => response, () => null)
}
