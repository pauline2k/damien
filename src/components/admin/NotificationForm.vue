<template>
  <v-card class="modal-content bg-surface-light" flat>
    <div v-if="isSending">
      <v-progress-circular
        class="spinner"
        :indeterminate="true"
        rotate="5"
        size="64"
        width="4"
        color="secondary"
      />
    </div>
    <v-card-title :class="isSending ? 'text-muted' : ''">
      <h3
        id="send-notification-section-header"
        tabindex="-1"
      >
        Send Notification
      </h3>
    </v-card-title>
    <v-card-subtitle v-if="selectedRecipients">
      <h4 class="font-size-16 mb-2">Message will be sent to:</h4>
      <v-expansion-panels
        class="recipients-container border-sm"
        :disabled="isSending"
        hover
        multiple
        tile
      >
        <v-expansion-panel
          v-for="(department, deptIndex) in selectedRecipients"
          :key="deptIndex"
        >
          <v-expansion-panel-title class="border-sm">
            <h5 :id="`dept-head-${deptIndex}`" class="font-size-14">{{ department.deptName }}</h5>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(recipient, index) in department.recipients" :key="index" class="d-flex flex-wrap pt-1">
              <div class="align-center bg-green-accent-1 border-sm d-flex mb-1 pa-1 rounded-xl">
                <div class="px-2 recipient">
                  {{ recipientLabel(recipient) }}
                </div>
                <v-btn
                  :aria-label="`Remove ${recipientLabel(recipient)} from recipients`"
                  color="transparent"
                  density="compact"
                  :disabled="isSending"
                  :icon="mdiCloseCircle"
                  variant="flat"
                  @click.stop="removeRecipient(department, recipient, index)"
                />
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-subtitle>
    <v-card-text class="notification-container py-0">
      <v-form
        class="py-4"
        :class="isSending ? 'text-muted' : ''"
        :disabled="isSending"
      >
        <label for="input-notification-subject" class="form-label">
          Subject
        </label>
        <v-text-field
          id="input-notification-subject"
          v-model="subject"
          class="bg-surface my-1"
          color="tertiary"
          dense
          :disabled="isSending"
          hide-details="auto"
          variant="outlined"
          @keydown.esc="onCancel"
        />
        <div class="mt-2">
          <label for="input-notification-message" class="form-label">
            Message
          </label>
          <v-textarea
            id="input-notification-message"
            v-model="message"
            auto-grow
            class="bg-surface mt-1"
            color="tertiary"
            :disabled="isSending"
            hide-details="auto"
            variant="outlined"
          />
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions class="modal-footer">
      <div class="text-right w-100">
        <v-btn
          id="send-notification-btn"
          class="mr-2"
          color="primary"
          :disabled="disabled"
          text="Send"
          variant="flat"
          @click="sendNotification"
        />
        <v-btn
          id="cancel-send-notification-btn"
          :disabled="isSending"
          text="Cancel"
          variant="outlined"
          @click="onCancel"
        />
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import {alertScreenReader, putFocusNextTick} from '@/lib/utils'
import {cloneDeep, indexOf, size, trim} from 'lodash'
import {computed, onMounted, ref} from 'vue'
import {mdiCloseCircle} from '@mdi/js'
import {notifyContacts} from '@/api/departments'
import {useContextStore} from '@/stores/context'

const props = defineProps({
  afterSend: {
    required: true,
    type: Function
  },
  onCancel: {
    required: true,
    type: Function
  },
  recipients: {
    required: true,
    type: Array
  }
})

const contextStore = useContextStore()

const message = ref(undefined)
const isSending = ref(false)
const selectedRecipients = ref([])
const subject = ref(undefined)

const disabled = computed(() => {
  return isSending.value || !trim(subject.value) || !trim(message.value) || !size(selectedRecipients.value)
})

onMounted(() => {
  selectedRecipients.value = cloneDeep(props.recipients)
  alertScreenReader('Send notification form is ready.')
  putFocusNextTick('send-notification-section-header')
})

const recipientLabel = recipient => `${recipient.firstName} ${recipient.lastName} (${recipient.email})`

const removeRecipient = (department, recipient, index) => {
  const label = recipientLabel(recipient)
  const indexOfDepartment = indexOf(selectedRecipients.value, department)
  if (size(department.recipients) === 1) {
    selectedRecipients.value.splice(indexOfDepartment, 1)
  } else {
    selectedRecipients.value[indexOfDepartment].recipients.splice(index, 1)
  }
  alertScreenReader(`Removed ${label} from list of recipients.`)
  return false
}

const sendNotification = () => {
  isSending.value = true
  alertScreenReader('Sending')
  notifyContacts(message.value, selectedRecipients.value, subject.value).then(response => {
    if (response) {
      props.afterSend()
    } else {
      isSending.value = false
      contextStore.snackbarReportError('Notification failed. Nothing sent.')
    }
  })
}
</script>

<style scoped>
.notification-container {
  min-height: 290px;
}
.recipient {
  white-space: break-spaces;
}
.recipients-container {
  max-height: 180px;
  overflow-y: auto;
}
.spinner {
  bottom: 0;
  height: 2em;
  left: 0;
  margin: auto;
  overflow: visible;
  position: absolute;
  right: 0;
  top: 0;
  width: 2em;
  z-index: 999;
}
</style>
