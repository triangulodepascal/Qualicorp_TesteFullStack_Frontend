import { ref, reactive } from 'vue'
import { FilterMatchMode, FilterOperator } from 'primevue/api'
// import { useConfirm } from 'primevue/useconfirm'
// import { useToast } from 'primevue/usetoast'
import axios from 'axios'

export default function useService() {
  // const confirm = useConfirm()
  // const toast = useToast()

  const selectedUser = ref()
  const user = reactive({ usersListToView: [], usersList: [] })

  const dt = ref()
  let listFilter = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    telefone: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  })

  // CRUD Methods
  const getUserList = async () => {
    try {
      const uri = `https://qualicorp-teste-backend.herokuapp.com/users`

      const { data } = await axios.get(uri)

      if (data.data.users.length > 0) {
        user.usersList = data.data.users
      } else {
        user.usersList = []
      }
    } catch (e) {
      console.log(e)
      user.usersList = []
    }
  }

  // Secundary Methods
  const getSelectedUser = () => {
    if (selectedUser?.value?.name) {
      return user.usersList.find(actualUser => {
        return actualUser.name === selectedUser.value.name
      })
    }
    return {}
  }

  // const confirmDeleteUser = async ({ ID, NAME }) => {
  //   confirm.require({
  //     message: `Tem certeza de que deseja remover o usuário '${NAME}'?`,
  //     header: 'Removendo usuário...',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: async () => {
  //       console.log({ ID })
  //       const { message } = await deleteUser({ ID })
  //       let toastStatus = { summary: 'Confirmação de exclusão.', life: 3500 }
  //       if (message == 'usuário deletado') {
  //         toastStatus.severity = 'info'
  //         toastStatus.detail = `Usuário '${NAME}' removido com sucesso.`
  //       } else {
  //         toastStatus.severity = 'error'
  //         toastStatus.detail = `Ocorreu um erro durante a tentativa de exclusão do usuário '${NAME}'!`
  //       }
  //       toast.add(toastStatus)
  //       await getUserList()
  //     },
  //     reject: () => {
  //       //callback to execute when user rejects the action
  //     },
  //   })
  // }

  // Page methods
  const exportCSV = () => {
    dt.value.exportCSV()
  }

  const rowClass = data => {
    return data?.name === selectedUser.value?.name ? 'row-selected' : null
  }

  const initFilters = () => {
    listFilter.value = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      telefone: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    }
  }
  return {
    // User info
    user,
    selectedUser,
    // CRUD Methods
    getUserList,
    // Secundary Methods
    getSelectedUser,
    // confirmDeleteUser,
    // Page props
    dt,
    listFilter,
    // Page Methods
    exportCSV,
    rowClass,
    initFilters,
  }
}
