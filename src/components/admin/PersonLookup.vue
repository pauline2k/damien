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
        autocomplete="off"
        class="bg-white person-lookup"
        :class="inputClass"
        clearable
        density="compact"
        :disabled="disabled"
        :error="required && !suppressValidation && !!size(errors)"
        :error-messages="required && !suppressValidation ? errors : []"
        hide-details="auto"
        :hide-no-data="isSearching || !search"
        :items="suggestions"
        :loading="isSearching ? 'tertiary' : false"
        :menu-icon="null"
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
        @change="() => suppressValidation = false"
        @update:focused="onHighlight"
        @update:search="onUpdateSearch"
        @update:model-value="onUpdateModel"
      >
        <template #item="{item, props: itemSlotProps}">
          <v-list-item
            :aria-selected="item.value.uid === mouseoverUid"
            class="text-tertiary"
            :class="{
              'bg-light-blue-lighten-5': mouseoverUid === item.value.uid
            }"
            v-bind="itemSlotProps"
            @focusin="() => onFocusInSuggestion(item.value)"
            @focusout="onFocusOutSuggestion"
            @mouseenter="() => onFocusInSuggestion(item.value)"
            @mouseleave="onFocusOutSuggestion"
            v-html="suggest(item)"
          />
        </template>
        <template #selection="{item}">
          {{ item.title }}
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
import {debounce, delay, each, get, join, size, split, trim} from 'lodash'
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

const debouncedSearch = ref(v => v)
const errors = ref([])
const mouseoverUid = ref(undefined)
const isSearching = ref(false)
const search = ref(undefined)
const searchTokenMatcher = ref(undefined)
const selected = ref(undefined)
const suggestions = ref([])
const suppressValidation = ref(true)
const theme = useTheme()

watch(search, snippet => {
  const trimmed = trim(snippet)
  if (trimmed) {
    isSearching.value = true
    debouncedSearch.value(trimmed)
  }
})

onMounted(() => {
  debouncedSearch.value = debounce(executeSearch, 300)
})

const executeSearch = snippet => {
  if (snippet) {
    const apiSearch = props.instructorLookup ? searchInstructors : searchUsers
    apiSearch(snippet, props.excludeUids).then(users => {
      const searchTokens = split(trim(snippet), /\W/g)
      searchTokenMatcher.value = RegExp(join(searchTokens, '|'), 'gi')
      suggestions.value = []
      each(users, user => {
        suggestions.value.push({
          title: `${user.firstName} ${user.lastName} (${user.uid})`,
          value: user
        })
      })
      isSearching.value = false
    })
  } else {
    isSearching.value = false
    searchTokenMatcher.value = null
    selected.value = null
    suggestions.value = []
  }
}

const onFocusInSuggestion = user => mouseoverUid.value = user.uid

const onFocusOutSuggestion = () => mouseoverUid.value = null

const onUpdateModel = () => {
  const user = get(selected.value, 'value')
  validate(user)
  if (!user) {
    search.value = null
  }
  props.onSelectResult(user)
  suggestions.value = []
}

const onUpdateSearch = value => {
  search.value = value
  if (!isSearching.value && !!search.value && suggestions.value.length && !selected.value) {
    selected.value = suggestions.value[0]
  }
}

const onHighlight = item => {
  mouseoverUid.value = get(item.value, 'uid')
}

const suggest = item => {
  return item.title.replace(searchTokenMatcher.value, match => `<strong>${match}</strong>`)
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
