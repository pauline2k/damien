<template>
  <v-dialog
    v-model="model"
    width="500"
    @click:outside="cancel"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title id="confirm-dialog-title" tabindex="-1">
        <div class="align-center d-flex pt-3 px-2">
          <div v-if="icon" class="pb-1 pr-2">
            <v-icon aria-label="Error icon" color="error">{{ icon }}</v-icon>
          </div>
          <h3>
            {{ title }}
          </h3>
        </div>
      </v-card-title>
      <v-card-text class="pt-3">{{ text }}</v-card-text>
      <v-card-actions>
        <div class="align-center d-flex pb-3 pr-4">
          <v-btn
            id="confirm-dialog-btn"
            class="mr-2"
            color="primary"
            :disabled="disabled"
            variant="flat"
            @click="onClickConfirm"
          >
            {{ confirmButtonLabel }} <span class="sr-only">{{ buttonContext }}</span>
          </v-btn>
          <v-btn
            id="cancel-dialog-btn"
            :disabled="disabled"
            variant="outlined"
            @click="cancel"
          >
            Cancel <span class="sr-only">{{ buttonContext }}</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {putFocusNextTick} from '@/lib/utils'
import {onMounted, ref} from 'vue'

const props = defineProps({
  buttonContext: {
    default: '',
    required: false,
    type: String
  },
  confirmButtonLabel: {
    default: 'Confirm',
    required: false,
    type: String
  },
  disabled: {
    required: false,
    type: Boolean
  },
  icon: {
    default: undefined,
    required: false,
    type: String
  },
  onClickCancel: {
    required: true,
    type: Function
  },
  onClickConfirm: {
    required: true,
    type: Function
  },
  text: {
    required: true,
    type: String
  },
  title: {
    required: true,
    type: String
  }
})

const model = ref(true)

onMounted(() => putFocusNextTick('confirm-dialog-title'))

const cancel = () => {
  model.value = false
  props.onClickCancel()
}
</script>
