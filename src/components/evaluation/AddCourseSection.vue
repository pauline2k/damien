<template>
  <div class="d-flex add-course-section">
    <v-btn
      v-if="!isAddingSection"
      id="add-course-section-btn"
      class="align-self-center text-capitalize mr-3"
      color="tertiary"
      :disabled="!allowEdits"
      slim
      variant="text"
      @click="() => isAddingSection = true"
    >
      <v-icon :icon="mdiPlusThick" />
      Add Course Section
    </v-btn>
    <div v-if="isAddingSection" class="full-width px-4">
      <div v-if="!section">
        <v-form>
          <v-text-field
            id="lookup-course-number-input"
            ref="lookupCourseNumberInput"
            v-model="courseNumber"
            color="tertiary"
            :error-messages="errorMessage"
            maxlength="5"
            label="Course Number"
            :rules="[rules.courseNumber, rules.notPresent]"
            dense
            variant="outlined"
            required
            @keydown.enter.prevent="lookupSection"
            @keydown.esc="onCancel"
          >
            <template #message="{message}">
              <div :id="sectionError ? 'section-not-found-error' : 'lookup-course-number-error'" class="text-condensed">
                <v-icon
                  v-if="sectionError"
                  color="error"
                  :icon="mdiAlert"
                  size="small"
                />
                {{ message }}
              </div>
            </template>
          </v-text-field>
          <div>
            <v-btn
              id="lookup-course-number-submit"
              class="text-capitalize mr-2"
              color="secondary"
              :disabled="!courseNumberReady"
              text="Look Up"
              @click="lookupSection"
            />
            <v-btn
              id="lookup-course-number-cancel"
              class="text-capitalize"
              variant="outlined"
              text="Cancel"
              @click="onCancel"
            />
          </div>
        </v-form>
      </div>
      <div v-if="section">
        <h3 id="add-section-title">
          {{ section.subjectArea }}
          {{ section.catalogId }}
          {{ section.instructionFormat }}
          {{ section.sectionNumber }}
        </h3>
        <div id="add-section-course-number" class="mt-1">Course number {{ section.courseNumber }}</div>
        <div id="add-section-course-title" class="mt-1 mb-3">{{ section.courseTitle }}</div>
        <div>
          <v-btn
            id="add-course-section-submit"
            class="text-capitalize mr-2 mb-1"
            color="secondary"
            :disabled="disableControls"
            elevation="2"
            text="Confirm"
            @click="onSubmit(section.courseNumber)"
          />
          <v-btn
            id="add-course-section-cancel"
            class="text-capitalize ml-1 mb-1"
            elevation="2"
            variant="outlined"
            text="Cancel"
            @click="onCancel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {alertScreenReader, putFocusNextTick} from '@/lib/utils'
import {computed, ref, watch} from 'vue'
import {getSection} from '@/api/sections'
import {mdiAlert, mdiPlusThick} from '@mdi/js'
import {storeToRefs} from 'pinia'
import {useContextStore} from '@/stores/context'
import {useDepartmentStore} from '@/stores/department/department-edit-session'

const {disableControls} = storeToRefs(useDepartmentStore())

defineProps({
  allowEdits: {
    required: false,
    type: Boolean
  }
})

const courseNumber = ref(undefined)
const errorMessage = ref('')
const isAddingSection = ref(false)
const lookupCourseNumberInput = ref()
const rules = {
  courseNumber: value => !value || /^\d+$/.test(value) || 'Invalid course number.',
  notPresent: value => !find(useDepartmentStore().evaluations, {courseNumber: value}) || `Course number ${value} already present on page.`
}
const section = ref(undefined)
const sectionError = ref(false)

const courseNumberReady = computed(() => {
  return courseNumber.value && /^\d{5}/.test(courseNumber.value) && (rules.notPresent(courseNumber.value) === true)
})

watch(courseNumber, () => {
  errorMessage.value = null
  sectionError.value = false
})
watch(isAddingSection, v => {
  if (v) {
    alertScreenReader('Add course section form is ready.')
    putFocusNextTick('lookup-course-number-input')
  }
})

const lookupSection = () => {
  errorMessage.value = null
  if (lookupCourseNumberInput.value.validate()) {
    getSection(courseNumber.value, useContextStore().selectedTermId).then(data => {
      alertScreenReader(`Section ${courseNumber.value} found.`)
      courseNumber.value = null
      section.value = data
      putFocusNextTick('add-section-title')
    }, () => {
      sectionError.value = true
      errorMessage.value = `Section ${courseNumber.value} not found.`
      alertScreenReader(errorMessage.value)
      putFocusNextTick('lookup-course-number-input')
    })
  }
}

const onCancel = () => {
  courseNumber.value = null
  errorMessage.value = null
  if (section.value) {
    section.value = null
    alertScreenReader('Canceled. Add course section form is ready.')
    putFocusNextTick('lookup-course-number-input')
  } else {
    isAddingSection.value = false
    alertScreenReader('Section lookup canceled.')
    putFocusNextTick('add-course-section-btn')
  }
}

const onSubmit = courseNumber => {
  alertScreenReader(`Adding section ${courseNumber}.`)
  useDepartmentStore().addSection(courseNumber, useContextStore().selectedTermId).then(() => {
    isAddingSection.value = false
    courseNumber.value = null
    errorMessage.value = null
    section.value = null
    alertScreenReader(`Section ${courseNumber} added.`)
  }, error => useDepartmentStore().showErrorDialog(error.response.data.message))
    .finally(() => useDepartmentStore().disableControls = false)
}
</script>

<style scoped>
.add-course-section {
  min-height: 40px;
  max-width: 300px;
}
.full-width {
  width: 100%;
  width: -moz-available;
  width: -webkit-fill-available;
  width: stretch;
}
</style>
