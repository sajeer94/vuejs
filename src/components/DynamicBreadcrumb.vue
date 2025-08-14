<template>
  <q-toolbar class="bg-primary text-white">
    <q-breadcrumbs
      v-if="!loadingBreadcrumbs"
      active-color="white"
      class="text-white"
      separator="/"
    >
      <q-breadcrumbs-el
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        :label="crumb.label"
        :icon="crumb.icon"
        v-bind="index === 0 ? { tag: 'span' } : { to: crumb.to, exact: true }"
        class="text-white"
      />
    </q-breadcrumbs>
  </q-toolbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbData = ref({})
const loadingBreadcrumbs = ref(true)

async function loadBreadcrumbData() {
  try {
    const response = await fetch('/data/menu.json')
    const data = await response.json()

    // Store keys as lowercase for case-insensitive lookup
    breadcrumbData.value = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k.toLowerCase(), v])
    )
  } catch (err) {
    console.error('Failed to load breadcrumbs:', err)
  } finally {
    loadingBreadcrumbs.value = false
  }
}

onMounted(loadBreadcrumbData)

const breadcrumbs = computed(() => {
  if (loadingBreadcrumbs.value) return []

  const segments = route.path.split('/').filter(Boolean)
  let pathAcc = ''

  return segments.map(segment => {
    pathAcc += '/' + segment
    const key = segment.toLowerCase()
    const data = breadcrumbData.value[key] || {}

    const label =
      data.label ||
      (/^\d+$/.test(segment)
        ? 'Detail'
        : segment.charAt(0).toUpperCase() + segment.slice(1))

    // Icon fix: ensure valid string, else fallback
    const icon =
      typeof data.icon === 'string' && data.icon.trim() !== ''
        ? data.icon.trim()
        : 'folder'

    return { label, icon, to: pathAcc }
  })
})
</script>

<style scoped>
.q-breadcrumbs {
  font-size: 16px;
}
</style>
