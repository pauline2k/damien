<template>
  <div class="pt-2">
    <v-row no-gutters>
      <v-col cols="9" class="d-flex align-center">
        <h1
          id="page-title"
          class="py-2 text-title"
          tabindex="-1"
        >
          Evaluation Status Dashboard - {{ contextStore.selectedTermName }}
        </h1>
      </v-col>
      <v-col cols="3">
        <TermSelect />
      </v-col>
    </v-row>
    <v-card outlined class="elevation-1">
      <v-data-table
        id="department-table"
        disable-pagination
        :disable-sort="contextStore.loading"
        :headers="departmentHeaders"
        hide-default-footer
        hide-default-header
        :items="departments"
        :loading="contextStore.loading || !contextStore.selectedTermId"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >
        <template #header="{props: {headers}}">
          <SortableTableHeader :headers="headers" :on-sort="sort">
            <template #select>
              <div class="d-flex flex-row notify-all py-2">
                <label class="sr-only" for="checkbox-select-dept-all">Select all department rows</label>
                <v-checkbox
                  id="checkbox-select-dept-all"
                  class="align-center mt-0 pt-0"
                  color="tertiary"
                  :disabled="contextStore.loading"
                  hide-details
                  :indeterminate="someDepartmentsSelected"
                  :ripple="false"
                  :value="allDepartmentsSelected"
                  @change="toggleSelectAll"
                />
                <div class="d-flex align-center">Send notification</div>
                <v-btn
                  v-if="!isCreatingNotification"
                  id="open-notification-form-btn"
                  class="ma-2 secondary text-capitalize"
                  color="secondary"
                  :disabled="isEmpty(selectedDepartmentIds) || contextStore.loading"
                  small
                  text="Apply"
                  @click="() => isCreatingNotification = true"
                />
              </div>
            </template>
          </SortableTableHeader>
        </template>
        <template #body="{items}">
          <tbody class="h-100vh">
            <template v-for="(department, index) in items" :key="department.name">
              <tr :id="`department-${index}`">
                <td>
                  <label class="sr-only" :for="`checkbox-select-dept-${kebabCase(department.deptName)}`">
                    {{ department.deptName }}
                  </label>
                  <v-checkbox
                    :id="`checkbox-select-dept-${kebabCase(department.deptName)}`"
                    class="align-center mt-0 pt-0"
                    color="tertiary"
                    :disabled="contextStore.loading"
                    hide-details
                    :ripple="false"
                    :value="isSelected(department)"
                    @change="toggleSelect(department)"
                  />
                </td>
                <td class="department-name">
                  <div class="d-flex align-top">
                    <router-link :id="`link-to-dept-${kebabCase(department.deptName)}`" :to="`/department/${department.id}`">
                      {{ department.deptName }}
                      <span v-if="size(getCatalogListings(department))">({{ getCatalogListings(department).join(', ') }})</span>
                    </router-link>
                  </div>
                </td>
                <td :id="`last-updated-dept-${department.id}`" class="department-lastUpdated">
                  <span v-if="department.lastUpdated">
                    {{ toLocaleFromISO(department.lastUpdated) }}
                  </span>
                </td>
                <td class="department-errors">
                  <v-chip
                    v-if="department.totalInError"
                    :id="`errors-count-dept-${department.id}`"
                    class="error error--text error-count"
                    outlined
                    small
                  >
                    {{ department.totalInError }} <span class="sr-only">errors</span>
                  </v-chip>
                  <v-icon
                    v-if="!department.totalInError"
                    aria-hidden="false"
                    aria-label="no errors"
                    class="success--text"
                    :icon="mdiCheckCircle"
                    role="img"
                  />
                </td>
                <td class="department-confirmed">
                  <v-icon
                    v-if="department.totalConfirmed > 0 && department.totalConfirmed === department.totalEvaluations"
                    aria-hidden="false"
                    aria-label="all confirmed"
                    class="success--text"
                    :icon="mdiCheckCircle"
                    role="img"
                  />
                  <span v-if="department.totalConfirmed === 0 || department.totalConfirmed < department.totalEvaluations">
                    <span aria-hidden="true">{{ department.totalConfirmed }} / {{ department.totalEvaluations }}</span>
                    <span class="sr-only">{{ department.totalConfirmed }} of {{ department.totalEvaluations }} confirmed</span>
                  </span>
                </td>
                <td class="department-note">
                  <pre class="body-2 text-condensed truncate-with-ellipsis">{{ get(department, 'note.note') }}</pre>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="isCreatingNotification"
      scrollable
      width="600"
    >
      <NotificationForm
        v-if="isCreatingNotification"
        :after-send="afterSendNotification"
        :on-cancel="cancelSendNotification"
        :recipients="notificationRecipients"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import {useContextStore} from '@/stores/context'
const contextStore = useContextStore()
</script>

<script>
import NotificationForm from '@/components/admin/NotificationForm'
import SortableTableHeader from '@/components/util/SortableTableHeader'
import TermSelect from '@/components/util/TermSelect'
import {alertScreenReader, getCatalogListings, putFocusNextTick, toLocaleFromISO} from '@/lib/utils'
import {each, filter as _filter, get, includes, indexOf, isEmpty, kebabCase, map, size} from 'lodash'
import {getDepartmentsEnrolled} from '@/api/departments'
import {mdiCheckCircle} from '@mdi/js'

export default {
  name: 'StatusBoard',
  components: {NotificationForm, SortableTableHeader, TermSelect},
  data: () => ({
    blockers: {},
    departments: [],
    departmentHeaders: [
      {class: 'text-start text-nowrap px-4', text: 'Select', value: 'select', width: '30px'},
      {class: 'text-nowrap pt-12 pb-3', text: 'Department', value: 'deptName', width: '50%'},
      {class: 'text-nowrap pt-12 pb-3', text: 'Last Updated', value: 'lastUpdated', width: '20%'},
      {class: 'text-nowrap pt-12 pb-3', text: 'Errors', value: 'totalInError', width: '10%'},
      {class: 'text-nowrap pt-12 pb-3', text: 'Confirmed', value: 'totalConfirmed', width: '10%'},
      {class: 'text-nowrap pt-12 pb-3', text: 'Notes', value: 'note.note', width: '30%'}
    ],
    isCreatingNotification: false,
    isExporting: false,
    mdiCheckCircle,
    selectedDepartmentIds: [],
    sortBy: null,
    sortDesc: false
  }),
  computed: {
    allDepartmentsSelected() {
      return !!(size(this.selectedDepartmentIds) && size(this.selectedDepartmentIds) === size(this.departments))
    },
    notificationRecipients() {
      let recipients = []
      each(this.departments, d => {
        if (this.isSelected(d)) {
          const departmentRecipients = _filter(d.contacts, 'canReceiveCommunications')
          if (departmentRecipients.length) {
            recipients.push({
              'deptId': d.id,
              'deptName': d.deptName,
              'recipients': _filter(d.contacts, 'canReceiveCommunications')
            })
          }
        }
      })
      return recipients
    },
    someDepartmentsSelected() {
      return !!(size(this.selectedDepartmentIds) && size(this.selectedDepartmentIds) < size(this.departments))
    }
  },
  created() {
    useContextStore().loadingStart()
    alertScreenReader(`Loading ${useContextStore().selectedTermName}`)
    this.departments = []
    getDepartmentsEnrolled(true, false, true, useContextStore().selectedTermId).then(data => {
      this.departments = data
      this.loadBlockers().then(() => {
        useContextStore().loadingComplete(`Evaluation Status Dashboard for ${useContextStore().selectedTermName}`)
        putFocusNextTick('page-title')
      })
    })
  },
  methods: {
    afterSendNotification() {
      this.selectedDepartmentIds = []
      this.isCreatingNotification = false
      alertScreenReader('Notification sent.')
      putFocusNextTick('open-notification-form-btn')
    },
    cancelSendNotification() {
      this.isCreatingNotification = false
      alertScreenReader('Notification canceled.')
      putFocusNextTick('open-notification-form-btn')
    },
    get,
    getCatalogListings,
    isEmpty,
    isSelected(department) {
      return includes(this.selectedDepartmentIds, department.id)
    },
    kebabCase,
    loadBlockers() {
      return new Promise(resolve => {
        this.blockers = {}
        each(this.departments, d => {
          if (d.totalBlockers) {
            this.blockers[d.deptName] = d.totalBlockers
          }
        })
        resolve()
      })
    },
    size,
    sort(sortBy, sortDesc) {
      this.sortBy = sortBy
      this.sortDesc = sortDesc
    },
    toggleSelect(department) {
      const index = indexOf(this.selectedDepartmentIds, department.id)
      const isSelecting = index === -1
      if (isSelecting) {
        this.selectedDepartmentIds.push(department.id)
      } else {
        this.selectedDepartmentIds.splice(index, 1)
      }
      alertScreenReader(`${department.name} ${isSelecting ? '' : 'un'}selected`)
    },
    toggleSelectAll() {
      this.selectedDepartmentIds = this.allDepartmentsSelected ? [] : map(this.departments, 'id')
      alertScreenReader(`All departments ${this.allDepartmentsSelected ? '' : 'un'}selected.`)
    },
    toLocaleFromISO
  }
}
</script>

<style scoped>
.department-confirmed {
  min-width: 100px;
}
.department-errors {
  min-width: 80px;
}
.department-lastUpdated {
  min-width: 130px;
}
.department-name {
  min-width: 250px;
}
.department-note {
  max-width: 400px;
}
.error-count {
  border-width: 2px;
  font-weight: bold;
  padding: 0 7px;
}
.notify-all {
  position: absolute;
  top: 0;
}
</style>
