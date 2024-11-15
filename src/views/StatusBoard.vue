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
import NotificationForm from '@/components/admin/NotificationForm'
import SortableTableHeader from '@/components/util/SortableTableHeader'
import TermSelect from '@/components/util/TermSelect'
import {alertScreenReader, getCatalogListings, putFocusNextTick, toLocaleFromISO} from '@/lib/utils'
import {computed, onMounted, ref} from 'vue'
import {each, filter as _filter, get, includes, indexOf, isEmpty, kebabCase, map, size} from 'lodash'
import {getDepartmentsEnrolled} from '@/api/departments'
import {mdiCheckCircle} from '@mdi/js'
import {useContextStore} from '@/stores/context'

const contextStore = useContextStore()
const blockers = ref({})
const departments = ref([])
const departmentHeaders = [
  {class: 'text-start text-nowrap px-4', text: 'Select', value: 'select', width: '30px'},
  {class: 'text-nowrap pt-12 pb-3', text: 'Department', value: 'deptName', width: '50%'},
  {class: 'text-nowrap pt-12 pb-3', text: 'Last Updated', value: 'lastUpdated', width: '20%'},
  {class: 'text-nowrap pt-12 pb-3', text: 'Errors', value: 'totalInError', width: '10%'},
  {class: 'text-nowrap pt-12 pb-3', text: 'Confirmed', value: 'totalConfirmed', width: '10%'},
  {class: 'text-nowrap pt-12 pb-3', text: 'Notes', value: 'note.note', width: '30%'}
]
const isCreatingNotification = ref(false)
const selectedDepartmentIds = ref([])
const sortBy = ref(null)
const sortDesc = ref(false)

const allDepartmentsSelected = computed(() => {
  return !!(size(selectedDepartmentIds.value) && size(selectedDepartmentIds.value) === size(departments.value))
})
const notificationRecipients = computed(() => {
  let recipients = []
  each(departments.value, d => {
    if (isSelected(d)) {
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
})
const someDepartmentsSelected = computed(() => {
  return !!(size(selectedDepartmentIds.value) && size(selectedDepartmentIds.value) < size(departments.value))
})

onMounted(() => {
  useContextStore().loadingStart()
  alertScreenReader(`Loading ${useContextStore().selectedTermName}`)
  departments.value = []
  getDepartmentsEnrolled(true, false, true, useContextStore().selectedTermId).then(data => {
    departments.value = data
    loadBlockers().then(() => {
      useContextStore().loadingComplete(`Evaluation Status Dashboard for ${useContextStore().selectedTermName}`)
      putFocusNextTick('page-title')
    })
  })
})

const afterSendNotification = () => {
  selectedDepartmentIds.value = []
  isCreatingNotification.value = false
  alertScreenReader('Notification sent.')
  putFocusNextTick('open-notification-form-btn')
}

const cancelSendNotification = () => {
  isCreatingNotification.value = false
  alertScreenReader('Notification canceled.')
  putFocusNextTick('open-notification-form-btn')
}

const isSelected = department => {
  return includes(selectedDepartmentIds.value, department.id)
}

const loadBlockers = () => {
  return new Promise(resolve => {
    blockers.value = {}
    each(departments.value, d => {
      if (d.totalBlockers) {
        blockers.value[d.deptName] = d.totalBlockers
      }
    })
    resolve()
  })
}

const sort = (sortBy, sortDesc) => {
  sortBy.value = sortBy
  sortDesc.value = sortDesc
}

const toggleSelect = department => {
  const index = indexOf(selectedDepartmentIds.value, department.id)
  const isSelecting = index === -1
  if (isSelecting) {
    selectedDepartmentIds.value.push(department.id)
  } else {
    selectedDepartmentIds.value.splice(index, 1)
  }
  alertScreenReader(`${department.name} ${isSelecting ? '' : 'un'}selected`)
}

const toggleSelectAll = () => {
  selectedDepartmentIds.value = allDepartmentsSelected.value ? [] : map(departments.value, 'id')
  alertScreenReader(`All departments ${allDepartmentsSelected.value ? '' : 'un'}selected.`)
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
