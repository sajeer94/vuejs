<template>
  <div class="q-pa-md">

    <q-table flat bordered title="Roles" :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination"
      :loading="loading" binary-state-sort @request="onRequest">
      <template v-slot:top-right>
        <!-- Container with vertical layout -->
        <div class="column q-pa-sm">

          <!-- Add Role Button -->
          <div class="q-mb-lg">
            <q-btn color="primary" label="Add Role" to="userroles/add" tag="router-link" class="q-w-auto float-right" />
          </div>
          <q-space></q-space>
          <!-- Search Input -->
          <div>
            <q-input borderless dense debounce="300" v-model="globalFilter" placeholder="Search"
              @update:model-value="onSearch" clearable>
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

        </div>
      </template>
    </q-table>

  </div>
</template>



<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

// Reactive state
const rows = ref([])
const loading = ref(false)
const globalFilter = ref('')

// Table pagination state
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: '',
  descending: false,
  rowsNumber: 0
})

// Define table columns
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

]

// API call function
async function fetchFromApi(page, rowsPerPage, filter, sortBy, descending) {
  const requestBody = {
    page: page - 1, // backend uses zero-based page index
    size: rowsPerPage,
    globalFilter: filter || '',
    filters: [],
    sorts: sortBy
      ? [{ key: sortBy, direction: descending ? 'DESC' : 'ASC' }]
      : []
  }

  const { data } = await proxy.$axios.post('/users/role/search', requestBody)

  // Extract expected values from your API structure
  const { items = [], total = 0 } = data || {}

  return {
    data: items,
    total: total
  }
}

// Handle q-table events (pagination, sorting, etc.)
async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const result = await fetchFromApi(
      page,
      rowsPerPage,
      globalFilter.value,
      sortBy,
      descending
    )

    rows.value = result.data
    pagination.value = {
      ...pagination.value,
      page,
      rowsPerPage,
      sortBy,
      descending,
      rowsNumber: result.total
    }
  } catch (err) {
    console.error('Error fetching roles:', err)
  } finally {
    loading.value = false
  }
}

// Search input handler
function onSearch() {
  pagination.value.page = 1
  onRequest({ pagination: pagination.value })
}

// Initial load
onMounted(() => {
  onRequest({ pagination: pagination.value })
})
</script>
