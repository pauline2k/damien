<template>
  <tr>
    <th
      v-for="column in columns"
      :key="column.key"
      :aria-label="column.title"
      :aria-sort="isSorted(column) ? (sortDesc ? 'descending' : 'ascending') : 'none'"
      :class="column.class"
      scope="col"
      :style="column.headerProps"
    >
      <v-btn
        :id="`sort-col-${id}${column.value}-btn`"
        :aria-label="`Sort by ${column.title} ${isSorted(column) && !sortDesc ? 'descending' : 'ascending'}`"
        :append-icon="sortIcon(column)"
        class="sort-col-btn font-weight-bold text-no-wrap pl-0 pr-1 v-table-sort-btn-override"
        :class="{'icon-visible': isSorted(column)}"
        density="compact"
        size="small"
        variant="plain"
        @click="() => onSort(column)"
      >
        {{ column.title }}
      </v-btn>
    </th>
  </tr>
</template>

<script setup>
import {mdiArrowUp} from '@mdi/js'

defineProps({
  columns: {
    required: true,
    type: Array
  },
  id: {
    default: '',
    required: false,
    type: String
  },
  isSorted: {
    required: true,
    type: Function
  },
  onSort: {
    default: () => {},
    required: false,
    type: Function
  },
  sortDesc: {
    required: false,
    type: Boolean
  },
  sortIcon: {
    default: () => mdiArrowUp,
    required: false,
    type: Function
  }
})
</script>

<style scoped>
.sort-col-btn {
  height: unset !important;
  letter-spacing: normal !important;
  min-width: 0px !important;
}
</style>
<style>
.v-table-sort-btn-override .v-btn__append .v-icon {
  opacity: 0;
}
.v-table-sort-btn-override:active .v-btn__append .v-icon,
.v-table-sort-btn-override:hover .v-btn__append .v-icon,
.v-table-sort-btn-override:focus .v-btn__append .v-icon,
.v-table-sort-btn-override.icon-visible .v-btn__append .v-icon {
  opacity: 1;
}
</style>
