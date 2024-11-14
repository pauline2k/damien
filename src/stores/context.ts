import {defineStore} from 'pinia'
import {putFocusNextTick} from '@/lib/utils'
import {find, noop} from 'lodash'
import {nextTick} from 'vue'

export type CurrentUser = {
  departments: any[],
  isAdmin: boolean,
  isAuthenticated: boolean,
  uid: string
}

export type DamienConfig = {
  apiBaseUrl: string,
  availableTerms: any[],
  currentTermId: string,
  departmentForms: any[],
  evaluationTypes: any[],
  isVueAppDebugMode: boolean,
}

export const useContextStore = defineStore('context', {
  state: () => ({
    config: {} as DamienConfig,
    currentUser: {
      isAdmin: false,
      isAuthenticated: false
    } as CurrentUser,
    isSelectedTermLocked: false,
    loading: false,
    screenReaderAlert: undefined as string | undefined,
    selectedTermId: undefined as string | undefined,
    selectedTermName: undefined,
    serviceAnnouncement: undefined,
    snackbar: {
      color: 'primary',
      text: undefined as string | undefined,
      timeout: 8000
    },
    snackbarShow: false
  }),
  actions: {
    alertScreenReader(message: string) {
      this.screenReaderAlert = ''
      nextTick(() => {
        this.screenReaderAlert = message
      }).then(noop)
    },
    loadingComplete(pageTitle: string, alert: string) {
      document.title = `${pageTitle || 'UC Berkeley'} | Course Evaluations`
      this.loading = false
      if (alert) {
        this.screenReaderAlert = alert
      } else if (pageTitle) {
        this.screenReaderAlert = `${pageTitle} page is ready`
      }
      putFocusNextTick('page-title')
    },
    loadingStart() {
      this.loading = true
    },
    selectTerm(termId: string) {
      return new Promise<void>(resolve => {
        const term = find(this.config.availableTerms, {'id': termId || this.config.currentTermId})
        if (term) {
          this.selectedTermId = term.id
          this.selectedTermName = term.name
          resolve()
        }
      })
    },
    setConfig(data: any) {
      this.config = data
    },
    setCurrentUser(currentUser: any) {
      this.currentUser = currentUser
    },
    setDepartmentForms(departmentForms: any) {
      this.config.departmentForms = departmentForms
    },
    setEvaluationTypes(evaluationTypes: any) {
      this.config.evaluationTypes = evaluationTypes
    },
    setIsSelectedTermLocked(isLocked: boolean) {
      this.isSelectedTermLocked = isLocked
    },
    setScreenReaderAlert(alert: string) {
      this.screenReaderAlert = alert
    },
    setSelectedTerm(termId: string) {
      return new Promise<void>(resolve => {
        const term = find(this.config.availableTerms, {'id': termId || this.config.currentTermId})
        if (term) {
          this.selectedTermId = term.id
          this.selectedTermName = term.name
          resolve()
        }
      })
    },
    setServiceAnnouncement(data: any) {
      this.serviceAnnouncement = data
    },
    snackbarClose() {
      this.snackbarShow = false
      this.snackbar.text = undefined
      this.screenReaderAlert = 'Message closed'
    },
    snackbarOpen(text: string, color: string) {
      this.snackbar.text = text
      this.snackbar.color = color || 'secondary'
      this.snackbarShow = true
    },
    snackbarReportError(text: string) {
      this.snackbar.text = text
      this.snackbar.color = 'error'
      this.snackbarShow = true
    },
    updateConfig(key: string, value: any) {
      this.config[key] = value
    }
  }
})


// const mutations = {

// }
