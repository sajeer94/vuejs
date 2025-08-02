<template>
  <div id="q-app"  class="login-page"  style="min-height: 100vh;">
    <q-layout view="lHh Lpr lFf" class="shadow-2 rounded-borders">
      <!-- Footer -->
      <q-footer reveal elevated>
        <q-toolbar>
          <q-toolbar-title>Footer</q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <!-- Page Container -->
      <q-page-container>
        <q-page padding>
          <h1>Login</h1>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
<style scoped>
.login-page {
  background: url('/login.jpg') no-repeat center center fixed;
  background-size: cover;
  object-fit: contain;
  background-repeat: no-repeat;
}
</style>
