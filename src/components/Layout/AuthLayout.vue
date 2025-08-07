<template>
  <div id="q-app" class="auth-layout">
    <router-view />
  </div>
</template>

<script setup>

</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-image: url('/login.jpg');
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
