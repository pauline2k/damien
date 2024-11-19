<template>
  <div class="ma-0 px-4 pb-4">
    <v-textarea
      id="service-announcement-textarea"
      v-model="text"
      aria-label="Enter service announcement for users to read"
      color="tertiary"
      rows="3"
      max-rows="5"
      outlined
      hide-details="auto"
      solo
    />
    <v-checkbox
      id="service-announcement-published"
      v-model="isPublished"
      label="Publish"
      :ripple="false"
    />
    <v-btn
      id="service-announcement-save"
      color="secondary"
      :disabled="!trim(text)"
      text="Save"
      @click="save"
    />
  </div>
</template>

<script setup>
import {getServiceAnnouncement, updateServiceAnnouncement} from '@/api/config'
import {onMounted, ref} from 'vue'
import {trim} from 'lodash'

const isPublished = ref(undefined)
const text = ref(undefined)

onMounted(() => {
  getServiceAnnouncement().then(data => {
    text.value = data.text
    isPublished.value = data.isLive
  })
})

const save = () => {
  updateServiceAnnouncement(text.value, isPublished.value).then(data => {
    text.value = data.text
    isPublished.value = data.isLive
  })
}
</script>
