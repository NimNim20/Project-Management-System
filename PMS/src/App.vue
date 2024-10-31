<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const isLoggedIn = ref(false)

</script>

<template>
  <div class="app-container">
    <header>


      <!-- Only show Logout button when logged in -->
      <button v-if="isLoggedIn" @click="handleLogout">Logout</button> 
    </header>
    <RouterView />
  </div>
</template>

<style scoped>


header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
}

.project-list {
  width: 35%;
  padding-right: 20px;
}

.project-details {
  width: 65%;
  border-left: 1px solid #ccc;
  padding-left: 20px;
}

button {
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #007a9b;
}

button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

p {
  margin-top: 1rem;
  font-size: 1.2rem;
}

.project-list li[data-v-45544ce3] {
  background-color: black;
}
</style>
