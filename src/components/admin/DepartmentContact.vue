<template>
  <v-expansion-panel
    :id="`department-contact-${index}`"
    class="text-condensed my-1"
    :class="{
      'theme--light v-sheet--outlined': isEditing && !theme.global.current.value.dark,
      'theme--dark v-sheet--outlined': isEditing && theme.global.current.value.dark
    }"
  >
    <v-expansion-panel-title class="py-1 rounded-b-0 height-unset">
      <strong :id="`dept-contact-${contact.id}-name`">{{ fullName }}</strong>
    </v-expansion-panel-title>
    <v-expansion-panel-text class="edit-contact-container">
      <v-container v-if="!isEditing" class="pb-0 px-0" fluid>
        <v-row :id="`dept-contact-${contact.id}-email`">
          <v-col cols="12">{{ contact.email }}</v-col>
        </v-row>
        <v-row :id="`dept-contact-${contact.id}-notifications`" class="mt-1">
          <v-col class="" cols="1">
            <v-icon
              class="pb-1"
              :class="contact.canReceiveCommunications ? 'success--text' : 'muted--text'"
              small
            >
              {{ contact.canReceiveCommunications ? 'mdi-check-circle' : 'mdi-minus-circle' }}
            </v-icon>
          </v-col>
          <v-col class="font-italic pl-0" cols="11">
            {{ `${contact.canReceiveCommunications ? 'Does' : 'Does not'} receive notifications` }}
          </v-col>
        </v-row>
        <v-row :id="`dept-contact-${contact.id}-permissions`" class="mt-1">
          <v-col cols="1">
            <v-icon :class="contact.canViewReports ? 'success--text' : 'muted--text'" small>
              {{ contact.canViewReports ? 'mdi-check-circle' : 'mdi-minus-circle' }}
            </v-icon>
          </v-col>
          <v-col class="font-italic pl-0" cols="11">
            <span v-if="!contact.canViewReports">Does not have access to Blue</span>
            <span v-if="contact.canViewReports">
              {{ `Can view reports ${contact.canViewResponseRates ? 'and response rates ' : ''}in Blue` }}
            </span>
          </v-col>
        </v-row>
        <v-row :id="`dept-contact-${contact.id}-deptForms`" class="my-1">
          <v-col cols="12">
            <v-chip
              v-for="(form, formIndex) in departmentForms"
              :id="`dept-contact-${contact.id}-form-${formIndex}`"
              :key="form.id"
              class="px-4 mr-1"
              disabled
              :ripple="false"
            >
              {{ form.name }}
            </v-chip>
          </v-col>
        </v-row>
        <v-row class="my-0" no-gutters>
          <v-col class="pl-0" cols="12">
            <v-toolbar
              v-if="currentUser.isAdmin"
              :id="`dept-contact-${contact.id}-actions`"
              class="pl-0"
              dense
              flat
              height="unset"
              tag="div"
            >
              <v-btn
                :id="`edit-dept-contact-${contact.id}-btn`"
                class="text-capitalize pa-0"
                color="tertiary"
                :disabled="disableControls"
                height="unset"
                min-width="unset"
                text
                @click="() => isEditing = true"
              >
                Edit
              </v-btn>
              <v-divider
                class="separator mx-2"
                role="presentation"
                vertical
              ></v-divider>
              <v-btn
                :id="`delete-dept-contact-${contact.id}-btn`"
                class="text-capitalize pa-0"
                color="tertiary"
                :disabled="disableControls"
                height="unset"
                min-width="unset"
                text
                @click.stop="() => isConfirming = true"
              >
                Delete
              </v-btn>
              <ConfirmDialog
                v-if="isConfirming"
                :disabled="disableControls"
                :on-click-cancel="onCancelDelete"
                :on-click-confirm="onDelete"
                :text="`Are you sure you want to remove ${fullName}?`"
                :title="'Delete contact?'"
              />
            </v-toolbar>
          </v-col>
        </v-row>
      </v-container>
      <EditDepartmentContact
        v-if="isEditing"
        :id="`edit-department-contact-${contact.id}`"
        :after-save="afterSave"
        :contact="contact"
        :on-cancel="onCancelEdit"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
import ConfirmDialog from '@/components/util/ConfirmDialog'
import EditDepartmentContact from '@/components/admin/EditDepartmentContact'
import {computed, ref, watch} from 'vue'
import {putFocusNextTick} from '@/lib/utils'
import {sortBy} from 'lodash'
import {useContextStore} from '@/stores/context'
import {useDepartmentStore} from '@/stores/department-edit-session'
import {useTheme} from 'vuetify'

const props = defineProps({
  contact: {
    required: true,
    type: Object
  },
  index: {
    required: true,
    type: Number
  },
  isExpanded: {
    required: false,
    type: Boolean
  }
})

const contextStore = useContextStore()

const currentUser = contextStore.currentUser
const departmentForms = computed(() => sortBy(props.contact.departmentForms, 'name'))
const fullName = computed(() => `${props.contact.firstName} ${props.contact.lastName}`)
const isConfirming = ref(false)
const isEditing = ref(false)
const theme = useTheme()

watch(() => props.isExpanded, () => {
  if (!props.isExpanded) {
    isEditing.value = false
  }
})

const afterSave = () => {
  isEditing.value = false
  contextStore.alertScreenReader(`Updated contact ${fullName.value}.`)
  putFocusNextTick(`edit-dept-contact-${props.contact.id}-btn`)
}

const onCancelDelete = () => {
  isConfirming.value = false
  contextStore.alertScreenReader('Canceled. Nothing deleted.')
  putFocusNextTick(`delete-dept-contact-${props.contact.id}-btn`)
}

const onCancelEdit = () => {
  isEditing.value = false
  contextStore.alertScreenReader('Canceled. Nothing saved.')
  putFocusNextTick(`edit-dept-contact-${props.contact.id}-btn`)
}

const onDelete = () => {
  const nameOfDeleted = fullName.value
  useDepartmentStore().deleteContact(props.contact.userId).then(() => {
    isConfirming.value = false
    contextStore.alertScreenReader(`Deleted contact ${nameOfDeleted}.`)
    putFocusNextTick('add-dept-contact-btn')
  })
}
</script>

<style scoped>
.edit-contact-container {
  border-radius: 4px;
  border: 2px solid #eee;
}
.v-expansion-panel::before {
   box-shadow: none !important;
}
</style>
