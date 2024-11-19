<template>
  <div class="pt-2">
    <div class="d-flex">
      <h1
        id="page-title"
        class="text-title"
        tabindex="-1"
      >
        List Management
      </h1>
      <v-spacer class="d-flex justify-center"></v-spacer>
      <v-banner
        v-if="contextStore.config.isVueAppDebugMode && contextStore.config.easterEggMonastery && theme.current.dark"
        shaped
        single-line
        class="pr-4 my-auto"
      >
        <a :href="contextStore.config.easterEggNannysRoom" target="_blank">The Nanny's Room</a>
      </v-banner>
    </div>
    <v-container class="px-0 mx-0" fluid>
      <v-row>
        <v-col cols="12" md="6" lg="3">
          <v-card
            class="mr-4"
            elevation="2"
            height="100%"
            min-width="fit-content"
          >
            <v-card-title
              id="department-forms-card-title"
              class="pb-0"
              tabindex="-1"
            >
              Department Forms
            </v-card-title>
            <v-btn
              v-if="!isAddingDepartmentForm"
              id="add-dept-form-btn"
              class="text-capitalize pl-3 mb-1"
              color="tertiary"
              :disabled="disableControls"
              @click="onClickAddDepartmentForm"
            >
              <v-icon :icon="mdiPlusThick" />
              Add new department form
            </v-btn>
            <v-form v-if="isAddingDepartmentForm" class="px-4 pb-4" @submit.prevent="onSubmitAddDepartmentForm">
              <label :for="'input-dept-form-name'" class="form-label">
                Form name
              </label>
              <v-text-field
                :id="'input-dept-form-name'"
                v-model="newItemName"
                class="mt-1"
                color="tertiary"
                density="compact"
                :disabled="isSaving"
                outlined
                required
                @keydown.esc="cancelAdd('add-dept-form-btn')"
              />
              <v-btn
                :id="'save-dept-form-btn'"
                class="text-capitalize mr-2"
                color="secondary"
                :disabled="!newItemName || isSaving"
                elevation="2"
                @click="onSubmitAddDepartmentForm"
              >
                Save
              </v-btn>
              <v-btn
                :id="'cancel-save-dept-form-btn'"
                class="text-capitalize ml-1"
                :disabled="isSaving"
                elevation="2"
                outlined
                text
                @click="cancelAdd('add-dept-form-btn')"
              >
                Cancel
              </v-btn>
            </v-form>
            <div class="nannys-list overflow-y-auto">
              <v-data-table
                id="dept-forms-table"
                density="compact"
                disable-pagination
                :headers="[{key: 'name', class: 'pl-3', sortable: true, title: 'Form Name', value: 'name'}]"
                hide-default-footer
                :items="departmentForms"
                item-key="name"
                :sort-by="sortBy.departmentForms"
              >
                <template #headers="{columns, isSorted, toggleSort, getSortIcon, sortBy: _sortBy}">
                  <SortableTableHeader
                    :id="'form-'"
                    :columns="columns"
                    :is-sorted="isSorted"
                    :on-sort="toggleSort"
                    :sort-desc="get(_sortBy, 'order') === 'desc'"
                    :sort-icon="getSortIcon"
                  />
                </template>
                <template #item.name="{item}">
                  <div class="d-flex justify-space-between">
                    <span>{{ item.name }}</span>
                    <v-btn
                      :id="`delete-dept-form-${item.id}-btn`"
                      class="text-capitalize px-2 py-0"
                      color="tertiary"
                      :disabled="disableControls"
                      height="unset"
                      min-width="unset"
                      text
                      @click.stop="() => confirmDeleteDepartmentForm(item)"
                    >
                      Delete
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-card
            class="mr-4"
            elevation="2"
            height="100%"
            min-width="fit-content"
          >
            <v-card-title
              id="evaluation-types-card-title"
              class="pb-0"
              tabindex="-1"
            >
              Evaluation Types
            </v-card-title>
            <v-btn
              v-if="!isAddingEvaluationType"
              id="add-eval-type-btn"
              class="text-capitalize pl-3 mb-1"
              color="tertiary"
              :disabled="disableControls"
              text
              @click="onClickAddEvaluationType"
            >
              <v-icon :icon="mdiPlusThick" />
              Add new evaluation type
            </v-btn>
            <v-form v-if="isAddingEvaluationType" class="px-4 pb-4" @submit.prevent="onSubmitAddEvaluationType">
              <label :for="'input-eval-type-name'" class="form-label">
                Type name
              </label>
              <v-text-field
                :id="'input-eval-type-name'"
                v-model="newItemName"
                class="mt-1"
                color="tertiary"
                density="compact"
                :disabled="isSaving"
                outlined
                required
                @keydown.esc="cancelAdd('add-eval-type-btn')"
              />
              <v-btn
                :id="'save-eval-type-btn'"
                class="text-capitalize mr-2"
                color="secondary"
                :disabled="!newItemName || isSaving"
                elevation="2"
                @click="onSubmitAddEvaluationType"
              >
                Save
              </v-btn>
              <v-btn
                :id="'cancel-save-eval-type-btn'"
                class="text-capitalize ml-1"
                :disabled="isSaving"
                elevation="2"
                outlined
                text
                @click="cancelAdd('add-eval-type-btn')"
              >
                Cancel
              </v-btn>
            </v-form>
            <div class="nannys-list overflow-y-auto">
              <v-data-table
                id="evaluation-types-table"
                density="compact"
                disable-pagination
                :headers="[{key: 'name', class: 'pl-3', sortable: true, title: 'Type Name', value: 'name'}]"
                hide-default-footer
                :items="evaluationTypes"
                item-key="name"
                :sort-by="sortBy.evaluationTypes"
              >
                <template #headers="{columns, isSorted, toggleSort, getSortIcon, sortBy: _sortBy}">
                  <SortableTableHeader
                    :id="'eval-'"
                    :columns="columns"
                    :is-sorted="isSorted"
                    :on-sort="toggleSort"
                    :sort-desc="get(_sortBy, 'order') === 'desc'"
                    :sort-icon="getSortIcon"
                  />
                </template>
                <template #item.name="{item}">
                  <div class="d-flex justify-space-between">
                    <span>{{ item.name }}</span>
                    <v-btn
                      :id="`delete-eval-type-${item.id}-btn`"
                      class="text-capitalize px-2 py-0"
                      color="tertiary"
                      :disabled="disableControls"
                      height="unset"
                      min-width="unset"
                      text
                      @click.stop="() => confirmDeleteEvaluationType(item)"
                    >
                      Delete
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card
            class="mr-4"
            elevation="2"
            min-width="fit-content"
          >
            <v-card-title
              id="manually-added-instructors-title"
              class="pb-0"
              tabindex="-1"
            >
              Manually Added Instructors
            </v-card-title>
            <v-btn
              v-if="!isAddingInstructor"
              id="add-instructor-btn"
              class="text-capitalize pl-2 my-1"
              color="tertiary"
              :disabled="disableControls"
              text
              @click="onClickAddInstructor"
            >
              <v-icon :icon="mdiPlusThick" />
              Add new instructor
            </v-btn>
            <v-form
              v-if="isAddingInstructor"
              class="px-4 pb-4"
              @submit.prevent="onSubmitAddInstructor"
            >
              <label for="input-instructor-uid" class="form-label">
                UID
              </label>
              <v-text-field
                id="input-instructor-uid"
                v-model="newInstructor.uid"
                class="mt-1"
                color="tertiary"
                density="compact"
                :disabled="isSaving"
                outlined
                required
                :rules="rules.numeric"
              />
              <label for="input-instructor-csid" class="form-label">
                CSID
              </label>
              <v-text-field
                id="input-instructor-csid"
                v-model="newInstructor.csid"
                class="mt-1"
                color="tertiary"
                density="compact"
                :disabled="isSaving"
                outlined
                :rules="rules.numeric"
              />
              <label for="input-instructor-first-name" class="form-label">
                First name
              </label>
              <v-text-field
                id="input-instructor-first-name"
                v-model="newInstructor.firstName"
                class="mt-1"
                color="tertiary"
                density="compact"
                :disabled="isSaving"
                outlined
              />
              <label for="input-instructor-last-name" class="form-label">
                Last name
              </label>
              <v-text-field
                id="input-instructor-last-name"
                v-model="newInstructor.lastName"
                class="mt-1"
                color="tertiary"
                density="compact"
                :disabled="isSaving"
                outlined
                required
              />
              <label for="input-instructor-last-name" class="form-label">
                Email
              </label>
              <v-text-field
                id="input-instructor-email"
                v-model="newInstructor.emailAddress"
                class="mt-1"
                color="tertiary"
                density="compact"
                :disabled="isSaving"
                outlined
                required
                :rules="rules.email"
              />
              <v-btn
                id="save-instructor-btn"
                class="text-capitalize mr-2"
                color="secondary"
                :disabled="!newInstructor.uid || !newInstructor.lastName || !newInstructor.emailAddress || isSaving"
                elevation="2"
                @click="onSubmitAddInstructor"
              >
                Save
              </v-btn>
              <v-btn
                id="cancel-save-instructor-btn"
                class="text-capitalize ml-1"
                :disabled="!instructorValid || isSaving"
                elevation="2"
                outlined
                text
                @click="cancelAdd('add-instructor-btn')"
              >
                Cancel
              </v-btn>
            </v-form>
            <div class="nannys-list overflow-y-auto">
              <v-data-table
                id="instructors-table"
                density="compact"
                disable-pagination
                :headers="instructorHeaders"
                hide-default-footer
                :items="instructors"
                :sort-by="sortBy.instructors"
              >
                <template #headers="{columns, isSorted, toggleSort, getSortIcon, sortBy: _sortBy}">
                  <SortableTableHeader
                    :id="'instructor-'"
                    :columns="columns"
                    :is-sorted="isSorted"
                    :on-sort="toggleSort"
                    :sort-desc="get(_sortBy, 'order') === 'desc'"
                    :sort-icon="getSortIcon"
                  />
                </template>
                <template #item.delete="{ item }">
                  <v-btn
                    :id="`delete-instructor-${item.uid}-btn`"
                    class="text-capitalize px-2 py-0"
                    color="tertiary"
                    :disabled="disableControls"
                    height="unset"
                    min-width="unset"
                    text
                    @click.stop="() => confirmDeleteInstructor(item)"
                  >
                    Delete
                  </v-btn>
                </template>
                <template #no-data>
                  <div class="muted--text my-5">
                    No manually added instructors
                  </div>
                </template>
              </v-data-table>
            </div>
          </v-card>
          <v-card elevation="2" class="mr-4 mt-4">
            <v-card-title>Service Announcement</v-card-title>
            <EditServiceAnnouncement />
          </v-card>
          <v-card elevation="2" class="mr-4 mt-4">
            <v-card-title>Automatically Publish</v-card-title>
            <v-card-text>
              <span v-if="contextStore.config.scheduleLochRefresh">
                When enabled, publication will run daily at
                {{ `${String(contextStore.config.scheduleLochRefresh.hour).padStart(2, '0')}:${String(contextStore.config.scheduleLochRefresh.minute).padStart(2, '0')}` }}
                local time, immediately before loch refresh.
              </span>
              <span v-if="!contextStore.config.scheduleLochRefresh">
                Nightly loch refresh must be scheduled in app configs to enable auto-publish.
              </span>
              <v-switch
                id="auto-publish-enabled"
                v-model="autoPublishEnabled"
                :aria-label="`Auto-publish is ${autoPublishEnabled ? 'enabled' : 'disabled'}`"
                color="success"
                density="compact"
                :disabled="!contextStore.config.scheduleLochRefresh"
                hide-details
                :label="autoPublishEnabled ? 'Enabled' : 'Disabled'"
                @change="toggleAutoPublishEnabled(autoPublishEnabled)"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <ConfirmDialog
      v-if="isConfirming"
      :disabled="disableControls"
      :on-click-cancel="cancelDelete"
      :on-click-confirm="confirmDelete"
      :text="`Are you sure you want to delete ${get(itemToDelete, 'name')}?`"
      :title="`Delete ${get(itemToDelete, 'description')}?`"
    />
  </div>
</template>

<script setup>
import ConfirmDialog from '@/components/util/ConfirmDialog'
import EditServiceAnnouncement from '@/components/admin/EditServiceAnnouncement'
import SortableTableHeader from '@/components/util/SortableTableHeader'
import {alertScreenReader, putFocusNextTick} from '@/lib/utils'
import {get} from 'lodash'
import {getAutoPublishStatus, setAutoPublishStatus} from '@/api/config'
import {mdiPlusThick} from '@mdi/js'
import {onMounted, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useContextStore} from '@/stores/context'
import {useTheme} from 'vuetify'
import {useListManagementStore} from '@/stores/list-management-session'

const contextStore = useContextStore()
const listStore = useListManagementStore()

const autoPublishEnabled = ref(undefined)
const {departmentForms, disableControls, evaluationTypes, instructors, isAddingDepartmentForm, isAddingEvaluationType, isAddingInstructor, isConfirming} = storeToRefs(listStore)
const instructorValid = ref(true)
const rules = {
  email: [
    v => !!v || 'E-mail is required',
    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ],
  numeric: [v => !/[^\d]/.test(v) || 'Invalid number.']
}
const instructorHeaders = [
  {key: 'uid', class: 'pl-3', sortable: true, title: 'UID', value: 'uid'},
  {key: 'csid', class: 'pl-3', sortable: true, title: 'SID', value: 'csid'},
  {key: 'firstName', class: 'pl-3', sortable: true, title: 'First Name', value: 'firstName'},
  {key: 'lastName', class: 'pl-3', sortable: true, title: 'Last Name', value: 'lastName'},
  {key: 'email', class: 'pl-3', sortable: true, title: 'Email', value: 'email'},
  {key: 'delete', class: 'pl-3', sortable: false, title: '', value: 'delete'}
]
const newInstructor = ref(null)
const newItemName = ref(null)
const sortBy = ref({
  departmentForms: [{key: 'name', order: 'asc'}],
  evaluationTypes: [{key: 'name', order: 'asc'}],
  instructors: [{key: 'uid', order: 'asc'}]
})
const theme = useTheme()

onMounted(() => {
  contextStore.loadingStart()
  resetNewInstructor()
  listStore.init().then(() => {
    contextStore.loadingComplete('List Management')
    putFocusNextTick('page-title')
  })
  getAutoPublishStatus().then(data => {
    autoPublishEnabled.value = data.enabled
  })
})

const afterDelete = deletedItem => {
  listStore.setDisableControls(false)
  alertScreenReader(`Deleted ${deletedItem.description} ${deletedItem.name}.`)
}

const cancelAdd = elementId => {
  newItemName.value = ''
  resetNewInstructor()
  listStore.reset()
  alertScreenReader('Canceled. Nothing saved.')
  putFocusNextTick(elementId)
}

const cancelDelete = () => {
  putFocusNextTick(this.itemToDelete.elementId)
  listStore.reset()
  alertScreenReader('Canceled. Nothing deleted.')
}

const confirmDelete = () => {
  listStore.setDisableControls(true)
  listStore.onDelete().then(afterDelete)
}

const onClickAddDepartmentForm = () => {
  listStore.setAddingDepartmentForm().then(() => {
    newItemName.value = ''
    putFocusNextTick('input-dept-form-name')
  })
}

const onClickAddEvaluationType = () => {
  listStore.setAddingEvaluationType().then(() => {
    newItemName.value = ''
    putFocusNextTick('input-eval-type-name')
  })
}

const onClickAddInstructor = () => {
  listStore.setAddingInstructor().then(() => {
    resetNewInstructor()
    putFocusNextTick('input-instructor-uid')
  })
}

const onSubmitAddDepartmentForm = () => {
  if (newItemName.value) {
    listStore.addDepartmentForm(newItemName.value).then(() => {
      alertScreenReader(`Created department form ${newItemName.value}.`)
      newItemName.value = ''
      putFocusNextTick('add-dept-form-btn')
    })
  }
}

const onSubmitAddInstructor = () => {
  if (newInstructor.value) {
    listStore.addInstructor(newInstructor.value).then(() => {
      alertScreenReader(`Added instructor with UID ${newInstructor.value.uid}.`)
      resetNewInstructor()
      putFocusNextTick('add-instructor-btn')
    })
  }
}

const onSubmitAddEvaluationType = () => {
  if (newItemName.value) {
    listStore.addEvaluationType(newItemName.value).then(() => {
      alertScreenReader(`Created evaluation type ${newItemName.value}.`)
      newItemName.value = ''
      putFocusNextTick('add-eval-type-btn')
    })
  }
}

const resetNewInstructor = () => {
  newInstructor.value = {
    'csid': null,
    'emailAddress': null,
    'firstName': null,
    'lastName': null,
    'uid': null
  }
}

const toggleAutoPublishEnabled = enabled => {
  setAutoPublishStatus(enabled).then(data => {
    autoPublishEnabled.value = data.enabled
    alertScreenReader(`Auto-publish ${autoPublishEnabled.value ? 'enabled' : 'disabled'}`)
  })
}
</script>

<style scoped>
.nannys-list {
  max-height: 500px;
}
</style>
