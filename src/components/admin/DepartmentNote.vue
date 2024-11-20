<template>
  <div>
    <h2
      id="notes-title"
      tabindex="-1"
    >
      Notes
    </h2>
    <div
      v-if="item && !isEditing"
      id="dept-note"
      class="text-condensed pt-2"
    >
      <pre class="body-2 text-condensed text-prewrap">{{ item }}</pre>
    </div>
    <v-form v-if="isEditing" class="pt-2">
      <v-textarea
        id="dept-note-textarea"
        v-model="item"
        auto-grow
        color="tertiary"
        :disabled="disableControls || !isEditable"
        hide-details="auto"
        outlined
        rows="3"
        variant="outlined"
        @keydown.esc="onCancelSave"
      />
    </v-form>
    <div v-if="!isEditing" id="dept-note-actions" class="align-center d-flex dept-note-actions mt-2">
      <v-btn
        id="edit-dept-note-btn"
        class="pr-0"
        color="primary"
        :disabled="disableControls || !isEditable"
        slim
        variant="text"
        @click="onEdit"
      >
        {{ item ? 'Edit ' : 'Create ' }}<span class="sr-only">Note</span>
      </v-btn>
      <div role="presentation">|</div>
      <v-btn
        v-if="item"
        id="delete-dept-note-btn"
        color="primary"
        :disabled="disableControls || !isEditable"
        slim
        variant="text"
        @click.stop="() => isConfirming = true"
      >
        Delete <span class="sr-only">Note</span>
      </v-btn>
      <ConfirmDialog
        v-if="isConfirming"
        :button-context="'Delete Note'"
        :disabled="disableControls"
        :on-click-cancel="onCancelDelete"
        :on-click-confirm="onDelete"
        :text="`Are you sure you want to delete the ${contextStore.selectedTermName || ''} note?`"
        title="Delete note?"
      />
    </div>
    <div v-if="isEditing" class="py-2">
      <v-btn
        id="save-dept-note-btn"
        class="text-capitalize mr-2"
        color="secondary"
        :disabled="disableControls || !isEditable"
        elevation="2"
        text="Save Note"
        @click="onSave"
      />
      <v-btn
        id="cancel-dept-note-btn"
        class="text-capitalize ml-1"
        :disabled="disableControls || !isEditable"
        elevation="2"
        outlined
        @click="onCancelSave"
      >
        Cancel <span class="sr-only">{{ item ? 'Edit' : 'Create' }} Note</span>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import ConfirmDialog from '@/components/util/ConfirmDialog'
import {alertScreenReader, putFocusNextTick} from '@/lib/utils'
import {onMounted, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useContextStore} from '@/stores/context'
import {useDepartmentStore} from '@/stores/department/department-edit-session'

const contextStore = useContextStore()
const departmentStore = useDepartmentStore()

const {disableControls} = storeToRefs(departmentStore)
const isConfirming = ref(false)
const isEditable = ref(false)
const isEditing = ref(false)
const item = ref(undefined)

onMounted(() => {
  reset()
})

const onCancelDelete = () => {
  alertScreenReader('Canceled. Nothing deleted.')
  putFocusNextTick('delete-dept-note-btn')
  reset()
}

const onCancelSave = () => {
  alertScreenReader('Canceled. Nothing saved.')
  putFocusNextTick('edit-dept-note-btn')
  reset()
}

const onDelete = () => {
  departmentStore.updateNote(null, contextStore.selectedTermId).then(() => {
    alertScreenReader('Note deleted.')
    putFocusNextTick('notes-title')
    reset()
  })
}

const onEdit = () => {
  isEditing.value = true
  putFocusNextTick('dept-note-textarea')
}

const onSave = () => {
  departmentStore.updateNote(item.value, contextStore.selectedTermId).then(() => {
    alertScreenReader('Note saved.')
    putFocusNextTick('edit-dept-note-btn')
    reset()
  })
}

const reset = () => {
  isConfirming.value = false
  isEditable.value = contextStore.selectedTermId === contextStore.config.currentTermId
  isEditing.value = false
  item.value = departmentStore.note
}
</script>

<style scoped>
.dept-note-actions {
  margin-left: -20px;
}
</style>
