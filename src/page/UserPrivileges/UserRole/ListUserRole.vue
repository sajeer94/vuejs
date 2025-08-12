<template>
  <div class="q-pa-md">
    <q-table flat bordered title="Roles" :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination"
      :loading="loading" binary-state-sort @request="onRequest">
      <!-- Top toolbar -->
      <template v-slot:top-right>
        <div class="column q-pa-sm">
          <div class="q-mb-lg">
            <q-btn color="primary" label="Add Role" to="userroles/add" tag="router-link" class="q-w-auto float-right" />
          </div>
          <q-space />
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

      <!-- Action column slot -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn color="primary" label="Actions" size="sm">
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable  v-if="props.row.active === true" v-ripple :to="`userroles/edit/${props.row.id}`">
                  <q-item-section>Edit</q-item-section>
                </q-item>
                <q-item clickable v-ripple :to="`userroles/view/${props.row.id}`">
                  <q-item-section>View</q-item-section>
                </q-item>
                <q-item clickable v-if="props.row.active === false" v-ripple to="userroles">
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const rows = ref([])
const loading = ref(false)
const globalFilter = ref('')

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
  { name: 'action', label: 'Action', field: 'action', sortable: false } // New column
]

async function fetchFromApi(page, rowsPerPage, filter, sortBy, descending) {
  const requestBody = {
    page: page - 1,
    size: rowsPerPage,
    globalFilter: filter || '',
    filters: [],
    sorts: sortBy
      ? [{ key: sortBy, direction: descending ? 'DESC' : 'ASC' }]
      : []
  }

  const { data } = await proxy.$axios.post('/users/role/search', requestBody)
  const { items = [], total = 0 } = data || {}
  return { data: items, total: total }
}

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

function onSearch() {
  pagination.value.page = 1
  onRequest({ pagination: pagination.value })
}

onMounted(() => {
  onRequest({ pagination: pagination.value })
})
</script>
