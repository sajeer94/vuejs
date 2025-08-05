<script setup>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
const menuLists = ref([])

onMounted(async () => {
  const response = await fetch('/data/menu.json')
  const data = await response.json()
  menuLists.value = data.data
  // Log the fetched data
  console.log(menuLists.value)
})
// Define drawer open/close state and mini drawer toggle
const drawer = ref(false)
const miniState = ref(true)
const router = useRouter()
function logout() {
  Cookies.remove('access_token')
  router.push('/auth/login')
}
</script>

<template>
  <div id="q-app" style="min-height: 100vh;">
    <div class="q-md">
      <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
        <q-header elevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn flat round dense icon="logout" @click="logout"></q-btn>
          </q-toolbar>
        </q-header>
        <q-drawer v-model="drawer" show-if-above :mini="miniState" @mouseenter="miniState = false"
          @mouseleave="miniState = true" :width="250" :breakpoint="500" bordered
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
          <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
            <q-list padding>

              <!-- Loop through menuLists -->
              <template v-for="(menu, index) in menuLists" :key="index">

                <!-- If menu has children, use expansion item -->
                <q-expansion-item v-if="menu.children && menu.children.length" :icon="menu.icon || ''"
                  :label="menu.name" expand-separator dense default-opened>
                  <q-item v-for="(subMenu, subIndex) in menu.children" :key="subIndex" :to="{ name: subMenu.route }"
                    tag="router-link" clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon :name="subMenu.icon || 'chevron_right'" />
                    </q-item-section>
                    <q-item-section>{{ subMenu.name }}</q-item-section>
                  </q-item>
                </q-expansion-item>

                <!-- If no children, render as regular item -->
                <q-item v-else :to="{ name: menu.route }" tag="router-link" clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon :name="menu.icon || 'chevron_right'" />
                  </q-item-section>
                  <q-item-section>{{ menu.name }}</q-item-section>
                </q-item>

                <q-separator spaced inset />
              </template>

            </q-list>
          </q-scroll-area>
        </q-drawer>


        <q-page-container>
          <q-page padding>
            <router-view></router-view>

  
          </q-page>
        </q-page-container>
      </q-layout>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
