<template>
  <div class="q-pa-md">
    <!-- Banner for messages -->

    <q-banner v-if="bannerMessage" class="bg-green-2 text-green-10 q-mb-md rounded-borders" inline-actions
      style="border: 1px solid #c3e6cb;">
      <div class="text-caption">
        {{ bannerMessage }}
      </div>

      <template v-slot:action>
        <q-btn flat dense round icon="close" size="sm" class="text-green-10" @click="bannerMessage = ''" />
      </template>
    </q-banner>
    <q-table flat bordered title="Roles" :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination"
      :loading="loading" binary-state-sort @request="onRequest">
      <!-- Top Toolbar -->
      <template v-slot:top-right>
        <div class="column q-pa-sm">
          <div class="q-mb-lg">
            <q-btn color="primary" label="Add Role" to="userroles/add" tag="router-link" class="q-w-auto float-right" />
          </div>
          <q-space />
          <q-input borderless dense debounce="300" v-model="globalFilter" placeholder="Search"
            @update:model-value="onSearch" clearable>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

      <!-- Action Column -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn color="primary" label="Actions" size="sm">
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable v-if="props.row.active" v-ripple :to="`userroles/edit/${props.row.id}`">
                  <q-item-section>Edit</q-item-section>
                </q-item>

                <q-item clickable v-ripple :to="`userroles/view/${props.row.id}`">
                  <q-item-section>View</q-item-section>
                </q-item>

                <q-item clickable v-if="!props.row.active" v-ripple @click="promptDelete(props.row.id)">
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="confirmDialog">
      <q-card>
        <q-card-section class="text-h6">
          Confirm Delete
        </q-card-section>

        <q-card-section>
          Are you sure you want to delete this role?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const rows = ref([])
const loading = ref(false)
const globalFilter = ref('')
const bannerMessage = ref('')

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  descending: false,
  rowsNumber: 0
})

const columns = [
  { name: 'code', label: 'Code', field: 'code', sortable: true },
  { name: 'name', label: 'Role Name', field: 'name', sortable: true },
  { name: 'description', label: 'Description', field: 'description', sortable: false },
  {
    name: 'active',
    label: 'Active',
    field: 'active',
    sortable: true,
    format: val => (val ? 'Yes' : 'No')
  },
  { name: 'action', label: 'Action', field: 'action', sortable: false }
]

// Dialog control for delete confirmation
const confirmDialog = ref(false)
const roleIdToDelete = ref(null)

async function fetchFromApi(page, rowsPerPage, filter, sortBy, descending) {
  const requestBody = {
    page: page - 1,
    size: rowsPerPage,
    globalFilter: filter || '',
    filters: [],
    sorts: sortBy ? [{ key: sortBy, direction: descending ? 'DESC' : 'ASC' }] : []
  }

  const { data } = await proxy.$axios.post('/users/role/search', requestBody)
  return { data: data?.items || [], total: data?.total || 0 }
}

async function onRequest({ pagination: pag }) {
  const { page, rowsPerPage, sortBy, descending } = pag
  loading.value = true
  try {
    const result = await fetchFromApi(page, rowsPerPage, globalFilter.value, sortBy, descending)
    rows.value = result.data
    pagination.value = { ...pagination.value, page, rowsPerPage, sortBy, descending, rowsNumber: result.total }
  } catch (err) {
    console.error('Error fetching roles:', err)
  } finally {
    loading.value = false
  }
}

function onSearch() {
  pagination.value.page = 1
  onRequest({ pagination: pagination.value })
}

function promptDelete(roleId) {
  roleIdToDelete.value = roleId
  confirmDialog.value = true
}

async function confirmDelete() {
  if (!roleIdToDelete.value) return
  try {
    await proxy.$axios.delete(`/users/role/${roleIdToDelete.value}`)
    bannerMessage.value = 'Role deleted successfully!'
    onRequest({ pagination: pagination.value })
  } catch (err) {
    bannerMessage.value = 'Error deleting role.'
  } finally {
    confirmDialog.value = false
    roleIdToDelete.value = null
  }
}

onMounted(() => {
  onRequest({ pagination: pagination.value })
})
</script>
