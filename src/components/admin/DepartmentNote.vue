<template>
  <div>
    <h2
      id="notes-title"
      class="pb-1 px-2"
      tabindex="-1"
    >
      Notes
    </h2>
    <v-card
      class="my-1 pa-2"
      :flat="!isEditing"
      :outlined="isEditing"
    >
      <div
        v-if="item && !isEditing"
        id="dept-note"
        class="text-condensed pb-2 pl-4"
      >
        <pre class="body-2 text-condensed text-prewrap">{{ item }} </pre>
      </div>
      <v-form v-if="isEditing" class="pa-3">
        <v-textarea
          id="dept-note-textarea"
          v-model="item"
          auto-grow
          color="tertiary"
          :disabled="disableControls || !isEditable"
          flat
          hide-details="auto"
          outlined
          @keydown.esc="onCancelSave"
        />
      </v-form>
      <v-toolbar
        v-if="!isEditing"
        id="dept-note-actions"
        flat
        height="unset"
        tag="div"
      >
        <v-btn
          id="edit-dept-note-btn"
          class="text-capitalize pa-0"
          color="tertiary"
          :disabled="disableControls || !isEditable"
          dark
          height="unset"
          min-width="unset"
          text
          @click="onEdit"
        >
          {{ item ? 'Edit ' : 'Create ' }}<span class="sr-only">Note</span>
        </v-btn>
        <v-divider
          v-if="item"
          class="separator mx-2"
          role="presentation"
          vertical
        />
        <v-btn
          v-if="item"
          id="delete-dept-note-btn"
          class="text-capitalize pa-0"
          color="tertiary"
          :disabled="disableControls || !isEditable"
          height="unset"
          min-width="unset"
          text
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
          :title="'Delete note?'"
        />
      </v-toolbar>
      <div v-if="isEditing" class="pa-2">
        <v-btn
          id="save-dept-note-btn"
          class="text-capitalize mr-2"
          color="secondary"
          :disabled="disableControls || !isEditable"
          elevation="2"
          @click="onSave"
        >
          Save Note
        </v-btn>
        <v-btn
          id="cancel-dept-note-btn"
          class="text-capitalize ml-1"
          :disabled="disableControls || !isEditable"
          elevation="2"
          outlined
          text
          @click="onCancelSave"
        >
          Cancel <span class="sr-only">{{ item ? 'Edit' : 'Create' }} Note</span>
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import {storeToRefs} from 'pinia'
import {useContextStore} from '@/stores/context'
import {useDepartmentStore} from '@/stores/department/department-edit-session'

const contextStore = useContextStore()
const {disableControls} = storeToRefs(useDepartmentStore())
</script>

<script>
import {alertScreenReader, putFocusNextTick} from '@/lib/utils'
import ConfirmDialog from '@/components/util/ConfirmDialog'

export default {
  name: 'DepartmentNote',
  components: {ConfirmDialog},
  data: () => ({
    isConfirming: false,
    isEditable: false,
    isEditing: false,
    item: undefined
  }),
  created() {
    this.reset()
  },
  methods: {
    onCancelDelete() {
      alertScreenReader('Canceled. Nothing deleted.')
      putFocusNextTick('delete-dept-note-btn')
      this.reset()
    },
    onCancelSave() {
      alertScreenReader('Canceled. Nothing saved.')
      putFocusNextTick('edit-dept-note-btn')
      this.reset()
    },
    onDelete() {
      useDepartmentStore().updateNote({note: null, termId: useContextStore().selectedTermId}).then(() => {
        alertScreenReader('Note deleted.')
        putFocusNextTick('notes-title')
        this.reset()
      })
    },
    onEdit() {
      this.isEditing = true
      putFocusNextTick('dept-note-textarea')
    },
    onSave() {
      useDepartmentStore().updateNote({note: this.item, termId: useContextStore().selectedTermId}).then(() => {
        alertScreenReader('Note saved.')
        putFocusNextTick('edit-dept-note-btn')
        this.reset()
      })
    },
    reset() {
      this.isConfirming = false
      this.isEditable = useContextStore().selectedTermId === useContextStore().config.currentTermId
      this.isEditing = false
      this.item = useDepartmentStore().note
    }
  }
}
</script>
