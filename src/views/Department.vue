<template>
  <div class="pt-2">
    <div class="align-center d-flex flex-wrap justify-space-between">
      <div>
        <h1
          v-if="get(department, 'deptName')"
          id="page-title"
          class="text-title"
          tabindex="-1"
        >
          <div class="d-flex flex-wrap">
            <div>
              <span>
                {{ department.deptName }}&MediumSpace;
                <span v-if="size(getCatalogListings(department))">
                  ({{ getCatalogListings(department).join(', ') }})&MediumSpace;
                </span>
              </span>
              <span v-if="contextStore.selectedTermName" class="mr-2">&mdash;&nbsp;</span>
            </div>
            <div v-if="contextStore.selectedTermName">
              {{ contextStore.selectedTermName }}
            </div>
          </div>
        </h1>
      </div>
      <div class="text-nowrap">
        <TermSelect :after-select="refresh" :term-ids="get(department, 'enrolledTerms')" />
      </div>
    </div>
    <v-container v-if="!contextStore.loading" class="mx-0 px-0 pb-2" fluid>
      <v-row justify="start">
        <v-col cols="12" md="5">
          <div class="contacts-container">
            <v-expansion-panels v-model="contactsPanel" disable-icon-rotate flat>
              <v-expansion-panel class="panel-override">
                <template #default>
                  <div class="align-center d-flex flex-wrap justify-space-between">
                    <h2 class="pb-1 px-2">Department Contacts</h2>
                    <div class="align-center d-flex height-unset justify-space-between">
                      <v-expansion-panel-title
                        class="w-fit-content ml-auto mr-3"
                        hide-actions
                        text
                        @click="collapseAllContacts"
                      >
                        <template #default="{open}">
                          <span v-if="!open">
                            Expand
                            <v-icon
                              class="rotate-180 ml-1"
                              :icon="mdiPlusBoxMultipleOutline"
                            />
                          </span>
                          <span v-if="open">
                            Collapse All
                            <v-icon class="rotate-180 ml-1" :icon="mdiMinusBoxMultipleOutline" />
                          </span>
                        </template>
                      </v-expansion-panel-title>
                    </div>
                  </div>
                  <v-expansion-panel-text class="panel-content-override">
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
                  <div v-if="contextStore.currentUser.isAdmin" class="pl-4">
                    <v-btn
                      v-if="!isCreatingNotification"
                      id="open-notification-form-btn"
                      class="ma-2 secondary text-capitalize"
                      :disabled="disableControls || isEmpty(contacts)"
                      @click="() => isCreatingNotification = true"
                    >
                      Send notification
                    </v-btn>
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
            <div v-if="contextStore.currentUser.isAdmin" class="pl-4">
              <v-btn
                v-if="!isAddingContact"
                id="add-dept-contact-btn"
                class="text-capitalize pl-2 my-1 mx-2"
                color="tertiary"
                @click="() => isAddingContact = true"
              >
                <v-icon :icon="mdiPlusThick" />
                Add Contact
              </v-btn>
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
          <DepartmentNote />
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="!contextStore.loading" class="mx-0 px-0 pb-6" fluid>
      <v-card outlined class="elevation-1">
        <EvaluationTable />
      </v-card>
    </v-container>
    <v-overlay :value="showTheOmenPoster" z-index="300">
      <v-card>
        <v-toolbar dark color="secondary" dense>
          <v-icon
            class="font-weight-bold pb-1 pl-0"
            :icon="mdiClose()"
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
import {computed, onMounted, ref} from 'vue'
import {filter as _filter, get, includes, isEmpty, size} from 'lodash'
import {mdiClose, mdiMinusBoxMultipleOutline, mdiPlusBoxMultipleOutline, mdiPlusThick} from '@mdi/js'
import {storeToRefs} from 'pinia'
import {useContextStore} from '@/stores/context'

const contextStore = useContextStore()
const departmentStore = useDepartmentStore()
const {contacts, department, disableControls, showTheOmenPoster} = storeToRefs(departmentStore)

const contactDetailsPanel = ref([])
const contactsPanel = ref(undefined)
const isAddingContact = ref(false)
const isCreatingNotification = ref(false)

const notificationRecipients = computed(() => {
  return {
    deptName: department.deptName,
    deptId: department.id,
    recipients: _filter(this.contacts, 'canReceiveCommunications')
  }
})

onMounted(() => departmentStore.setShowTheOmenPoster(this.$route.query.n === NUMBER_OF_THE_BEAST))

const afterSaveContact = () => {
  isAddingContact.value = false
  contactsPanel.value = 0
  alertScreenReader('Contact saved.')
  putFocusNextTick('add-dept-contact-btn')
}

const afterSendNotification = () => {
  isCreatingNotification.value = false
  useContextStore().snackbarOpen('Notification sent.')
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
  useContextStore().loadingStart()
  alertScreenReader(`Loading ${useContextStore().selectedTermName}`)
  const departmentId = get(this.$route, 'params.departmentId')
  departmentStore.init(departmentId).then(() => {
    useContextStore().loadingComplete(`${department.deptName} ${useContextStore().selectedTermName}`)
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
