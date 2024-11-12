import {get, some, toInteger} from 'lodash'
import {useContextStore} from '@/stores/context'

const $_goToLogin = (to: any, next: any) => {
  next({
    path: '/login',
    query: {
      error: to.query.error,
      redirect: to.name === 'home' ? undefined : to.fullPath
    }
  })
}

export default {
  requiresAdmin: (to: any, from: any, next: any) => {
    const currentUser = useContextStore().currentUser
    if (currentUser.isAuthenticated) {
      if (currentUser.isAdmin) {
        next()
      } else {
        next({path: '/404'})
      }
    } else {
      $_goToLogin(to, next)
    }
  },
  requiresAuthenticated: (to: any, from: any, next: any) => {
    const currentUser = useContextStore().currentUser
    if (currentUser.isAuthenticated) {
      next()
    } else {
      $_goToLogin(to, next)
    }
  },
  requiresDepartmentMembership: (to: any, from: any, next: any) => {
    const currentUser = useContextStore().currentUser
    const departmentId = get(to, 'params.departmentId')
    if (currentUser.isAdmin || some(currentUser.departments, department => {
      return department.id === toInteger(departmentId)
    })) {
      next()
    } else {
      next('/404')
    }
  }
}
