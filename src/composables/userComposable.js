import { ref, reactive } from 'vue'
import axios from 'axios'
import api from '../config/configs'

export default function useService() {
  const selectedUser = ref()
  const user = reactive({ usersListToView: [], usersList: [] })

  const dt = ref()

  // CRUD Methods
  const getUserList = async () => {
    try {
      const uri = `${api.API_URL}/users`

      const { data } = await axios.get(uri)

      if (data.message == 'success') {
        user.usersList = data.data
      } else {
        user.usersList = []
      }
    } catch (e) {
      console.log(e)
      user.usersList = []
    }
  }

  const persistUser = async (isEdit, userData) => {
    let res = {}
    try {
      const method = isEdit ? 'put' : 'post'

      let url = `${api.API_URL}/user`

      if (method == 'put') {
        url = url + '/' + userData._id
      }

      res = await axios({
        method,
        url,
        data: userData,
      })

      return res
    } catch (e) {
      console.log(e)
      return res
    }
  }

  const deleteUser = async userData => {
    let res = {}

    try {
      const uri = `${api.API_URL}/user/${userData._id}`

      const res = await axios.delete(uri)

      return res
    } catch (e) {
      console.log(e)
      return res
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

  // Page methods
  const exportCSV = () => {
    dt.value.exportCSV()
  }

  const rowClass = data => {
    return data?.name === selectedUser.value?.name ? 'row-selected' : null
  }

  return {
    // User info
    user,
    selectedUser,
    // CRUD Methods
    getUserList,
    persistUser,
    deleteUser,
    // Secundary Methods
    getSelectedUser,
    // Page props
    dt,
    // Page Methods
    exportCSV,
    rowClass,
  }
}
