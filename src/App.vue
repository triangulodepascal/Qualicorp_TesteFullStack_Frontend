<template>
  <div class="p-grid">
    <div class="p-col-12">
      <div class="card">
         <h5>{{ title }}</h5>

         <h5>{{ user.usersListToView }}</h5>

          <!-- <div>
            <DataTable
            :value="user.usersListToView"
            :paginator="true"
            :rows="10"
            ref="dt"
            dataKey="id"
            :rowClass="rowClass"
            :rowHover="true"
            v-model:selection="selectedService"
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
            exportFilename="ServicesList"
          >
          </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// import { ref, computed, onBeforeMount } from 'vue'
import { ref, onBeforeMount } from 'vue'
import userComposable from './composables/userComposable'

export default {
  setup(){

    const {
      user,
      getUserList,
      getUserListToView,
    } = userComposable()

    let title = ref("Listagem de usuários cadastrados na Qualicorp")

    onBeforeMount(async () => {
      // isLoading.value = true
      // title.value = title.value.replace('%s', instanceName.value)
      // await fetchServices()
      user.usersList = await getUserList()
      user.usersListToView = await getUserListToView()
      // initFilters()
      // isLoading.value = false
      // displayCopyDialog.value = false
    })

    return {
      user,
      title,
    }
  },
};
</script>
