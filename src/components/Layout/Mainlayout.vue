<script setup>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

const menuLists = ref([])

onMounted(async () => {
  const response = await fetch('/data/menu.json')
  const data = await response.json()
  menuLists.value = data.data
  console.log(menuLists.value)
})

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
    <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
      <!-- Header -->
      <q-header elevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn flat round dense icon="logout" @click="logout"></q-btn>
        </q-toolbar>
      </q-header>

      <!-- Drawer -->
      <q-drawer v-model="drawer" show-if-above :mini="miniState" @mouseenter="miniState = false"
        @mouseleave="miniState = true" :width="250" :breakpoint="500" bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>

            <!-- Loop through menuLists -->
            <template v-for="(menu, index) in menuLists" :key="index">
              <!-- GROUP HEADER -->
              <q-item-label v-if="menu.type === 'group'" header class="text-weight-bold text-primary">
                {{ menu.name }}
              </q-item-label>
              <template v-for="(subMenu, index) in menu.children" :key="index">
                <q-expansion-item :icon="subMenu.icon" :label="subMenu.name" expand-separator
                  v-if="subMenu.children && subMenu.children.length">
                  <template v-for="(subsMenu, index) in subMenu.children" :key="index">
                    <q-expansion-item :icon="subsMenu.icon" :label="subsMenu.name" expand-separator
                      v-if="subsMenu.children && subsMenu.children.length">
                      <template v-for="(substMenu, index) in subsMenu.children" :key="index">
                        <q-item :to="substMenu.url" tag="router-link" clickable v-ripple :style="{ paddingLeft: '25px' }">
                          <q-item-section avatar>
                            <q-icon :name="substMenu.icon" />
                          </q-item-section>
                          <q-item-section>{{ substMenu.name }}</q-item-section>
                        </q-item>
                      </template>
                    </q-expansion-item>
                    <q-item :to="subsMenu.url" tag="router-link" v-else clickable v-ripple>
                      <q-item-section avatar>
                        <q-icon :name="subsMenu.icon || 'chevron_right'" />
                      </q-item-section>
                      <q-item-section>{{ subsMenu.name }}</q-item-section>
                    </q-item>

                  </template>
                </q-expansion-item>
                <q-item  :to="subMenu.url" tag="router-link" v-else clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon :name="subMenu.icon || 'chevron_right'" />
                  </q-item-section>
                  <q-item-section>{{ subMenu.name }}</q-item-section>
                </q-item>
              </template>
            </template>

          </q-list>
        </q-scroll-area>
      </q-drawer>

      <!-- Page container -->
      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
