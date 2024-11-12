<script>

import {mapActions, mapState} from 'pinia'

export default {
  name: 'ListManagementSession',
  computed: {
    ...mapState('listManagement', [
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
    ...mapActions('listManagement', [
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
