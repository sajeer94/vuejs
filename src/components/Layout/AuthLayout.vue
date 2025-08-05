<template>
  <div id="q-app" class="login-page" style="min-height: 100vh;">
    <q-layout view="lHh Lpr lFf" class="shadow-2 rounded-borders">

      <!-- Footer -->
      <q-footer reveal elevated>
        <q-toolbar>
          <q-toolbar-title>Footer</q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <!-- Centered Login Card -->
      <q-page-container>
        <q-page class="flex flex-center">
          <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 400px;">


            <q-card-section class="text-h6 text-center">
              Login
            </q-card-section>

            <!-- Error Alert -->
            <div v-if="errorMessage" class="row items-center bg-red-2 text-red-10 q-mb-md q-pa-sm rounded-borders"
              style="border: 1px solid #f5c6cb;">
              <div class="col-grow text-caption">
                {{ errorMessage }}
              </div>
              <q-btn flat dense icon="close" size="sm" @click="errorMessage = ''" class="q-ml-sm text-red-10" />
            </div>

            <!-- Success Alert -->
            <div v-else-if="successMessage"
              class="row items-center bg-green-2 text-green-10 q-mb-md q-pa-sm rounded-borders"
              style="border: 1px solid #c3e6cb;">
              <div class="col-grow text-caption">
                {{ successMessage }}
              </div>
              <q-btn flat dense icon="close" size="sm" @click="successMessage = ''" class="q-ml-sm text-green-10" />
            </div>

            <q-card-section>

              <q-form @submit.prevent="handleLogin">
                <q-input filled v-model="username" label="Username" type="text" class="q-mb-md" :dense="dense"
                  autocomplete="off" required />
                <q-input filled v-model="password" label="Password" type="password" class="q-mb-md" :dense="dense"
                  autocomplete="off" required />


                <q-btn :label="loading ? 'Logging in...' : 'Login'" type="submit" color="primary" unelevated
                  class="full-width" :loading="loading" :disable="loading" />
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
import Cookies from 'js-cookie'    // import js-cookie
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const dense = ref(true)

const router = useRouter()
const { proxy } = getCurrentInstance()

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await proxy.$axios.post('/auth/login', {
      username: username.value,
      password: password.value
    })

    const { access_token, refresh_token } = response.data

     Cookies.set('access_token', access_token, { expires: 1, secure: true, sameSite: 'Strict' })
    Cookies.set('refresh_token', refresh_token, { expires: 7, secure: true, sameSite: 'Strict' })

    successMessage.value = 'Successfully Logged In'
    setTimeout(() => {
      router.push('/home')
    }, 1000)
    return successMessage;

  } catch (err) {
    // Display error from interceptor
    if (err.status === 401) {
      errorMessage.value = 'Invalid username or password'
    } else if (err.status === 500) {
      errorMessage.value = 'Server error. Please try again later.'
    } else {
      errorMessage.value = err.message || 'Login failed'
    }
    router.push('/')
    return errorMessage;
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
