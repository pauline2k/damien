import {get, some, startsWith, toInteger} from 'lodash'
import {useContextStore} from '@/stores/context'

const $_goToLogin = (to: any, next: any) => {
  const isValidRedirect = to.fullPath && !startsWith(to.fullPath, '/404') && !startsWith(to.fullPath, '/error')
  next({
    path: '/start',
    query: {
      error: to.query.error,
      redirect: isValidRedirect ? to.fullPath : undefined
    }
  })
}

export default {
  goToLogin: $_goToLogin,
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
  requiresDepartmentMembership: (to: any, from: any, next: any) => {
    const currentUser = useContextStore().currentUser
    if (currentUser.isAuthenticated) {
      const departmentId = toInteger(get(to, 'params.departmentId'))
      const goToNext = currentUser.isAdmin || some(currentUser.departments, department => department.id === departmentId)
      if (goToNext) {
        next()
      } else {
        next('/404')
      }
    } else {
      $_goToLogin(to, next)
    }
  }
}
