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
                :class="{ 'p-invalid': getError('telefone') }"
                @keypress="validate('telefone')"
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
      onMountedValidation()
    })

    const closeUserDialog = success => {
      emit('close-user-dialog', success)
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

    userData.telefone = computed(() => {
      return parseInt(phoneNumber.value, 10)
    })

    const onMountedValidation = () => {
      let validationList = userData._id ? usersList.value : []

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
      const { data } = await persistUser(isEdit.value, userData)
      let updateUserList = data.message === 'success' ? true : false
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
