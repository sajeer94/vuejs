<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Users"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const rows = ref([])
const loading = ref(true)
const filter = ref('')

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0
})

const columns = [
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'username', label: 'Username', field: 'username', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'phone', label: 'Phone', field: 'phone', sortable: false }
]
const { proxy } = getCurrentInstance()

// Fetch and filter/sort/paginate data
async function fetchFromApi(page, rowsPerPage, filter, sortBy, descending) {
  const response = await proxy.$axios.get('/users')
  let data = response.data

  if (filter) {
    data = data.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    )
  }

  if (sortBy) {
    data.sort((a, b) => {
      const valA = a[sortBy]
      const valB = b[sortBy]

      if (typeof valA === 'number') {
        return descending ? valB - valA : valA - valB
      }

      return descending
        ? String(valB).localeCompare(String(valA))
        : String(valA).localeCompare(String(valB))
    })
  }

  const total = data.length
  const start = (page - 1) * rowsPerPage
  const pagedData = rowsPerPage === 0 ? data : data.slice(start, start + rowsPerPage)

  return { data: pagedData, total }
}

// Called when q-table needs data
async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const filterValue = props.filter

  loading.value = true

  try {
    const result = await fetchFromApi(page, rowsPerPage, filterValue, sortBy, descending)
    rows.value = result.data
    pagination.value.rowsNumber = result.total
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
  } catch (err) {
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

// Load initial data when page opens
onMounted(() => {
  onRequest({
    pagination: pagination.value,
    filter: filter.value
  })
})
</script>
