<script>
import {mapActions, mapState} from 'pinia'
import {nextTick} from 'vue'
import {useContextStore} from '@/stores/context'

export default {
  name: 'Context',
  computed: {
    ...mapState(useContextStore, [
      'config',
      'isSelectedTermLocked',
      'loading',
      'screenReaderAlert',
      'selectedTermName',
      'serviceAnnouncement',
      'snackbar'
    ]),
    snackbarShow: {
      get: () => useContextStore().snackbarShow,
      set: show => show ? useContextStore().snackbarOpen() : useContextStore().snackbarClose()
    },
    selectedTermId: {
      get: () => useContextStore().selectedTermId,
      set: termId => useContextStore().setSelectedTerm(termId)
    }
  },
  methods: {
    ...mapActions(useContextStore, [
      'setIsSelectedTermLocked',
      'snackbarClose',
      'selectTerm'
    ]),
    alertScreenReader(message) {
      useContextStore().setScreenReaderAlert('')
      nextTick(() => useContextStore().setScreenReaderAlert(message))
    },
    reportError: message => useContextStore().snackbarReportError(message),
    snackbarOpen: (text, color) => useContextStore().snackbarOpen(text, color)
  }
}
</script>
