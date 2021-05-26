<template>
  <div class="p-grid">
    <div class="p-col-20">
      <form>
        <Dialog
          :header="title"
          :visible="displayDeleteDialog"
          :closeOnEscape="false"
          :modal="true"
          :closable="false"
          :breakpoints="{ '960px': '75vw' }"
          :style="{ width: '50vw' }"
          class="p-fluid"
        >
          <template #footer>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              class="p-button-text"
              @click.prevent="closeDeleteDialog(false)"
            />
            <Button
              label="Deletar"
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              autofocus
              @click.prevent="deleteUserAndUpdate()"
            />
          </template>
        </Dialog>
      </form>
    </div>
  </div>
</template>

<script>
import { unref, ref } from 'vue'
import userComposable from '../composables/userComposable'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'UserDialog',
  props: {
    userToDelete: { type: Object, required: false },
    displayDeleteDialog: { type: Boolean, required: true },
  },
  setup(props, { emit }) {
    let userData = { ...unref(props.userToDelete) }
    const title = ref(`Tem certeza de que deseja remover o usuário '%s'?`)
    title.value = title.value.replace('%s', userData.name)

    const toast = useToast()
    const { deleteUser } = userComposable()

    const closeDeleteDialog = success => {
      emit('close-delete-dialog', success)
    }

    // CRUD Methods
    const deleteUserAndUpdate = async () => {
      let updateUserList = null
      let toastStatus = { summary: 'Remoção de usuário', life: 3500 }
      const { data } = await deleteUser(userData)

      if (data.message === 'success') {
        toastStatus.severity = 'success'
        toastStatus.detail = `Usuário '${userData.name}' removido com sucesso.`

        updateUserList = true
      } else {
        toastStatus.severity = 'error'
        toastStatus.detail = `Ocorreu um erro durante a tentativa de remoção do usuário '${userData.name}'.`

        updateUserList = false
      }
      toast.add(toastStatus)
      closeDeleteDialog(updateUserList)
    }

    return {
      userData,
      title,
      closeDeleteDialog,
      deleteUserAndUpdate,
    }
  },
}
</script>

<style scoped></style>
