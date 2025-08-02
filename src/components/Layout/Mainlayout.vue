<script setup>
import { ref } from 'vue'

// Define drawer open/close state and mini drawer toggle
const drawer = ref(false)
const miniState = ref(true)
</script>

<template>
  <div id="q-app" style="min-height: 100vh;">
    <div class="q-md">
      <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
        <q-header elevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn flat round dense icon="logout" tag="router-link" to="/"></q-btn>
          </q-toolbar>
        </q-header>

        <q-drawer v-model="drawer" show-if-above :mini="miniState" @mouseenter="miniState = false"
          @mouseleave="miniState = true" :width="200" :breakpoint="500" bordered
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
          <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
            <q-list padding>
              <q-item clickable :to="{ name: 'home' }" tag="router-link" v-ripple>
                <q-item-section avatar>
                  <q-icon name="home" to="/"></q-icon>
                </q-item-section>
                <q-item-section>Home</q-item-section>
              </q-item>

              <q-item clickable :to="{ name: 'about' }" tag="router-link" v-ripple>
                <q-item-section avatar>
                  <q-icon name="info" to="/about"></q-icon>
                </q-item-section>
                <q-item-section>About Us</q-item-section>
              </q-item>


              <q-separator></q-separator>

              <q-list padding>




                <!-- Parent: About Us -->
                <q-expansion-item icon="groups" label="Users" expand-separator dense default-opened>
                  <!-- Nested Link 1 -->
                  <q-item :to="{ name: 'employee' }" tag="router-link" clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon name="person" />
                    </q-item-section>
                    <q-item-section>
                      Employeeww
                    </q-item-section>
                  </q-item>

                  <!-- Nested Link 2 -->
                  <q-item to="/about/team" tag="router-link" clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon name="groups" />
                    </q-item-section>
                    <q-item-section>Team</q-item-section>
                  </q-item>
                </q-expansion-item>



              </q-list>

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
