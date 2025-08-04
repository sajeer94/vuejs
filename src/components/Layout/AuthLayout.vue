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
              <q-form @submit.prevent="handleLogin">
                <q-input filled v-model="username" label="Username" type="text" class="q-mb-md" :dense="dense"
                  required />

                <q-input filled v-model="password" label="Password" type="password" class="q-mb-md" :dense="dense"
                  required />
                <q-btn label="Login" type="submit" color="primary" unelevated class="full-width" />
              </q-form>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()
const dense = ref(true) // or false, depending on your preference
// Use global axios instance
const { proxy } = getCurrentInstance()

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await proxy.$axios.post('/auth/login', {
      username: username.value,
      password: password.value,
    })

    const { accessToken, refreshToken } = response.data

    // Save tokens to localStorage (your axios plugin uses this)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // Redirect to home page
    router.push('/')
  } catch (err) {
    errorMessage.value = 'Invalid username or password'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
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
