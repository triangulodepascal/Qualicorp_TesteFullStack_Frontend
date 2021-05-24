<template>
  <header>
    <h1>{{ title }}</h1>
  </header>

  <div class="p-grid">
    <div class="p-col-12">
      <div id="table" class="card p-col-10 p-offset-1">
        <Toolbar class="p-mb-4">
          <template #left>
            <Button label="Exportar" icon="pi pi-file-excel" class="p-button-secondary" @click="exportCSV()" />
          </template>

          <template #right>
            <Button
              label="Adicionar"
              icon="pi pi-plus"
              class="p-button-success p-mr-2"
              @click="showUserDialog({ showAsEdition: false })"
            />
          </template>
        </Toolbar>
        <div>
          <DataTable
            :value="user.usersListToView"
            :paginator="true"
            :rows="10"
            ref="dt"
            dataKey="id"
            :rowClass="rowClass"
            :rowHover="true"
            v-model:selection="selectedUser"
            filterDisplay="menu"
            selectionMode="single"
            :loading="isLoading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 25, 50]"
            currentPageReportTemplate="Apresentando de {first} à {last} de {totalRecords}"
            responsiveLayout="scroll"
            :globalFilterFields="['NAME', 'DESCRIPTION']"
            :filters="listFilter"
            paginatorPosition="bottom"
            stripedRows
            exportFilename="UsersList"
          >
            <Column field="name" header="Nome" :sortable="true" style="min-width: 10rem"> </Column>
            <Column field="telefone" header="Telefone" :sortable="true" style="min-width: 10rem; width: 5rem"></Column>
            <Column field="email" header="Email" :sortable="true" style="min-width: 10rem"> </Column>

            <Column :exportable="false" style="min-width: 2rem; width: 190px">
              <template #body="{ data }">
                <div v-if="selectedUser && selectedUser.name == data.name">
                  <Button
                    v-tooltip.top="'Editar ' + data.name"
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-outlined p-button-primary p-mr-5"
                    @click="showUserDialog({ showAsEdition: true })"
                  />
                  <Button
                    v-tooltip.top="'Excluir ' + data.name"
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-ml-5"
                    @click="showDeleteDialog()"
                  />
                </div>
              </template>
            </Column>
            <template #empty> Não há usuários a serem exibidos. </template>
          </DataTable>
        </div>
      </div>
    </div>
    <UserDialog
      :isEdit="isEdit"
      :userToEdit="getSelectedUser()"
      :displayUserDialog="displayUserDialog"
      :usersList="user.usersList"
      @close-user-dialog="closeUserDialog($event)"
      v-if="displayUserDialog"
    />
    <UserDeleteDialog
      :userToDelete="getSelectedUser()"
      :displayDeleteDialog="displayDeleteDialog"
      @close-delete-dialog="closeDeleteDialog($event)"
      v-if="displayDeleteDialog"
    />
  </div>
</template>

<script>
import { ref, computed, onBeforeMount } from 'vue'
import UserDialog from './components/UserDialog'
import UserDeleteDialog from './components/UserDeleteDialog'
import userComposable from './composables/userComposable'

export default {
  components: { UserDialog, UserDeleteDialog },
  setup() {
    let title = ref('Listagem de usuários cadastrados na Qualicorp')
    let isLoading = ref(true)
    let isEdit = ref(false)
    let displayUserDialog = ref(false)
    let displayDeleteDialog = ref(false)
    const {
      // User info
      user,
      selectedUser,
      // CRUD Methods
      getUserList,
      // Secundary Methods
      getSelectedUser,
      // Page props
      dt,
      // Page Methods
      exportCSV,
      rowClass,
    } = userComposable()

    user.usersListToView = computed(() => {
      return user.usersList.map(i => {
        return {
          id: i._id,
          name: i.name,
          telefone: i.telefone,
          email: i.email,
        }
      })
    })

    const showUserDialog = ({ showAsEdition }) => {
      if (showAsEdition == true) {
        isEdit.value = true
      } else {
        isEdit.value = false
      }
      displayUserDialog.value = true
    }

    const closeUserDialog = async success => {
      isLoading.value = false
      if (success) await getUserList()
      isLoading.value = false
      isEdit.value = false
      displayUserDialog.value = false
    }

    const showDeleteDialog = () => {
      displayDeleteDialog.value = true
    }

    const closeDeleteDialog = async success => {
      isLoading.value = false
      if (success) await getUserList()
      isLoading.value = false
      displayDeleteDialog.value = false
    }

    onBeforeMount(async () => {
      isLoading.value = true
      await getUserList()
      isLoading.value = false
      displayUserDialog.value = false
      displayDeleteDialog.value = false
    })

    return {
      // User info
      user,
      selectedUser,
      // CRUD Methods
      getUserList,
      // Secundary Methods
      getSelectedUser,
      showUserDialog,
      showDeleteDialog,
      closeUserDialog,
      closeDeleteDialog,
      // Page props
      dt,
      displayUserDialog,
      displayDeleteDialog,
      title,
      isLoading,
      isEdit,
      // Page Methods
      exportCSV,
      rowClass,
    }
  },
}
</script>

<style scoped>
::v-deep(.row-selected) {
  background-color: rgba(133, 146, 224, 0.349) !important;
  color: #000 !important;
}
</style>

<style>
header {
  background: #a7e0d8;
  padding: 2rem 0;
  text-align: center;
}
#table {
  padding: 0 2rem;
}
</style>
