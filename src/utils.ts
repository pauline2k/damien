import {get} from 'lodash'
import router from './router'
import store from '@/store'

export function axiosErrorHandler(error) {
  const errorStatus = get(error, 'response.status')
    const currentUser = store.getters['context/currentUser']
  if (currentUser.isAuthenticated) {
    if (errorStatus === 404) {
      router.push({path: '/404'})
    } else if (errorStatus >= 400) {
      const message = get(error, 'response.data.message') || error.message
      // eslint-disable-next-line no-console
      console.error(message)
      router.push({
        path: '/error',
        query: {
          m: message
        }
      })
    } else if (errorStatus === 400) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  } else {
    router.push({
      path: '/login',
      query: {
        m: 'Your session has expired'
      }
    })
  }
}
