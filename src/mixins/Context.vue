<script>
import {useContextStore} from '@/stores/context'
import {mapActions, mapState} from 'pinia'
import {nextTick} from 'vue'

export default {
  name: 'Context',
  computed: {
    ...mapState('context', [
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
    ...mapActions('context', [
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
