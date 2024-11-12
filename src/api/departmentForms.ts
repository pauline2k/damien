import axios from 'axios'
import {getApiBaseUrl} from '@/api/api-utils'

export function addDepartmentForm(name: string) {
  return axios.post(`${getApiBaseUrl()}/api/department_form/${name}`)
}

export function deleteDepartmentForm(name: string) {
  return axios.delete(`${getApiBaseUrl()}/api/department_form/${name}`)
}

export function getDepartmentForms() {
  return axios.get(`${getApiBaseUrl()}/api/department_forms`)
}
