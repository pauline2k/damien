import {
  getDepartment,
} from '@/api/departments'
import {
  each,
  find,
  get
} from 'lodash'
import {DateTime} from 'luxon'
import {getConfig} from '@/api/api-utils'
import {defineStore} from 'pinia'
import {useContextStore} from '@/stores/context'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const $_decorateEvaluation = (e, allEvaluations) => { // eslint-disable-line no-unused-vars
  e.isSelected = false
  e.searchableCourseName = [
    e.subjectArea,
    e.catalogId,
    e.instructionFormat,
    e.sectionNumber,
    e.courseTitle
  ].join(' ')

  // Sort catalog ids by numeric portion first.
  const sortableCatalogId = `${e.catalogId.replace(/\D/g,'').padStart(3, '0')} ${e.catalogId}`
  e.sortableCourseName = [
    e.subjectArea,
    sortableCatalogId,
    e.instructionFormat,
    e.sectionNumber
  ].join(' ')
  e.sortableCourseNumber = e.courseNumber

  // When sorting by course number or name, keep cross-listings with home sections.
  if (e.crossListedWith || e.roomSharedWith) {
    let homeSection
    each((e.crossListedWith || e.roomSharedWith), s => {
      const candidateHomeSection = find(allEvaluations, {'courseNumber': s})
      if (candidateHomeSection && !candidateHomeSection.foreignDepartmentCourse && (e.foreignDepartmentCourse || e.courseNumber > candidateHomeSection.courseNumber)) {
        homeSection = candidateHomeSection
        return false
      }
    })
    if (homeSection) {
      e.sortableCourseNumber = `${homeSection.courseNumber}-${e.courseNumber}`
      const homeSectionSortableCatalogId = `${homeSection.catalogId.replace(/\D/g,'').padStart(3, '0')} ${homeSection.catalogId}`
      e.sortableCourseName = [
        homeSection.subjectArea,
        homeSectionSortableCatalogId,
        homeSection.instructionFormat,
        homeSection.sectionNumber,
        e.sortableCourseName
      ].join(' ')
    }
  }
  if (e.instructor) {
    e.searchableInstructor = `${e.instructor.firstName} ${e.instructor.lastName} ${e.instructor.uid} ${e.instructor.emailAddress}`
    e.sortableInstructor = `${e.instructor.lastName} ${e.instructor.firstName} ${e.instructor.uid} ${e.instructor.emailAddress}`
  } else {
    e.searchableInstructor = ''
    e.sortableInstructor = ''
  }
  e.startDate = DateTime.fromISO(e.startDate).toJSDate()
  e.endDate = DateTime.fromISO(e.endDate).toJSDate()
  e.lastUpdated = DateTime.fromISO(e.lastUpdated).toJSDate()
  e.meetingDates.start = DateTime.fromISO(e.meetingDates.start).toJSDate()
  const courseEndDate = DateTime.fromISO(e.meetingDates.end)
  e.meetingDates.end = courseEndDate.toJSDate()

  const selectedTerm = find(getConfig().availableTerms, {'id': e.termId})
  const defaultEndDate = DateTime.fromISO(get(selectedTerm, 'defaultDates.end'))
  let lastEndDate = courseEndDate > defaultEndDate ? courseEndDate : defaultEndDate
  if (lastEndDate === defaultEndDate && !selectedTerm.name.includes('Summer')) {
    lastEndDate = lastEndDate.plus({days: 2})
  }
  const endDateDiff = courseEndDate.diff(e.meetingDates.start, ['days'])
  e.maxStartDate = endDateDiff.days < 90 ? lastEndDate.minus({days: 13}).toJSDate() : lastEndDate.minus({days: 20}).toJSDate()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const $_refresh = (commit, departmentId) => { // eslint-disable-line no-unused-vars
  return new Promise<void>(resolve => {
    const termId = useContextStore().selectedTermId || getConfig().currentTermId
    getDepartment(departmentId, termId).then((department: any) => {
      commit('reset', department)
      commit('updateSelectedEvaluationIds')
      return resolve(department)
    })
  })
}

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    activeDepartmentForms: [],
    allDepartmentForms: [],
    contacts: [],
    department: undefined,
    disableControls: false,
    errorDialog: false,
    errorDialogText: null,
    evaluations: [],
    note: undefined,
    selectedEvaluationIds: [] as any[],
    showTheOmenPoster: undefined
  }),
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addSection(sectionId, termId) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteContact(userId: number) { // eslint-disable-line no-unused-vars
      // TODO
    },
    deselectAllEvaluations() {
      // TODO
    },
    dismissErrorDialog() {
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    editEvaluation(evaluationId, sectionId, termId, fields) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filterSelectedEvaluations(searchFilterResults, enabledStatuses) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init(departmentId: number) { // eslint-disable-line no-unused-vars
      // TODO
      return new Promise<void>(resolve => {
        resolve()
      })
    },
    refreshAll() {
      // TODO
      return new Promise<void>(resolve => {
        resolve()
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refreshSection(sectionId, termId) { // eslint-disable-line no-unused-vars
      // TODO
      return new Promise<void>(resolve => {
        resolve()
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectAllEvaluations(enabledStatuses: string[]) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setEvaluations(evaluations: any[]) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setDisableControls(disable: boolean) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelectedEvaluations(selectedEvaluationIds: boolean) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setShowTheOmenPoster(show: boolean) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showErrorDialog(text: string) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toggleSelectEvaluation(evaluation: any) { // eslint-disable-line no-unused-vars
      // TODO
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateContact(contact: any) { // eslint-disable-line no-unused-vars
      // TODO
      return new Promise<void>(resolve => {
        resolve()
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateNote(note, termId) { // eslint-disable-line no-unused-vars
      // TODO
      return new Promise<void>(resolve => {
        resolve()
      })
    },
    updateSelectedEvaluationIds() {
      // TODO
    }
  }
})

// const getters = {
//   activeDepartmentForms: (state: any): any[] => state.activeDepartmentForms,
//   allDepartmentForms: (state: any): any[] => state.allDepartmentForms,
//   contacts: (state: any): any[] => state.contacts,
//   department: (state: any): number => state.department,
//   disableControls: (state: any): boolean => state.disableControls,
//   errorDialog: (state: any): boolean => state.errorDialog,
//   errorDialogText: (state: any): boolean => state.errorDialogText,
//   evaluations: (state: any): any[] => state.evaluations,
//   note: (state: any): string => state.note,
//   selectedEvaluationIds: (state: any): any[] => state.selectedEvaluationIds,
//   showTheOmenPoster: (): boolean => !!state.showTheOmenPoster
// }
//
// const actions = {
//   addSection: ({commit, state}, {sectionId, termId}) => {
//     commit('setDisableControls', true)
//     return new Promise((resolve: Function, reject) => {
//       addSection(state.department.id, sectionId, termId)
//       .then(() => {
//         getSectionEvaluations(state.department.id, sectionId, termId).then((data: any) => {
//           const updatedEvaluations = each(data, e => $_decorateEvaluation(e, state.evaluations))
//           commit('setEvaluationUpdate', {sectionIndex: 0, sectionCount: 0, updatedEvaluations})
//           resolve()
//         })
//       })
//       .catch(error => reject(error))
//     })
//   },
//   deleteContact: ({commit, state}, userId: number) => {
//     commit('setDisableControls', true)
//     return deleteContact(state.department.id, userId).then(() => {
//       $_refresh(commit, state.department.id)
//     })
//   },
//   deselectAllEvaluations: ({commit}) => {
//     commit('deselectAllEvaluations')
//   },
//   dismissErrorDialog: ({commit}) => {
//     commit('setErrorDialog', false)
//     commit('setErrorDialogText', null)
//   },
//   editEvaluation: ({commit, state}, {evaluationId, sectionId, termId, fields}) => {
//     commit('setDisableControls', true)
//     return new Promise((resolve: Function, reject) => {
//       updateEvaluations(state.department.id, 'edit', [evaluationId], termId, fields)
//       .then(() => {
//         getSectionEvaluations(state.department.id, sectionId, termId).then((data: any) => {
//           let sectionIndex = findIndex(state.evaluations, ['courseNumber', sectionId])
//           if (sectionIndex === -1) {
//             sectionIndex = state.evaluations.length
//           }
//           const sectionCount = filter(state.evaluations, ['courseNumber', sectionId]).length
//           const updatedEvaluations = each(data, e => $_decorateEvaluation(e, state.evaluations))
//           commit('setEvaluationUpdate', {sectionIndex, sectionCount, updatedEvaluations})
//           resolve()
//         })
//       }, error => reject(error))
//       .finally(() => commit('setDisableControls', false))
//     })
//   },
//   filterSelectedEvaluations: ({commit}, {searchFilterResults, enabledStatuses}) => {
//     commit('filterSelectedEvaluations', {searchFilterResults, enabledStatuses})
//   },
//   init: ({commit}, departmentId: number) => {
//     commit('setDepartment', null)
//     commit('setActiveDepartmentForms', reject(getConfig().departmentForms, 'deletedAt'))
//     commit('setAllDepartmentForms', getConfig().departmentForms)
//     return new Promise<void>(resolve => {
//       $_refresh(commit, departmentId)
//         .then(commit('updateSelectedEvaluationIds'))
//         .then(department => resolve(department))
//     })
//   },
//   refreshAll: ({commit, state}) => {
//     return new Promise<void>(resolve => {
//       $_refresh(commit, state.department.id).then(dept => resolve(dept))
//     })
//   },
//   refreshSection: ({commit, state}, {sectionId, termId}) => {
//     return new Promise((resolve: Function) => {
//       getSectionEvaluations(state.department.id, sectionId, termId).then((data: any) => {
//         let sectionIndex = findIndex(state.evaluations, ['courseNumber', sectionId])
//         if (sectionIndex === -1) {
//           sectionIndex = state.evaluations.length
//         }
//         const updatedEvaluations = each(data, e => $_decorateEvaluation(e, state.evaluations))
//         const sectionCount = updatedEvaluations.length
//         commit('setEvaluationUpdate', {sectionIndex, sectionCount, updatedEvaluations})
//         resolve()
//       })
//     })
//   },
//   selectAllEvaluations: ({commit}, enabledStatuses: string[]) => {
//     commit('selectAllEvaluations', enabledStatuses)
//   },
//   setEvaluations: ({commit}, evaluations: any[]) => {
//     commit('setEvaluations', evaluations)
//   },
//   setDisableControls: ({commit}, disable: boolean) => commit('setDisableControls', disable),
//   setSelectedEvaluations: ({commit}, selectedEvaluationIds: boolean) => {
//     commit('setSelectedEvaluationIds', selectedEvaluationIds)
//   },
//   setShowTheOmenPoster: ({commit}, show: boolean) => commit('setShowTheOmenPoster', show),
//   showErrorDialog: ({commit}, text: string) => {
//     commit('setErrorDialog', true)
//     commit('setErrorDialogText', text)
//   },
//   toggleSelectEvaluation: ({commit}, evaluation: any) => {
//     commit('setIsSelected', evaluation.id)
//     const course = `${evaluation.subjectArea} ${evaluation.catalogId} ${evaluation.instructionFormat} ${evaluation.sectionNumber} (${evaluation.courseNumber})`
//     const message = `${state.selectedEvaluationIds.includes(evaluation.id) ? '' : 'un'}selected ${course} evaluation`
//     store.dispatch('context/alertScreenReader', message).then(noop)
//   },
//   updateContact: ({commit, state}, contact: any) => {
//     commit('setDisableControls', true)
//     return new Promise<void>(resolve => {
//       updateContact(state.department.id, contact).then(() => {
//         $_refresh(commit, state.department.id).then(dept => resolve(dept))
//       })
//     })
//   },
//   updateNote: ({commit, state}, {note, termId}) => {
//     commit('setDisableControls', true)
//     return new Promise<void>(resolve => {
//       updateDepartmentNote(state.department.id, note, termId).then(() => {
//         $_refresh(commit, state.department.id).then(dept => resolve(dept))
//       })
//     })
//   },
//   updateSelectedEvaluationIds: ({commit}) => {
//     commit('updateSelectedEvaluationIds')
//   }
// }
//
// const mutations = {
//   deselectAllEvaluations: (state: any) => {
//     state.selectedEvaluationIds = []
//     each(state.evaluations, e => {
//       e.isSelected = false
//     })
//   },
//   filterSelectedEvaluations: (state: any, {searchFilterResults, enabledStatuses}) => {
//     const selectedSearchFilterResultIds = intersectionWith(state.selectedEvaluationIds, searchFilterResults, (id: number|string, e: any) => {
//       return toString(e.id) === toString(id)
//     })
//     const selectedEvaluationIds: any[] = []
//     each(state.evaluations, e => {
//       if (includes(enabledStatuses, e.status || 'unmarked') && includes(selectedSearchFilterResultIds, e.id)) {
//         e.isSelected = true
//         selectedEvaluationIds.push(e.id)
//       } else {
//         e.isSelected = false
//       }
//     })
//     state.selectedEvaluationIds = selectedEvaluationIds
//   },
//   reset: (state, department) => {
//     if (department) {
//       state.contacts = department.contacts
//       state.department = department
//       each(department.evaluations, e => $_decorateEvaluation(e, department.evaluations))
//       state.evaluations = sortBy(department.evaluations, 'sortableCourseName')
//       state.note = get(department, 'note.note')
//     }
//     state.selectedEvaluationIds = []
//     state.disableControls = false
//   },
//   selectAllEvaluations: (state: any, {searchFilterResults, enabledStatuses}) => {
//     const selectedEvaluationIds: any[] = []
//     each(state.evaluations, e => {
//       if (includes(enabledStatuses, e.status || 'unmarked') && some(searchFilterResults, {'id': e.id})) {
//         e.isSelected = true
//         selectedEvaluationIds.push(e.id)
//       }
//     })
//     state.selectedEvaluationIds = selectedEvaluationIds
//   },
//   setActiveDepartmentForms: (state: any, departmentForms: any[]) => state.activeDepartmentForms = departmentForms,
//   setAllDepartmentForms: (state: any, departmentForms: any[]) => state.allDepartmentForms = departmentForms,
//   setDepartment: (state: any, department: any) => state.department = department,
//   setDisableControls: (state: any, disable: boolean) => state.disableControls = disable,
//   setErrorDialog: (state: any, errorDialog: boolean) => state.errorDialog = errorDialog,
//   setErrorDialogText: (state: any, errorDialogText: string) => state.errorDialogText = errorDialogText,
//   setEvaluations: (state: any, evaluations: any[]) => {
//     each(evaluations, e => $_decorateEvaluation(e, evaluations))
//     state.evaluations = evaluations
//   },
//   setEvaluationUpdate: (state: any, {sectionIndex, sectionCount, updatedEvaluations}) => {
//     const evaluations = sortBy(updatedEvaluations, 'sortableCourseName')
//     state.evaluations.splice(sectionIndex, sectionCount, ...evaluations)
//   },
//   setIsSelected: (state: any, evaluationId: any) => {
//     const evaluation = find(state.evaluations, {'id': evaluationId})
//     if (evaluation) {
//       const index = indexOf(state.selectedEvaluationIds, evaluationId)
//       if (index === -1 && !evaluation.isSelected) {
//         evaluation.isSelected = true
//         state.selectedEvaluationIds.push(evaluationId)
//       } else {
//         evaluation.isSelected = false
//         state.selectedEvaluationIds.splice(index, 1)
//       }
//     }
//   },
//   setSelectedEvaluationIds: (state: any, selectedEvaluationIds: any) => {
//     state.selectedEvaluationIds = selectedEvaluationIds
//     each(state.evaluations, e => {
//       if (includes(selectedEvaluationIds, e.id)) {
//         e.isSelected = true
//       }
//     })
//   },
//   setShowTheOmenPoster: (state: any, show: boolean) => {
//     // This easter-egg flag can only be enabled once.
//     if (!show || isUndefined(state.showTheOmenPoster)) {
//       state.showTheOmenPoster = show
//     }
//   },
//   updateSelectedEvaluationIds: (state: any) => {
//     state.selectedEvaluationIds = reduce(state.evaluations, (ids, e) => {
//       if (e.isSelected) {
//         ids.push(e.id)
//       }
//       return ids
//     }, [])
//   }
// }