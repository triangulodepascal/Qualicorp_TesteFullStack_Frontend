// import { ref, reactive } from 'vue'
import { reactive } from 'vue'
import axios from 'axios'

export default function useService() {
  const user = reactive({ usersListToView: [], usersList: [] })

  // CRUD Methods
  const getUserList = async () => {
    try {
      const uri = `https://qualicorp-teste-backend.herokuapp.com/users`

      const { data } = await axios.get(uri)

      if (data.data.users.length > 0) {
        return data.data.users
      } else {
        return []
      }
    } catch (e) {
      console.log(e)
      return []
    }
  }

  // Secundary Methods
  const getUserListToView = () => {
    return user.usersList.map(i => {
      return {
        name: i.name,
        telefone: i.telefone,
      }
    })
  }
  return {
    user,
    getUserList,
    getUserListToView,
  }
}
