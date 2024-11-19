<template>
  <v-form
    v-model="valid"
    class="pa-3"
    lazy-validation
  >
    <div v-if="!contact">
      <h3 id="add-contact-sub-header" class="form-title my-2" tabindex="-1">
        Add Contact
      </h3>
      <PersonLookup
        class="mt-1 mb-4"
        :exclude-uids="map(contacts, 'uid')"
        :on-select-result="onSelectSearchResult"
      />
    </div>
    <div v-if="uid" class="department-contact-form">
      <label :for="`input-email-${contactId}`" class="form-label">
        Email Address
      </label>
      <v-text-field
        :id="`input-email-${contactId}`"
        v-model="email"
        class="mt-1"
        color="tertiary"
        dense
        :disabled="disableControls"
        outlined
        required
        :rules="emailRules"
      />
      <label :for="`checkbox-communications-${contactId}`" class="form-label">
        Communications
      </label>
      <div class="d-flex my-2">
        <v-checkbox
          :id="`checkbox-communications-${contactId}`"
          :aria-checked="canReceiveCommunications"
          aria-label="Receive notifications"
          class="checkbox-override rounded-sm"
          color="tertiary"
          :disabled="disableControls"
          :ripple="false"
          role="checkbox"
          tabindex="0"
          :value="canReceiveCommunications"
          @input="() => canReceiveCommunications = !canReceiveCommunications"
        />
        <label
          class="v-label d-flex align-center"
          :class="theme.global.current.value.dark ? 'theme--dark' : 'theme--light'"
          :for="`checkbox-communications-${contactId}`"
        >
          Receive notifications
        </label>
      </div>
      <label :for="`checkbox-communications-${contactId}`" class="form-label">
        Blue Access
      </label>
      <v-radio-group
        v-model="permissions"
        class="mt-1"
        column
        dense
        :disabled="disableControls"
        mandatory
      >
        <v-radio
          :id="`radio-no-blue-${contactId}`"
          :aria-checked="isNil(permissions)"
          class="mb-1"
          color="tertiary"
          label="No access to Blue"
          :value="null"
        />
        <v-radio
          :id="`radio-reports-only-${contactId}`"
          :aria-checked="permissions === 'reports_only'"
          class="mb-1"
          color="tertiary"
          label="View reports"
          value="reports_only"
        />
        <v-radio
          :id="`radio-response-rates-${contactId}`"
          :aria-checked="permissions === 'response_rates'"
          class="mb-1"
          color="tertiary"
          label="View reports and response rates"
          value="response_rates"
        />
      </v-radio-group>
      <label :for="`select-deptForms-${contactId}`" class="form-label">
        Department Forms
      </label>
      <v-combobox
        v-model="contactDepartmentForms"
        aria-label="Department Forms"
        auto-select-first
        chips
        class="mb-4 mt-2"
        color="tertiary"
        deletable-chips
        dense
        :disabled="disableControls"
        hide-details
        hide-selected
        item-color="secondary"
        item-text="name"
        :items="availableDepartmentForms"
        :menu-props="{closeOnClick: true, closeOnContentClick: true}"
        multiple
        outlined
        return-object
        @change="onChangeContactDepartmentForms"
      >
        <template #selection="data">
          <v-chip
            :id="`selected-deptForm-${data.item.id}-${contactId}`"
            :key="data.item.id"
            v-bind="data.attrs"
            :aria-label="`Remove ${data.item.name} from ${fullName}'s department forms`"
            class="px-4 ma-1"
            close
            :close-label="`Remove ${data.item.name} from ${fullName}'s department forms`"
            color="secondary"
            :disabled="disableControls"
            :ripple="false"
            :text="data.item.name"
            @click:close="remove(data.item)"
          />
        </template>
      </v-combobox>
    </div>
    <v-btn
      :id="`save-dept-contact-${contactId}-btn`"
      class="text-capitalize mr-2"
      color="secondary"
      :disabled="disableControls || !valid || !uid"
      elevation="2"
      text="Save"
      @click.prevent="onSave"
    />
    <v-btn
      :id="`cancel-dept-contact-${contactId}-btn`"
      class="text-capitalize ml-1"
      :disabled="disableControls"
      elevation="2"
      outlined
      text="Cancel"
      @click.prevent="onCancel"
    />
  </v-form>
</template>

<script setup>
import PersonLookup from '@/components/admin/PersonLookup'
import {alertScreenReader, oxfordJoin, putFocusNextTick} from '@/lib/utils'
import {cloneDeep, differenceBy, find, findIndex, get, isNil, map, sortBy} from 'lodash'
import {computed, onMounted, ref, watch} from 'vue'
import {getUserDepartmentForms} from '@/api/user'
import {storeToRefs} from 'pinia'
import {useDepartmentStore} from '@/stores/department/department-edit-session'
import {useTheme} from 'vuetify'

const props = defineProps({
  afterSave: {
    required: true,
    type: Function
  },
  contact: {
    default: () => {},
    required: false,
    type: Object
  },
  onCancel: {
    required: true,
    type: Function
  }
})

const departmentStore = useDepartmentStore()

const {contacts, disableControls} = storeToRefs(departmentStore)
const canReceiveCommunications = ref(true)
const csid = ref(undefined)
const contactDepartmentForms = ref([])
const email = ref(undefined)
const emailRules = [
  v => !!v || 'E-mail is required',
  v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
]
const firstName = ref(undefined)
const lastName = ref(undefined)
const permissions = ref(undefined)
const theme = useTheme()
const uid = ref(undefined)
const userId = ref(undefined)
const valid = ref(true)

const availableDepartmentForms = computed(() => {
  return differenceBy(departmentStore.allDepartmentForms, contactDepartmentForms.value, item => item.name)
})
const contactId = computed(() => {
  return get(props.contact, 'uid', 'add-contact')
})
const fullName = computed(() => {
  return firstName.value && lastName.value ? `${firstName.value} ${lastName.value}`.trim() : ''
})

watch(canReceiveCommunications, value => {
  srAlert('receive notifications', value)
})

watch(contactDepartmentForms, (val, prev) => {
  if (!val || !prev || val.length === prev.length) return
  contactDepartmentForms.value = val.map(item => {
    if (typeof item === 'string') {
      return find(availableDepartmentForms.value, {'name': item})
    } else {
      return item
    }
  }).filter(v => v)
})

watch(permissions, value => {
  if (isNil(value)) {
    srAlert('have access to Blue', false)
  } else if (value === 'reports_only') {
    srAlert('be able to view reports', true)
  } else if (value === 'response_rates') {
    srAlert('be able to view reports and response rates', true)
  }
})

onMounted(() => {
  populateForm(props.contact)
  putFocusNextTick('add-contact-sub-header')
  alertScreenReader(`${props.contact ? 'Edit' : 'Add'} department contact form is ready`)
})

const fetchUserDepartmentForms = uid => {
  getUserDepartmentForms(uid).then(data => {
    contactDepartmentForms.value = data
  })
}

const onChangeContactDepartmentForms = selectedValues => {
  const names = map(selectedValues, 'name')
  if (names.length) {
    alertScreenReader(`Selected department form${names.length === 1 ? 's are' : 'is'} ${oxfordJoin(names)}.`)
  } else {
    alertScreenReader('No department forms selected.')
  }
}

const onSave = () => {
  alertScreenReader('Saving')
  departmentStore.updateContact({
    canReceiveCommunications: canReceiveCommunications.value,
    canViewReports: permissions.value === 'reports_only',
    canViewResponseRates: permissions.value === 'response_rates',
    csid: csid.value,
    departmentForms: contactDepartmentForms.value,
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    uid: uid.value,
    userId: userId.value
  }).then(props.afterSave)
}

const onSelectSearchResult = user => {
  populateForm(user)
}

const populateForm = contact => {
  if (contact) {
    fetchUserDepartmentForms(contact.uid)
    csid.value = contact.csid
    contactDepartmentForms.value = cloneDeep(sortBy(contact.departmentForms, 'name'))
    email.value = contact.email
    firstName.value = contact.firstName
    lastName.value = contact.lastName
    uid.value = contact.uid
    userId.value = contact.userId
    if (contact.canReceiveCommunications !== undefined) {
      canReceiveCommunications.value = contact.canReceiveCommunications
    }
    if (contact.canViewReports) {
      permissions.value = contact.canViewResponseRates.value ? 'response_rates' : 'reports_only'
    }
    putFocusNextTick('input-person-lookup-autocomplete')
  } else {
    csid.value = null
    canReceiveCommunications.value = true
    contactDepartmentForms.value = null
    email.value = null
    firstName.value = null
    lastName.value = null
    permissions.value = null
    uid.value = null
    userId.value = null
  }
}

const remove = departmentForm => {
  const formName = departmentForm.name
  const indexOf = findIndex(contactDepartmentForms.value, {'name': formName})
  contactDepartmentForms.value.splice(indexOf, 1)
  alertScreenReader(`Removed ${formName} from ${fullName.value} department forms.`)
  putFocusNextTick(`input-deptForms-${contactId.value}`)
}

const srAlert = (label, isSelected) => {
  if (firstName.value || lastName.value) {
    alertScreenReader(`${firstName.value} ${lastName.value} will ${isSelected ? '' : 'not '} ${label}.`)
  }
}
</script>

<style>
.department-contact-form {
  z-index: 10;
}
.form-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<style scoped>
.checkbox-override.v-simple-checkbox {
  left: -2px;
  margin-right: 4px;
  padding: 4px;
}
.checkbox-override.v-simple-checkbox div {
  height: 20px;
  margin: 0px;
  width: 20px;
}
</style>
