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
              @click.prevent="removeUserFromList()"
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
    const { deleteUser } = userComposable()
    const toast = useToast()

    // Desestruturando informações recebidas e armazenando em nova variável
    let userData = { ...unref(props.userToDelete) }

    const title = ref(`Tem certeza de que deseja remover o usuário '%s'?`)
    title.value = title.value.replace('%s', userData.name)

    const closeDeleteDialog = shouldUpdateUserList => {
      emit('close-delete-dialog', shouldUpdateUserList)
    }

    // CRUD Methods
    const removeUserFromList = async () => {
      let shouldUpdateUserList = null

      let toastStatus = { summary: 'Remoção de usuário', life: 3500 }

      const { data } = await deleteUser(userData)

      if (data.message === 'success') {
        toastStatus.severity = 'success'
        toastStatus.detail = `Usuário '${userData.name}' removido com sucesso.`

        shouldUpdateUserList = true
      } else {
        toastStatus.severity = 'error'
        toastStatus.detail = `Ocorreu um erro durante a tentativa de remoção do usuário '${userData.name}'.`

        shouldUpdateUserList = false
      }
      toast.add(toastStatus) // Adicionando Toast à tela
      closeDeleteDialog(shouldUpdateUserList)
    }

    return {
      userData,
      title,
      closeDeleteDialog,
      removeUserFromList,
    }
  },
}
</script>

<style scoped></style>
