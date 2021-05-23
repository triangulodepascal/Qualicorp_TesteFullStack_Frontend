<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
        <h5>{{ title }}</h5>

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
            <!-- <template #header>
              <div class="table-header">
                <div class="p-d-flex p-jc-end">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="listFilter['global'].value" placeholder="Filtrar..." />
                  </span>
                </div>
              </div>
            </template> -->

            <Column field="name" header="Nome" :sortable="true" style="min-width: 10rem; width: 220px"> </Column>
            <Column field="telefone" header="telefone" :sortable="true" style="min-width: 10rem; width: 220px">
            </Column>

            <Column :exportable="false" style="min-width: 2rem; width: 190px">
              <template #body="{ data }">
                <div v-if="selectedUser && selectedUser.name == data.name">
                  <Button
                    v-tooltip.top="'Editar ' + data.name"
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-outlined p-button-primary p-mr-2"
                    @click="showUserDialog({ showAsEdition: true })"
                  />
                  <Button
                    v-tooltip.top="'Excluir ' + data.name"
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger"
                    @click="confirmDeleteUser({ ID: data.id, NAME: data.name })"
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
      :userToEdit="getUserToEdit()"
      :displayUserDialog="displayUserDialog"
      :usersList="user.usersList"
      @close-user-dialog="closeUserDialog($event)"
      v-if="displayUserDialog"
    />
  </div>
</template>

<script>
import { ref, computed, onBeforeMount } from 'vue'
import UserDialog from './components/UserDialog'
import userComposable from './composables/userComposable'

export default {
  components: { UserDialog },
  setup() {
    let title = ref('Listagem de usuários cadastrados na Qualicorp')
    let isLoading = ref(true)
    let isEdit = ref(false)
    let displayUserDialog = ref(false)

    const {
      // User info
      user,
      selectedUser,
      // CRUD Methods
      getUserList,
      // Secundary Methods
      getUserToEdit,
      confirmDeleteUser,
      // Page props
      dt,
      listFilter,
      // Page Methods
      exportCSV,
      rowClass,
      // initFilters,
    } = userComposable()

    user.usersListToView = computed(() => {
      return user.usersList.map(i => {
        return {
          id: i._id,
          name: i.name,
          telefone: i.telefone,
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
      if (success) await getUserList()
      isEdit.value = false
      displayUserDialog.value = false
    }

    onBeforeMount(async () => {
      isLoading.value = true
      await getUserList()
      isLoading.value = false
      displayUserDialog.value = false
    })

    return {
      // User info
      user,
      selectedUser,
      // CRUD Methods
      getUserList,
      // Secundary Methods
      getUserToEdit,
      confirmDeleteUser,
      showUserDialog,
      closeUserDialog,
      // Page props
      dt,
      listFilter,
      displayUserDialog,
      title,
      isLoading,
      isEdit,
      // Page Methods
      exportCSV,
      rowClass,
      // initFilters,
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
