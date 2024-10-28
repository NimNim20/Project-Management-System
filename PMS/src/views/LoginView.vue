<script setup>
import { ref } from 'vue'
import { useUsers } from '../modules/useUsers'
import { useProjects } from '../modules/useProjects'

const { user, login, logout, isLoggedIn, error } = useUsers()

const email = ref('')
const password = ref('')

// Handle the login process
const handleLogin = async () => {
  await login('admin@admin.com', 'admin1')
  isLoggedIn.value = true
  if (user.value) {
    useProjects()  // Fetch projects after login
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  logout()
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>

    <!-- Show an error message if login fails -->
    <p v-if="error" class="error-message">{{ error }}</p>

    <!-- Login form -->
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>

      <div>
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <button type="submit">Login</button>
      <button v-if="isLoggedIn" @click="handleLogout">Logout</button> 
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
}

.error-message {
  color: red;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

div {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #007a9b;
}
</style>
