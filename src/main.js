require('dotenv').config()

import { createApp } from 'vue'
import App from './App.vue'

// Primevue default compoents
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmPopup from 'primevue/confirmpopup'
import ConfirmationService from 'primevue/confirmationservice'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Fieldset from 'primevue/fieldset'
import InputMask from 'primevue/inputmask'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Toolbar from 'primevue/toolbar'
import Tooltip from 'primevue/tooltip'

// Primevue styles
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(PrimeVue)
app.use(ConfirmationService)
app.use(ToastService)

app.directive('tooltip', Tooltip)

app.component('Button', Button)
app.component('Column', Column)
app.component('ConfirmDialog', ConfirmDialog)
app.component('ConfirmPopup', ConfirmPopup)
app.component('DataTable', DataTable)
app.component('Dialog', Dialog)
app.component('Fieldset', Fieldset)
app.component('InputMask', InputMask)
app.component('InputNumber', InputNumber)
app.component('InputText', InputText)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Toast', Toast)
app.component('Toolbar', Toolbar)

app.mount('#app')
