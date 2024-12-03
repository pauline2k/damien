import {capitalize, find, get, size, trim} from 'lodash'
import auth from './auth'
import BaseView from '@/views/BaseView.vue'
import Department from '@/views/Department.vue'
import Error from '@/views/Error.vue'
import Login from '@/views/Login.vue'
import Megiddo from '@/views/Megiddo.vue'
import NannysRoom from '@/views/NannysRoom.vue'
import NotFound from '@/views/NotFound.vue'
import StatusBoard from '@/views/StatusBoard.vue'
import TheMonastery from '@/views/TheMonastery.vue'
import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import {getEvaluationTerm} from '@/api/evaluationTerms'
import {useContextStore} from '@/stores/context'

const setTerm = (to: any, from: any, next: any) => {
  const termId = get(to.query, 'term')
  if (termId && find(useContextStore().config.availableTerms, {id: termId})) {
    useContextStore().selectTerm(termId).then((term: any) => {
      getEvaluationTerm(term.id).then(data => {
        useContextStore().setIsSelectedTermLocked(data.isLocked === true)
        next()
      })
    })
  } else {
    next({
      path: to.path,
      query: {...to.query, term: useContextStore().selectedTermId || useContextStore().config.currentTermId}
    })
  }
}

const beforeEnterDefaultRoute = (to: any, from: any, next: any) => {
  const currentUser = useContextStore().currentUser
  if (currentUser.isAuthenticated) {
    if (currentUser.isAdmin) {
      next('/status')
    } else if (size(currentUser.departments)) {
      next(`/department/${currentUser.departments[0].id}`)
    } else {
      next({
        path: '/error',
        query: {
          m: 'Sorry, we could not find any departments that you belong to.'
        }
      })
    }
  } else {
    next()
  }
}

const routes:RouteRecordRaw[] = [
  {
    path: '/',
    component: Login,
    name: 'Login',
    beforeEnter: beforeEnterDefaultRoute,
    meta: {
      title: 'Welcome'
    }
  },
  {
    name: 'Start',
    path: '/start',
    redirect: () => {
      const currentUser = useContextStore().currentUser
      if (currentUser.isAuthenticated) {
        if (currentUser.isAdmin) {
          return {path: '/status'}
        } else if (size(currentUser.departments)) {
          return {path: `/department/${currentUser.departments[0].id}`}
        } else {
            return {
              path: '/error',
              query: {
                m: 'Sorry, we could not find any departments that you belong to.'
              }
            }
        }
      } else {
        return {name: 'Login'}
      }
    }
  },
  {
    path: '/',
    component: BaseView,
    children: [
      {
        path: '/department/:departmentId',
        component: Department,
        beforeEnter: [auth.requiresDepartmentMembership, setTerm],
        meta: {
          title: 'Department'
        }
      }
    ]
  },
  {
    path: '/',
    component: BaseView,
    beforeEnter: auth.requiresAdmin,
    children: [
      {
        path: '/departments',
        component: TheMonastery,
        meta: {
          title: 'Group Management'
        }
      },
      {
        path: '/publish',
        component: Megiddo,
        beforeEnter: setTerm,
        meta: {
          title: 'Publish'
        }
      },
      {
        path: '/lists',
        component: NannysRoom,
        meta: {
          title: 'List Management'
        }
      },
      {
        path: '/status',
        component: StatusBoard,
        beforeEnter: setTerm,
        meta: {
          title: 'Status Board'
        }
      }
    ]
  },
  {
    path: '/',
    component: BaseView,
    children: [
      {
        path: '/404',
        beforeEnter: (to: any, from: any, next: any) => {
          const currentUser = useContextStore().currentUser
          if (currentUser.isAuthenticated) {
            next()
          } else {
            auth.goToLogin(to, next)
          }
        },
        component: NotFound,
        meta: {
          title: 'Page not found'
        }
      },
      {
        path: '/error',
        component: Error,
        meta: {
          title: 'Error'
        }
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to: any, from: any, next: any) => {
  const redirect = trim(to.query.redirect)
  const currentUser = useContextStore().currentUser
  if (currentUser.isAuthenticated && redirect) {
    next(redirect)
  } else {
    next()
  }
})

router.afterEach((to: any) => {
  const title = get(to, 'meta.title') || capitalize(to.name) || 'Welcome'
  document.title = `${title} | Course Evaluations`
})

export default router
