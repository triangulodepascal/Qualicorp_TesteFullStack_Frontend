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
              <label for="name">Nome Completo</label>
              <InputText
                id="name"
                v-model="userData.name"
                :class="{ 'p-invalid': getError('name') }"
                @input="validate('name')"
              />
              <small class="p-error" v-if="errors['name']">{{ errors['name'] }}</small>
            </div>
          </div>

          <div class="p-form-grid">
            <div class="p-field p-col-4">
              <label for="cpf">CPF</label>
              <InputMask
                id="cpf"
                v-model="userData.cpf"
                mask="999.999.999-99"
                :class="{ 'p-invalid': getError('cpf') }"
                @keypress="validate('cpf')"
                @keyup="validate('cpf')"
              ></InputMask>
              <small class="p-error" v-if="errors['cpf']">{{ errors['cpf'] }}</small>
            </div>
          </div>

          <div class="p-form-grid">
            <div class="p-field p-col-10">
              <label for="email">Email</label>
              <InputText
                :class="{ 'p-invalid': errors['email'] }"
                id="email"
                v-model="userData.email"
                @keypress="validate('email')"
                @keyup="validate('email')"
              />
              <small class="p-error" v-if="errors['email']">{{ errors['email'] }}</small>
            </div>
          </div>

          <div class="p-form-grid">
            <div class="p-field p-col-5">
              <label for="telefone">Telefone</label>
              <InputMask
                id="telefone"
                v-model="phoneNumber"
                mask="(99) 99999-9999"
                :unmask="true"
                :autoClear="false"
                :class="{ 'p-invalid': getError('telefone') }"
                @keypress="validate('telefone')"
                @keyup="validate('telefone')"
              ></InputMask>
              <small class="p-error" v-if="errors['telefone']">{{ errors['telefone'] }}</small>
            </div>
          </div>

          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click.prevent="closeUserDialog(false)" />
            <Button
              label="Salvar"
              icon="pi pi-save"
              :disabled="!isAnyFieldWrong"
              autofocus
              @click.prevent="saveUser()"
            />
          </template>
        </Dialog>
      </form>
    </div>
  </div>
</template>

<script>
import { unref, ref, toRefs, reactive, computed, onBeforeMount } from 'vue'
import userModel from '../models/userTemplate'
import userComposable from '../composables/userComposable'
import UserValidation from '../validations/user/UserValidation'
import { useToast } from 'primevue/usetoast'

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
    let { usersList } = toRefs(props)

    const toast = useToast()

    let title
    let userData
    let errors = reactive({})
    const { persistUser } = userComposable()
    let phoneNumber = ref('')

    if (isEdit.value) {
      userData = { ...unref(props.userToEdit) }
      title = ref('Edição de usuário')
    } else {
      userData = reactive(JSON.parse(JSON.stringify(userModel)))
      title = ref('Adição de usuário')
    }

    onBeforeMount(async () => {
      phoneNumber.value = getPhoneMasked()
      onMountedValidation()
    })

    const closeUserDialog = success => {
      emit('close-user-dialog', success)
    }

    const getPhoneMasked = () => {
      let phoneStr = userData.telefone.toString()
      return `(${phoneStr.slice(0, 2)}) ${phoneStr.slice(2, 7)}-${phoneStr.slice(7, 12)}`
    }

    const getPhoneUnmasked = () => {
      let phoneStr = phoneNumber.value
      return `${phoneStr.slice(1, 3)}${phoneStr.slice(5, 10)}${phoneStr.slice(11, 15)}`
    }

    const isAnyFieldWrong = computed(() => {
      let valid = true
      let validationKeys = Object.keys(errors)
      for (let i = 0; i < validationKeys.length; i++) {
        if (errors[validationKeys[i]]) {
          valid = false
          break
        }
      }
      return valid
    })

    const onMountedValidation = () => {
      userData.telefone = parseInt(getPhoneUnmasked(), 10)
      let validationList = !userData._id ? usersList.value : []

      const schema = new UserValidation().createContextSchema(validationList)

      try {
        schema.validateSync(userData, { abortEarly: false })
      } catch (err) {
        for (let i = 0; i < err.inner.length; i++) {
          let validationErr = err.inner[i]
          errors[validationErr.path] = validationErr.message
        }
      }
    }

    const getError = field => {
      return errors[field]
    }

    const validate = async field => {
      userData.telefone = parseInt(phoneNumber.value, 10)

      let validationList = !userData._id ? usersList.value : []

      const schema = new UserValidation().createContextSchema(validationList)

      try {
        schema.validateSyncAt(field, userData)
        errors[field] = false
      } catch (err) {
        errors[field] = err.message
      }
    }

    const saveUser = async () => {
      let updateUserList = null
      let toastStatus = isEdit.value
        ? { summary: 'Edição de usuário', life: 3500 }
        : { summary: 'Criação de usuário', life: 3500 }
      const { data } = await persistUser(isEdit.value, userData)

      if (data.message === 'success') {
        toastStatus.severity = 'success'
        if (isEdit.value) {
          toastStatus.detail = `Usuário '${userData.name}' editado com sucesso.`
        } else {
          toastStatus.detail = `Usuário '${userData.name}' criado com sucesso.`
        }

        updateUserList = true
      } else {
        toastStatus.severity = 'error'
        if (isEdit.value) {
          toastStatus.detail = `Ocorreu um erro durante a tentativa de edição do usuário '${userData.name}'.`
        } else {
          toastStatus.detail = `Ocorreu um erro durante a tentativa de criação do usuário '${userData.name}'.`
        }

        updateUserList = false
      }
      toast.add(toastStatus)
      closeUserDialog(updateUserList)
    }

    return {
      userData,
      title,
      isAnyFieldWrong,
      errors,
      phoneNumber,
      closeUserDialog,
      validate,
      saveUser,
      getError,
    }
  },
}
</script>

<style scoped></style>
