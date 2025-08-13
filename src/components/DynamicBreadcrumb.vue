<template>
    <q-toolbar class="bg-primary text-white" inset>
      <q-breadcrumbs active-color="white" class="text-white" separator="/">
        <q-breadcrumbs-el
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          :label="crumb.label"
          :icon="crumb.icon"   
          :to="crumb.to"
          exact
          class="text-white"
        />
      </q-breadcrumbs>
    </q-toolbar>
  </template>
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const breadcrumbData = ref({})
  
  // Load JSON from correct path
  async function loadBreadcrumbData() {
    try {
      const { data } = await axios.get('/data/menu.json') 
      breadcrumbData.value = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k.toLowerCase(), v])
      )
    } catch (err) {
      console.error('Failed to load breadcrumbs:', err)
    }
  }
  loadBreadcrumbData()
  
  // Computed breadcrumbs
  const breadcrumbs = computed(() => {
    const segments = route.path.split('/').filter(Boolean)
    let pathAcc = ''
  
    const crumbs = segments.map(segment => {
      pathAcc += '/' + segment
      const data = breadcrumbData.value[segment.toLowerCase()] || {}
      console.log
      const label = data.label || (/^\d+$/.test(segment) ? 'Detail' : segment.charAt(0).toUpperCase() + segment.slice(1))
      const icon = data.icon || 'folder'
      return { label, icon, to: pathAcc }
    })
  
    return [ ...crumbs]
  })
  </script>
  
  
  <style scoped>
  .q-breadcrumbs {
    font-size: 16px;
  }
  </style>
  