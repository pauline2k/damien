<template>
  <div :class="inline ? 'row d-flex align-center row--dense' : 'd-flex flex-column flex-grow-1'">
    <div :class="{'col col-4': inline}">
      <label
        :id="`${id}-label`"
        :for="id"
        :class="labelClass"
      >
        <span v-if="label">{{ label }}</span>
        <span v-if="placeholder" class="sr-only">{{ placeholder }}</span>
      </label>
    </div>
    <div :class="{'col col-6': inline}">
      <v-autocomplete
        :id="id"
        v-model="selected"
        :aria-disabled="disabled"
        :aria-labelledby="`${id}-label`"
        auto-select-first
        autocomplete="off"
        class="bg-white person-lookup"
        :class="inputClass"
        density="compact"
        :disabled="disabled"
        :error="required && !suppressValidation && !!size(errors)"
        :error-messages="required && !suppressValidation ? errors : []"
        hide-details="auto"
        :hide-no-data="isSearching || !search"
        :items="suggestions"
        :loading="isSearching ? 'tertiary' : false"
        :menu-props="{
          contentClass: 'autocomplete-menu'
        }"
        no-data-text="No results found."
        no-filter
        :placeholder="placeholder"
        return-object
        :search="search"
        single-line
        variant="outlined"
        @update:model-value="onBlur"
        @change="suppressValidation = false"
        @update:list-index="onHighlight"
      >
        <template #selection="{item}">
          <span class="text-no-wrap">{{ toLabel(item) }}</span>
        </template>
        <template #item="{item}">
          <v-list-item
            :aria-selected="item === highlightedItem"
            class="text-tertiary"
          >
            <v-list-item-title>
              <span v-html="suggest(item)" />
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-autocomplete>
    </div>
    <div :class="{'col col-2 pl-0': inline}">
      <div
        v-if="required && !suppressValidation && errors && errors[0]"
        :id="`${id}-error`"
        class="v-messages text-error px-3 mt-1"
        :class="theme.global.current.value.dark ? 'text--lighten-2' : ''"
        role="alert"
      >
        {{ errors[0] }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {debounce, delay, join, noop, size, split, trim} from 'lodash'
import {onMounted, ref, watch} from 'vue'
import {searchInstructors} from '@/api/instructor'
import {searchUsers} from '@/api/user'
import {useTheme} from 'vuetify'

const props = defineProps({
  disabled: {
    required: false,
    type: Boolean
  },
  excludeUids: {
    default: () => [],
    required: false,
    type: Array
  },
  id: {
    default: 'input-person-lookup-autocomplete',
    required: false,
    type: String
  },
  inline: {
    required: false,
    type: Boolean
  },
  inputClass: {
    default: undefined,
    required: false,
    type: String
  },
  instructorLookup: {
    required: false,
    type: Boolean
  },
  label: {
    default: null,
    required: false,
    type: String
  },
  labelClass: {
    default: null,
    required: false,
    type: String
  },
  onSelectResult: {
    default: () => {},
    required: false,
    type: Function
  },
  placeholder: {
    default: 'Name or UID',
    required: false,
    type: String
  },
  required: {
    required: false,
    type: Boolean
  }
})

const debouncedSearch = ref(noop)
const errors = ref([])
const highlightedItem = ref(undefined)
const isSearching = ref(false)
const search = ref(undefined)
const searchTokenMatcher = ref(undefined)
const selected = ref(undefined)
const suggestions = ref([])
const suppressValidation = ref(true)
const theme = useTheme()

watch(search, snippet => {
  isSearching.value = true
  debouncedSearch(snippet)
})

watch(selected, suggestion => {
  validate(suggestion)
  if (!suggestion) {
    search.value = null
  }
  props.onSelectResult(suggestion)
})

onMounted(() => {
  debouncedSearch.value = debounce(executeSearch, 300)
})

const executeSearch = snippet => {
  if (snippet) {
    const apiSearch = props.instructorLookup ? searchInstructors : searchUsers
    apiSearch(snippet, props.excludeUids).then(results => {
      const searchTokens = split(trim(snippet), /\W/g)
      searchTokenMatcher.value = RegExp(join(searchTokens, '|'), 'gi')
      suggestions.value = results
      isSearching.value = false
    })
  } else {
    isSearching.value = false
    searchTokenMatcher.value = null
    selected.value = null
    suggestions.value = []
  }
}

const onBlur = () => {
  if (!isSearching.value && !!search.value && suggestions.value.length && !selected.value) {
    selected.value = suggestions.value[0]
  }
}

const onHighlight = index => {
  highlightedItem.value = suggestions.value[index]
}

const suggest = user => {
  return toLabel(user).replace(searchTokenMatcher.value, match => `<strong>${match}</strong>`)
}

const toLabel = user => {
  return user && user instanceof Object ? `${user.firstName || ''} ${user.lastName || ''} (${user.uid})`.trim() : user
}

const validate = suggestion => {
  delay(() => {
    errors.value = suggestion || !props.required || suppressValidation.value ? [] : ['Required']
  }, 300)
}
</script>

<style>
.autocomplete-menu {
  z-index: 210 !important;
}
.person-lookup {
  overflow-x: clip;
}
.person-lookup .v-select__selections,
.person-lookup .v-select__selections input {
  color: rgba(0, 0, 0, 0.87) !important;
}
.person-lookup.v-input--is-focused {
  appearance: auto !important;
  caret-color: #000 !important;
  color: -webkit-focus-ring-color !important;
  outline: auto !important;
  outline-color: -webkit-focus-ring-color !important;
  outline-offset: 0px !important;
  outline-style: auto !important;
}
.person-lookup.v-input--is-focused fieldset {
  border-color: unset !important;
  border-width: 1px !important;
}
</style>
