<template>
  <div class="p-grid">
    <div class="p-col-20">
      <form>
        <Dialog
          :header="title"
          :visible="displayUserDialog"
          :closeOnEscape="false"
          :modal="true"
          :closable="false"
          :breakpoints="{ '960px': '75vw' }"
          :style="{ width: '50vw' }"
          class="p-fluid"
        >
          <div class="p-form-grid">
            <div class="p-field p-col-4">
              <label for="name">Nome</label>
              <InputText id="name" v-model="userData.name" />
            </div>
          </div>

          <div class="p-form-grid">
            <div class="p-field p-col-4">
              <label for="cpf">CPF</label>
              <InputText id="cpf" v-model="userData.cpf" />
            </div>
          </div>

          <div class="p-form-grid">
            <div class="p-field p-col-10">
              <label for="email">Email</label>
              <InputText id="email" v-model="userData.email" />
            </div>
          </div>

          <div class="p-form-grid">
            <div class="p-field p-col-5">
              <label for="telefone">Telefone</label>
              <InputText id="telefone" v-model="userData.telefone" />
            </div>
          </div>

          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click.prevent="closeUserDialog(false)" />
            <!-- <Button label="Salvar" icon="pi pi-save" :disabled="!isValid" autofocus @click.prevent="saveCopy()" /> -->
            <Button label="Salvar" icon="pi pi-save" autofocus @click.prevent="saveUser()" />
          </template>
        </Dialog>
      </form>
    </div>
  </div>
</template>

<script>
import { unref, ref, toRefs, reactive } from 'vue'
import userModel from '../models/userTemplate'
import userComposable from '../composables/userComposable'

export default {
  name: 'UserDialog',
  props: {
    isEdit: { type: Boolean, required: true },
    userToEdit: { type: Object, required: false },
    displayUserDialog: { type: Boolean, required: true },
    usersList: { type: Object, required: true },
  },
  setup(props, { emit }) {
    let { isEdit } = toRefs(props)
    let title
    let userData

    if (isEdit.value) {
      userData = { ...unref(props.userToEdit) }
      title = ref('Edição de usuário')
    } else {
      userData = reactive(JSON.parse(JSON.stringify(userModel)))
      title = ref('Adição de usuário')
    }

    const { persistUser } = userComposable()

    // let errors = reactive({})
    // let isValid = ref(true)

    // onBeforeMount(async () => {
    //   validate('CONFIG_TXT.Net1.TCPLocalAddress')
    // })

    const closeUserDialog = success => {
      emit('close-user-dialog', success)
    }

    // const validate = async field => {
    //   const schema = new ServiceValidation().createCopyContextSchema()

    //   try {
    //     await schema.validateAt(field, userData)
    //     errors[field] = false
    //     isValid.value = true
    //   } catch (err) {
    //     errors[field] = err.message
    //     isValid.value = false
    //   }

    //   return isValid.value
    // }

    const saveUser = async () => {
      const { data } = await persistUser(isEdit.value, userData)
      let updateUserList = data.message === 'success' ? true : false
      closeUserDialog(updateUserList)
    }

    return {
      userData,
      title,
      // errors,
      // isValid,
      closeUserDialog,
      // validate,
      saveUser,
    }
  },
}
</script>

<style scoped></style>
