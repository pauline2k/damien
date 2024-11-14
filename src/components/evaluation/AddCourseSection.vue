<template>
  <div class="d-flex align-baseline add-course-section">
    <v-btn
      v-if="!isAddingSection"
      id="add-course-section-btn"
      class="text-capitalize pl-2 mr-3 mt-1"
      color="tertiary"
      :disabled="!allowEdits"
      @click="() => isAddingSection = true"
    >
      <v-icon :icon="mdiPlusThick" />
      Add Course Section
    </v-btn>
    <div v-if="isAddingSection" class="full-width px-4">
      <div v-if="!section">
        <v-form>
          <label for="lookup-course-number-input" class="form-label">
            Course Number
          </label>
          <v-text-field
            id="lookup-course-number-input"
            ref="lookupCourseNumberInput"
            v-model="courseNumber"
            class="mt-1"
            color="tertiary"
            :error-messages="errorMessage"
            maxlength="5"
            :rules="[rules.courseNumber, rules.notPresent]"
            dense
            outlined
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
              class="text-capitalize mr-2 mb-1"
              color="secondary"
              :disabled="!courseNumberReady"
              elevation="2"
              text="Look Up"
              @click="lookupSection"
            />
            <v-btn
              id="lookup-course-number-cancel"
              class="text-capitalize ml-1 mb-1"
              elevation="2"
              outlined
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
            outlined
            text="Cancel"
            @click="onCancel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {storeToRefs} from 'pinia'
import {useDepartmentStore} from '@/stores/department/department-edit-session'

const {disableControls} = storeToRefs(useDepartmentStore())
</script>

<script>
import {alertScreenReader, putFocusNextTick} from '@/lib/utils'
import {getSection} from '@/api/sections'
import {mdiAlert, mdiPlusThick} from '@mdi/js'
import {useContextStore} from '@/stores/context'

export default {
  name: 'AddCourseSection',
  props: {
    allowEdits: {
      required: false,
      type: Boolean
    }
  },
  data: () => ({
    courseNumber: null,
    errorMessage: '',
    isAddingSection: false,
    mdiAlert,
    mdiPlusThick,
    rules: {},
    section: null,
    sectionError: false
  }),
  computed: {
    courseNumberReady() {
      return this.courseNumber && /^\d{5}/.test(this.courseNumber) && (this.rules.notPresent(this.courseNumber) === true)
    }
  },
  watch: {
    courseNumber() {
      this.errorMessage = null
      this.sectionError = false
    },
    isAddingSection(isAddingSection) {
      if (isAddingSection) {
        alertScreenReader('Add course section form is ready.')
        putFocusNextTick('lookup-course-number-input')
      }
    }
  },
  created() {
    this.rules = {
      courseNumber: value => !value || /^\d+$/.test(value) || 'Invalid course number.',
      notPresent: value => !find(useDepartmentStore().evaluations, {courseNumber: value}) || `Course number ${value} already present on page.`
    }
  },
  methods: {
    lookupSection() {
      this.errorMessage = null
      if (this.$refs.lookupCourseNumberInput.validate()) {
        getSection(this.courseNumber, useContextStore().selectedTermId).then(data => {
          alertScreenReader(`Section ${this.courseNumber} found.`)
          this.courseNumber = null
          this.section = data
          putFocusNextTick('add-section-title')
        }, () => {
          this.sectionError = true
          this.errorMessage = `Section ${this.courseNumber} not found.`
          alertScreenReader(this.errorMessage)
          putFocusNextTick('lookup-course-number-input')
        })
      }
    },
    onCancel() {
      this.courseNumber = null
      this.errorMessage = null
      if (this.section) {
        this.section = null
        alertScreenReader('Canceled. Add course section form is ready.')
        putFocusNextTick('lookup-course-number-input')
      } else {
        this.isAddingSection = false
        alertScreenReader('Section lookup canceled.')
        putFocusNextTick('add-course-section-btn')
      }
    },
    onSubmit(courseNumber) {
      alertScreenReader(`Adding section ${courseNumber}.`)
      useDepartmentStore().addSection({
        sectionId: courseNumber,
        termId: useContextStore().selectedTermId
      }).then(() => {
        this.isAddingSection = false
        this.courseNumber = null
        this.errorMessage = null
        this.section = null
        alertScreenReader(`Section ${courseNumber} added.`)
      }, error => useDepartmentStore().showErrorDialog(error.response.data.message))
        .finally(() => useDepartmentStore().setDisableControls(false))
    }
  }
}
</script>

<style scoped>
.add-course-section {
  max-width: 300px;
  justify-content: flex-end;
  margin-left: auto;
}
.form-label {
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.full-width {
  width: 100%;
  width: -moz-available;
  width: -webkit-fill-available;
  width: stretch;
}
</style>
