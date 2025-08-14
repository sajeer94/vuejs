<template>
  <div class="q-pa-md">
    <!-- Banner -->
    <q-banner
      v-if="bannerMessage"
      class="bg-green-2 text-green-10 q-mb-md rounded-borders"
      inline-actions
      style="border: 1px solid #c3e6cb;"
    >
      <div class="text-caption">{{ bannerMessage }}</div>
      <template v-slot:action>
        <q-btn flat dense round icon="close" size="sm" class="text-green-10" @click="bannerMessage = ''" />
      </template>
    </q-banner>

    <!-- Roles Table -->
    <q-table
      flat
      bordered
      title="Roles"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      binary-state-sort
      @request="onRequest"
    >
      <!-- Top Toolbar -->
      <template v-slot:top-right>
        <div class="column q-pa-sm">
          <div class="q-mb-lg">
            <q-btn
              color="primary"
              label="Add Role"
              to="userroles/add"
              tag="router-link"
              class="q-w-auto float-right"
            />
          </div>
          <q-space />
          <q-input
            borderless
            dense
            debounce="300"
            v-model="globalFilter"
            placeholder="Search"
            @update:model-value="onSearch"
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

      <!-- Header with column filters -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="q-pa-xs">
            <div class="column items-start q-gutter-xs">
              <div class="text-weight-medium text-grey-8">{{ col.label }}</div>

              <!-- Filter inputs for code, name, description -->
              <q-input
                v-if="['code', 'name','description'].includes(col.name)"
                dense
                outlined
                debounce="300"
                v-model="columnFilters[col.name]"
                @update:model-value="onColumnSearch"
                placeholder="Filter..."
                input-class="text-body2 text-left"
                style="max-width: 100%;"
                clearable
              />

              <!-- Blank space for active and action (no border) -->
              <div
                v-else-if="['active', 'action'].includes(col.name)"
                style="height: 30px;"
              ></div>
            </div>
          </q-th>
        </q-tr>
      </template>

      <!-- Body cells center-aligned -->
      <template v-slot:body-cell="props">
        <q-td :props="props" class="text-center">
          <template v-if="props.col.name === 'active'">
            {{ props.row.active ? 'Yes' : 'No' }}
          </template>
          <template v-else-if="props.col.name === 'action'">
            <q-btn color="primary" label="Actions" size="sm">
              <q-menu>
                <q-list style="min-width: 150px">
                  <q-item
                    clickable
                    v-if="props.row.active"
                    v-ripple
                    :to="`userroles/edit/${props.row.id}`"
                  >
                    <q-item-section>Edit</q-item-section>
                  </q-item>

                  <q-item clickable v-ripple :to="`userroles/view/${props.row.id}`">
                    <q-item-section>View</q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-if="!props.row.active"
                    v-ripple
                    @click="promptDelete(props.row.id)"
                  >
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>
          <template v-else>
            {{ props.row[props.col.field] }}
          </template>
        </q-td>
      </template>
    </q-table>

    <!-- Delete confirmation -->
    <q-dialog v-model="confirmDialog">
      <q-card>
        <q-card-section class="text-h6">Confirm Delete</q-card-section>
        <q-card-section>Are you sure you want to delete this role?</q-card-section>
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
import { debounce } from 'quasar'

const { proxy } = getCurrentInstance()

// Table state
const rows = ref([])
const loading = ref(false)
const globalFilter = ref('')
const bannerMessage = ref('')

// Column filters
const columnFilters = ref({
  code: '',
  name: '',
  description: ''
})

// Pagination
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  descending: false,
  rowsNumber: 0
})

// Columns
const columns = [
  { name: 'code', label: 'Code', field: 'code', sortable: true },
  { name: 'name', label: 'Role Name', field: 'name', sortable: true },
  { name: 'description', label: 'Description', field: 'description', sortable: true },
  { name: 'active', label: 'Active', field: 'active', sortable: true },
  { name: 'action', label: 'Action', field: 'action', sortable: true }
]

// Delete dialog
const confirmDialog = ref(false)
const roleIdToDelete = ref(null)

// Fetch roles from API
async function fetchFromApi(page, rowsPerPage, filter, sortBy, descending) {
  const filters = Object.entries(columnFilters.value)
    .filter(([key, val]) => val)
    .map(([key, val]) => ({
      key,
      value: val,
      operator: 'LIKE'
    }))

  const requestBody = {
    page: page - 1,
    size: rowsPerPage,
    globalFilter: filter || '',
    filters,
    sorts: sortBy ? [{ key: sortBy, direction: descending ? 'DESC' : 'ASC' }] : []
  }

  const { data } = await proxy.$axios.post('/users/role/search', requestBody)
  return { data: data?.items || [], total: data?.total || 0 }
}

// Request handler
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

// Global search
function onSearch() {
  pagination.value.page = 1
  onRequest({ pagination: pagination.value })
}

// Column search (debounced)
const onColumnSearch = debounce(() => {
  pagination.value.page = 1
  onRequest({ pagination: pagination.value })
}, 300)

// Delete actions
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

// Initial fetch
onMounted(() => {
  onRequest({ pagination: pagination.value })
})
</script>

<style scoped>
/* Optional: make all body cells centered */
.q-table tbody td {
  text-align: justify;
}
</style>
