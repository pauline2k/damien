<template>
  <thead class="v-data-table-header">
    <tr>
      <th
        v-for="(item, index) in headers"
        :key="index"
        :aria-sort="sortBy && item.value === sortBy ? (sortDesc ? 'descending' : 'ascending') : 'none'"
        class="sortable px-0"
        :class="columnHeaderClass(item)"
        scope="col"
        :style="`width: ${item.width}; min-width: ${item.width};`"
      >
        <template v-if="item.value === 'select'">
          <slot name="select">
            <v-btn
              :id="`sort-col-${id}${item.value}-btn`"
              :aria-label="`${item.text}: ${item.value === sortBy ? (sortDesc ? 'Sorted descending' : 'Sorted ascending') : 'Not sorted'}. Activate to sort ${item.value === sortBy && !sortDesc ? 'descending' : 'ascending'}.`"
              class="sort-col-btn font-weight-bold px-1 text-capitalize text-nowrap"
              size="small"
              @click="onColumnHeaderClick(item.value)"
            >
              {{ item.text }}
              <v-icon
                class="v-data-table-header__icon"
                :icon="mdiArrowUp"
                size="small"
              />
            </v-btn>
          </slot>
        </template>
        <template v-else>
          <v-btn
            :id="`sort-col-${id}${item.value}-btn`"
            :aria-label="`${item.text}: ${item.value === sortBy ? (sortDesc ? 'Sorted descending' : 'Sorted ascending') : 'Not sorted'}. Activate to sort ${item.value === sortBy && !sortDesc ? 'descending' : 'ascending'}.`"
            class="sort-col-btn font-weight-bold text-capitalize text-nowrap px-1"
            size="small"
            @click="onColumnHeaderClick(item.value)"
          >
            {{ item.text }}
            <v-icon
              class="v-data-table-header__icon"
              :icon="mdiArrowUp"
              size="small"
            />
          </v-btn>
        </template>
      </th>
    </tr>
  </thead>
</template>

<script setup>
import {mdiArrowUp} from '@mdi/js'
import {ref} from 'vue'

const props = defineProps({
  headers: {
    type: Array,
    required: true
  },
  id: {
    default: '',
    type: String,
    required: false
  },
  onSort: {
    default: () => {},
    type: Function,
    required: false
  }
})

const sortBy = ref(null)
const sortDesc = ref(false)

const columnHeaderClass = item => {
  let klass = item.class
  if (item.value === sortBy.value) {
    klass += ` active ${sortDesc.value ? 'desc' : 'asc'}`
  }
  return klass
}

const onColumnHeaderClick = value => {
  if (value === sortBy.value) {
    if (sortDesc.value) {
      sortBy.value = null
      sortDesc.value = false
    } else {
      sortDesc.value = true
    }
  } else {
    sortDesc.value = false
    sortBy.value = value
  }
  props.onSort(sortBy.value, sortDesc.value)
}
</script>

<style scoped>
.sort-col-btn {
  color: inherit !important;
  letter-spacing: normal !important;
}
.sort-col-btn:focus .v-data-table-header__icon {
  opacity: 1;
}
</style>
