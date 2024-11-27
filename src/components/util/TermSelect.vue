<template>
  <div class="d-flex align-center justify-end flex-wrap">
    <div class="float-right mr-3">
      <label
        id="select-term-label"
        for="select-term"
        class="sr-only"
      >
        Term:
      </label>
      <select
        id="select-term"
        v-model="model"
        class="native-select-override select-term my-2"
        :class="currentThemeName"
        :disabled="contextStore.loading"
        @change="onChangeTerm"
      >
        <option
          v-for="term in contextStore.config.availableTerms"
          :id="`term-option-${term.id}`"
          :key="term.id"
          :value="term.id"
          :disabled="termIds && !includes(termIds, term.id)"
        >
          {{ term.name }}
        </option>
      </select>
    </div>
    <div class="flex-md-shrink-0 mr-3">
      <label for="toggle-term-locked" class="sr-only">
        Evaluation term is {{ contextStore.isSelectedTermLocked ? 'locked' : 'unlocked' }}.
        Evaluation term is {{ contextStore.isSelectedTermLocked ? 'locked' : 'unlocked' }}.
      </label>
      <v-btn
        id="toggle-term-locked"
        class="px-0"
        :disabled="isTogglingLock || contextStore.loading"
        icon
        @click="toggleTermLocked"
        @keydown.enter="toggleTermLocked"
      >
        <span class="sr-only">
          {{ isTogglingLock ? 'Toggling...' : (contextStore.isSelectedTermLocked ? 'Unlock' : 'Lock') }}
          {{ isTogglingLock ? 'Toggling...' : (contextStore.isSelectedTermLocked ? 'Unlock' : 'Lock') }}
        </span>
        <v-progress-circular
          v-if="isTogglingLock"
          class="spinner"
          :indeterminate="true"
          rotate="5"
          size="24"
          width="4"
          color="primary"
        />
        <v-icon
          v-if="!isTogglingLock"
          :color="contextStore.isSelectedTermLocked ? 'error' : 'success'"
          :icon="contextStore.isSelectedTermLocked ? mdiLock : mdiLockOpen"
          size="large"
        />
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import {alertScreenReader, putFocusNextTick} from '@/lib/utils'
import {find, includes} from 'lodash'
import {getEvaluationTerm, lockEvaluationTerm, unlockEvaluationTerm} from '@/api/evaluationTerms'
import {mdiLock, mdiLockOpen} from '@mdi/js'
import {computed, onMounted, ref} from 'vue'
import {useContextStore} from '@/stores/context'
import {useRoute, useRouter} from 'vue-router'
import {useTheme} from 'vuetify'

const props = defineProps({
  afterSelect: {
    default: () => {},
    required: false,
    type: Function
  },
  termIds: {
    default: null,
    required: false,
    type: Array
  }
})

const contextStore = useContextStore()
const currentThemeName = useTheme().global.name
const isTogglingLock = ref(false)
const query = useRoute().query
const router = useRouter()

const model = computed({
  get() {
    return contextStore.selectedTermId
  },
  set(termId) {
    contextStore.setSelectedTerm(termId)
    props.afterSelect(termId)
  }
})

onMounted(() => {
  const termId = query.term
  if (termId && find(contextStore.config.availableTerms, {id: termId})) {
    setTerm(termId)
  } else {
    router.push({
      query: {...query, term: contextStore.selectedTermId || contextStore.config.currentTermId}
    })
  }
})

const onChangeTerm = event => {
  const termId = event.target.value
  if (termId && termId !== query.term) {
    router.push({
      query: {...query, term: termId}
    })
    contextStore.selectTerm(termId)
    putFocusNextTick('select-term')
  }
}

const setTerm = termId => {
  contextStore.selectTerm(termId).then(() => {
    if (contextStore.selectedTermId) {
      getEvaluationTerm(contextStore.selectedTermId).then(data => {
        contextStore.setIsSelectedTermLocked(data.isLocked === true)
      })
    }
  })
}

const toggleTermLocked = () => {
  isTogglingLock.value = true
  if (!contextStore.isSelectedTermLocked) {
    lockEvaluationTerm(contextStore.selectedTermId).then(data => {
      contextStore.setIsSelectedTermLocked(data.isLocked === true)
      alertScreenReader(`Locked ${contextStore.selectedTermName}`)
      isTogglingLock.value = false
    })
  } else {
    unlockEvaluationTerm(contextStore.selectedTermId).then(data => {
      contextStore.setIsSelectedTermLocked(data.isLocked === true)
      alertScreenReader(`Unlocked ${contextStore.selectedTermName}`)
      isTogglingLock.value = false
    })
  }
}
</script>

<style scoped>
.select-term {
  max-width: 200px;
}
</style>
