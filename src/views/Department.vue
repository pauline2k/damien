<template>
  <div class="pt-2">
    <div class="align-center d-flex flex-wrap justify-space-between">
      <div>
        <h1
          v-if="get(department, 'deptName')"
          id="page-title"
          tabindex="-1"
        >
          {{ department.deptName }}&MediumSpace;
          <span v-if="size(getCatalogListings(department))">
            ({{ getCatalogListings(department).join(', ') }})&MediumSpace;
          </span>
          <span v-if="contextStore.selectedTermName" class="mr-2">&mdash;&nbsp;</span>
          {{ contextStore.selectedTermName }}
        </h1>
      </div>
      <div class="text-no-wrap">
        <TermSelect :after-select="refresh" :term-ids="get(department, 'enrolledTerms')" />
      </div>
    </div>
    <v-container v-if="!contextStore.loading" class="mx-0 px-0 pb-2" fluid>
      <v-row justify="start">
        <v-col cols="12" md="5" class="pr-1">
          <div class="border-sm contacts-container h-100 pa-3">
            <v-expansion-panels v-model="contactsPanel" disable-icon-rotate flat>
              <v-expansion-panel class="panel-override">
                <template #default>
                  <div class="d-flex flex-wrap justify-space-between">
                    <h2 class="ml-2">Department Contacts</h2>
                    <v-expansion-panel-title
                      class="px-1 py-0 w-fit-content"
                      hide-actions
                      @click="collapseAllContacts"
                    >
                      <template #default="{expanded}">
                        <span v-if="!expanded">
                          Expand
                          <v-icon
                            class="rotate-180"
                            :icon="mdiPlusBoxMultipleOutline"
                          />
                        </span>
                        <span v-if="expanded">
                          Collapse All
                          <v-icon class="rotate-180 ml-1" :icon="mdiMinusBoxMultipleOutline" />
                        </span>
                      </template>
                    </v-expansion-panel-title>
                  </div>
                  <v-expansion-panel-text>
                    <v-expansion-panels
                      v-model="contactDetailsPanel"
                      flat
                      focusable
                      hover
                      multiple
                      tile
                    >
                      <DepartmentContact
                        v-for="(contact, index) in contacts"
                        :key="contact.id"
                        :contact="contact"
                        :index="index"
                        :is-expanded="includes(contactDetailsPanel, index)"
                      />
                    </v-expansion-panels>
                  </v-expansion-panel-text>
                  <div v-if="contextStore.currentUser.isAdmin" class="pl-2">
                    <v-btn
                      v-if="!isCreatingNotification"
                      id="open-notification-form-btn"
                      class="secondary text-capitalize"
                      color="primary"
                      :disabled="disableControls || isEmpty(contacts)"
                      text="Send notification"
                      @click="() => isCreatingNotification = true"
                    />
                    <NotificationForm
                      v-if="isCreatingNotification"
                      :after-send="afterSendNotification"
                      :on-cancel="cancelSendNotification"
                      :recipients="[notificationRecipients]"
                    />
                  </div>
                </template>
              </v-expansion-panel>
            </v-expansion-panels>
            <div v-if="currentUser.isAdmin" class="pl-2 pt-3">
              <v-btn
                v-if="!isAddingContact"
                id="add-dept-contact-btn"
                color="primary"
                :disabled="disableControls"
                :prepend-icon="mdiPlusThick"
                text="Add Contact"
                variant="text"
                @click="() => isAddingContact = true"
              />
              <EditDepartmentContact
                v-if="isAddingContact"
                :id="`add-department-contact`"
                :after-save="afterSaveContact"
                :on-cancel="onCancelAddContact"
              />
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="7">
          <div class="border-sm px-5 py-3">
            <DepartmentNote />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div v-if="!contextStore.loading" class="border-sm mt-3 py-5">
      <EvaluationTable />
    </div>
    <v-overlay :value="showTheOmenPoster" z-index="300">
      <v-card>
        <v-toolbar dark color="secondary" dense>
          <v-icon
            class="font-weight-bold pb-1 pl-0"
            :icon="mdiClose"
            @click="() => departmentStore.setShowTheOmenPoster(false)"
          />
        </v-toolbar>
        <v-card-text class="text-center py-2">
          <img
            alt="Movie poster of The Omen"
            class="omen-poster-img"
            src="@/assets/omen_poster.png"
          />
        </v-card-text>
      </v-card>
    </v-overlay>
  </div>
</template>

<script setup>
import DepartmentContact from '@/components/admin/DepartmentContact'
import DepartmentNote from '@/components/admin/DepartmentNote'
import EditDepartmentContact from '@/components/admin/EditDepartmentContact'
import EvaluationTable from '@/components/evaluation/EvaluationTable'
import NotificationForm from '@/components/admin/NotificationForm'
import TermSelect from '@/components/util/TermSelect'
import {NUMBER_OF_THE_BEAST, useDepartmentStore} from '@/stores/department/department-edit-session'
import {alertScreenReader, getCatalogListings, putFocusNextTick, scrollToTop} from '@/lib/utils'
import {computed, onMounted, ref, watch} from 'vue'
import {filter as _filter, get, includes, isEmpty, size} from 'lodash'
import {mdiClose, mdiMinusBoxMultipleOutline, mdiPlusBoxMultipleOutline, mdiPlusThick} from '@mdi/js'
import {storeToRefs} from 'pinia'
import {useContextStore} from '@/stores/context'
import {useRoute} from 'vue-router'

const contextStore = useContextStore()
const currentUser = contextStore.currentUser
const departmentStore = useDepartmentStore()
const {contacts, department, disableControls, showTheOmenPoster} = storeToRefs(departmentStore)

const contactDetailsPanel = ref([])
const contactsPanel = ref(undefined)
const isAddingContact = ref(false)
const isCreatingNotification = ref(false)
const route = useRoute()

const notificationRecipients = computed(() => {
  return {
    deptName: department.value.deptName,
    deptId: department.value.id,
    recipients: _filter(contacts.value, 'canReceiveCommunications')
  }
})

watch(isAddingContact, () => {
  departmentStore.setDisableControls(isAddingContact.value)
})

watch(isCreatingNotification, () => {
  departmentStore.setDisableControls(isCreatingNotification.value)
})

onMounted(() => departmentStore.setShowTheOmenPoster(route.query.n === NUMBER_OF_THE_BEAST))

const afterSaveContact = () => {
  isAddingContact.value = false
  contactsPanel.value = 0
  alertScreenReader('Contact saved.')
  putFocusNextTick('add-dept-contact-btn')
}

const afterSendNotification = () => {
  isCreatingNotification.value = false
  contextStore.snackbarOpen('Notification sent.')
  putFocusNextTick('open-notification-form-btn')
}

const cancelSendNotification = () => {
  isCreatingNotification.value = false
  alertScreenReader('Notification canceled.')
  scrollToTop(1000)
  putFocusNextTick('open-notification-form-btn')
}

const collapseAllContacts = () => {
  if (contactsPanel.value === 0) {
    contactDetailsPanel.value = []
  }
}

const onCancelAddContact = () => {
  isAddingContact.value = false
  alertScreenReader('Canceled. Nothing saved.')
  putFocusNextTick('add-dept-contact-btn')
}

const refresh = () => {
  contextStore.loadingStart()
  alertScreenReader(`Loading ${contextStore.selectedTermName}`)
  const departmentId = get(route, 'params.departmentId')
  departmentStore.init(departmentId).then(department => {
    contextStore.loadingComplete(`${department.deptName} ${contextStore.selectedTermName}`)
  })
}
</script>

<style scoped>
.contacts-container {
  max-width: 500px;
}
.omen-poster-img {
  height: 90vh;
}
.w-fit-content {
  width: fit-content;
}
</style>

<style>
.panel-override {
  background-color: unset !important;
}
</style>
