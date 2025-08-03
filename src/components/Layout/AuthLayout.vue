<template>
  <div id="q-app" class="login-page" style="min-height: 100vh;">
    <q-layout view="lHh Lpr lFf" class="shadow-2 rounded-borders">

      <!-- Footer -->
      <q-footer reveal elevated>
        <q-toolbar>
          <q-toolbar-title>Footer</q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <!-- Centered Content -->
      <q-page-container>
        <q-page class="flex flex-center">
          <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 400px;">
            <q-card-section class="text-h6 text-center">
              Login
            </q-card-section>

            <q-card-section>
              <q-form @submit.prevent="onLogin">
                <q-input
                  filled
                  v-model="email"
                  label="Email"
                  type="email"
                  class="q-mb-md"
                  dense
                  required
                />
                <q-input
                  filled
                  v-model="password"
                  label="Password"
                  type="password"
                  class="q-mb-md"
                  dense
                  required
                />
                <q-btn
                  label="Login"
                  type="submit"
                  color="primary"
                  unelevated
                  class="full-width"
                />
              </q-form>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const onLogin = () => {
  console.log('Logging in with', email.value, password.value)
}
</script>

<style scoped>
.login-page {
  background-image: url('/login.jpg');
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>
