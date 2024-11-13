import axios from 'axios'
import {getApiBaseUrl} from '@/api/api-utils'

export function addDepartmentForm(name: any) {
  return axios.post(`${getApiBaseUrl()}/api/department_form/${name}`)
    .then(response => response.data)
}

export function deleteDepartmentForm(name: any) {
  return axios.delete(`${getApiBaseUrl()}/api/department_form/${name}`)
}

export function getDepartmentForms(): any {
  return axios.get(`${getApiBaseUrl()}/api/department_forms`)
    .then(response => response.data)
}
