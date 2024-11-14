<template>
  <div class="pt-2">
    <v-row no-gutters>
      <v-col cols="9" class="d-flex align-center">
        <h1 id="page-title" class="text-title">
          Publish<span v-if="contextStore.selectedTermName"> - {{ contextStore.selectedTermName }}</span>
        </h1>
      </v-col>
      <v-col cols="3">
        <TermSelect :after-select="refresh" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="mr-auto">
        <div v-if="size(confirmed)">
          Rows confirmed for publication:
          <ul id="confirmed-list" class="pl-4">
            <li v-for="(department, index) in confirmed" :key="index">
              {{ department.deptName }} ({{ department.count }})
            </li>
          </ul>
        </div>
        <div v-if="size(blockers)">
          <v-icon color="error" :icon="mdiAlertCircle" />
          Publication is blocked by errors in departments:
          <ul id="blocker-list" class="pl-4">
            <li v-for="(count, deptName) in blockers" :key="deptName">
              {{ deptName }} ({{ count }})
            </li>
          </ul>
        </div>
        <v-btn
          id="publish-btn"
          class="publish-btn align-self-end my-4 mr-2"
          color="secondary"
          :disabled="isExporting || contextStore.loading || !!size(blockers)"
          @click="publish"
        >
          <span v-if="!isExporting">Publish</span>
          <v-progress-circular
            v-if="isExporting"
            :indeterminate="true"
            color="white"
            rotate="5"
            size="20"
            width="3"
          />
        </v-btn>
        <v-slide-x-reverse-transition>
          <span v-if="isExporting" class="mx-2">Publishing in progress.</span>
        </v-slide-x-reverse-transition>
        <v-btn
          id="status-btn"
          class="mx-2"
          color="secondary"
          :disabled="isUpdatingStatus || !isExporting || contextStore.loading"
          fab
          x-small
          @click="onUpdateStatus"
        >
          <v-icon :icon="mdiRefresh" />
          <span class="sr-only">Refresh</span>
        </v-btn>
      </v-col>
      <v-col cols="auto" class="pr-4 mb-2">
        <v-expansion-panels
          v-model="exportsPanel"
          class="term-exports"
          :disabled="contextStore.loading"
          flat
        >
          <v-expansion-panel class="panel-override">
            <v-expansion-panel-title id="term-exports-btn" class="term-exports-btn">
              <h2>Term Exports</h2>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-if="isEmpty(termExports)" id="term-exports-no-data">There are no {{ selectedTermName }} exports.</div>
              <ul v-if="!isEmpty(termExports)" id="term-exports-list" class="pl-2">
                <li v-for="(e, index) in termExports" :key="index">
                  <a
                    :id="`term-export-${index}`"
                    download
                    :href="`${contextStore.config.apiBaseUrl}/api/export/${encodeURIComponent(e.s3Path)}`"
                  >
                    <v-icon
                      aria-hidden="false"
                      aria-label="download"
                      class="pr-2"
                      color="anchor"
                      :icon="mdiTrayArrowDown"
                      role="img"
                      size="small"
                    />
                    {{ toLocaleFromISO(e.createdAt, dateFormat) }}
                    <span class="sr-only">term export</span>
                  </a>
                </li>
              </ul>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-card v-if="!contextStore.loading" outlined class="elevation-1">
      <EvaluationTable :readonly="true" />
    </v-card>
  </div>
</template>

<script setup>
import {useContextStore} from '@/stores/context'
const contextStore = useContextStore()
</script>

<script>
import {DateTime} from 'luxon'
import EvaluationTable from '@/components/evaluation/EvaluationTable'
import TermSelect from '@/components/util/TermSelect'
import {alertScreenReader, putFocusNextTick, toLocaleFromISO} from '@/lib/utils'
import {exportEvaluations, getConfirmed, getExportStatus, getExports, getValidation} from '@/api/evaluations'
import {find, isEmpty, size, sortBy} from 'lodash'
import {mdiAlertCircle, mdiRefresh, mdiTrayArrowDown} from '@mdi/js'
import {nextTick} from 'vue'
import {useDepartmentStore} from '@/stores/department/department-edit-session'

export default {
  name: 'Megiddo',
  components: {
    EvaluationTable,
    TermSelect
  },
  data: () => ({
    blockers: {},
    confirmed: [],
    dateFormat: DateTime.DATETIME_SHORT_WITH_SECONDS,
    exportsPanel: undefined,
    isExporting: false,
    isUpdatingStatus: false,
    mdiAlertCircle,
    mdiRefresh,
    mdiTrayArrowDown,
    termExports: []
  }),
  created() {
    this.updateStatus()
  },
  methods: {
    toLocaleFromISO,
    isEmpty,
    onUpdateStatus() {
      this.isUpdatingStatus = true
      this.updateStatus()
      putFocusNextTick('status-btn')
    },
    publish() {
      this.isExporting = true
      alertScreenReader('Publishing.')
      exportEvaluations(useContextStore().selectedTermId).then(() => {
        this.snackbarOpen('Publication has started and will run in the background.')
        putFocusNextTick('publish-btn')
      })
    },
    refresh() {
      useContextStore().loadingStart()
      alertScreenReader(`Loading ${useContextStore().selectedTermName}`)
      Promise.all([getValidation(useContextStore().selectedTermId), getConfirmed(useContextStore().selectedTermId), getExports(useContextStore().selectedTermId)]).then(responses => {
        useDepartmentStore().setEvaluations(sortBy(responses[0], 'sortableCourseName'))
        this.confirmed = responses[1]
        this.termExports = responses[2]
        useContextStore().loadingComplete(`Publish ${useContextStore().selectedTermName || ''}`)
      })
    },
    size,
    updateStatus() {
      getExportStatus().then(response => {
        this.isExporting = false
        if (isEmpty(response)) {
          return false
        }
        const lastUpdate = DateTime.fromISO(response.updatedAt)
        if (DateTime.now().diff(lastUpdate, ['hours']) < 1) {
          this.showStatus(response)
        }
      }).finally(() => {
        nextTick(() => {
          this.isUpdatingStatus = false
        })
      })
    },
    showStatus(termExport) {
      const exportLabel = toLocaleFromISO(termExport.createdAt, this.dateFormat)
      const term = find(useContextStore().config.availableTerms, {'id': termExport.termId})
      if (termExport.status === 'success') {
        this.snackbarOpen(
          `Success! Publication of ${term.name} term export <b>${exportLabel || ''}</b> is complete.`,
          'success'
        )
      } else if (termExport.status === 'error') {
        useContextStore().snackbarReportError(`Error: Publication of ${term.name} term export <b>${exportLabel || ''}</b> failed.`)
      } else {
        this.isExporting = true
      }
    }
  }
}
</script>

<style scoped>
.publish-btn {
  width: 8rem;
}
.term-exports {
  width: 325px;
}
.term-exports-btn {
  width: 225px;
}
</style>
