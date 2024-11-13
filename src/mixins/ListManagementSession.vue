<script>
import {mapActions, mapState} from 'pinia'
import {useListManagementStore} from '@/stores/list-management-session'

export default {
  name: 'ListManagementSession',
  computed: {
    ...mapState(useListManagementStore, [
      'departmentForms',
      'disableControls',
      'evaluationTypes',
      'instructors',
      'isAddingDepartmentForm',
      'isAddingEvaluationType',
      'isAddingInstructor',
      'isConfirming',
      'isSaving',
      'itemToDelete',
      'onDelete'
    ])
  },
  methods: {
    ...mapActions(useListManagementStore, [
      'addDepartmentForm',
      'addEvaluationType',
      'addInstructor',
      'confirmDeleteDepartmentForm',
      'confirmDeleteEvaluationType',
      'confirmDeleteInstructor',
      'deleteDepartmentForm',
      'deleteEvaluationType',
      'deleteInstructor',
      'init',
      'reset',
      'setAddingDepartmentForm',
      'setAddingEvaluationType',
      'setAddingInstructor',
      'setDisableControls'
    ])
  }
}
</script>
