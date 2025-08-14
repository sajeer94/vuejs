<template>
  <div class="q-md">
    <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
      <q-header elevated :class="$q.dark.isActive ? 'bg-black' : 'bg-primary'">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn flat round dense icon="logout" @click="logout" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" show-if-above :mini="!drawer || miniState" @click.capture="drawerClick" :width="250"
        :breakpoint="500" bordered :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'">
        <q-scroll-area class="fit" color="primary" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>
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

      
        <div class="q-mini-drawer-hide absolute" style="top: 80px; left: 90%">
          <q-btn dense round unelevated color="primary" icon="chevron_left" @click="miniState = true" />
        </div>
      </q-drawer>

      <q-page-container class="bg-grey-3">
        <DynamicBreadcrumb />
        <q-page class="q-px-lg q-py-md">
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import DynamicBreadcrumb from '../DynamicBreadcrumb.vue'
export default {
  components: {
    DynamicBreadcrumb
  },
  setup() {
    const miniState = ref(false)
    const router = useRouter()
    const menuLists = ref([])

    onMounted(async () => {
      const response = await fetch('/data/menu.json')
      const data = await response.json()
      menuLists.value = data.data

    })
    function logout() {
      Cookies.remove('access_token')
      router.push('/auth/login')
    }
    return {
      drawer: ref(true),
      miniState,
      logout,
      menuLists,
      drawerClick(e) {
        if (miniState.value) {
          miniState.value = false
          e.stopPropagation()
        }
      }
    }
  }
}
</script>
