<script setup>
import { ref } from 'vue'
import { useUsers } from '../modules/useUsers'

// Use the useUsers composable to access login, user, and error states
const { user, login, error } = useUsers()

const email = ref('')
const password = ref('')

// Function to handle form submission
const handleLogin = () => {
  login(email.value, password.value)
}
</script>

<template>
  <!-- Show login form if the user is not logged in -->
  <div class="login-container" v-if="!user">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <!-- Display error message if there's an error -->
        <p v-if="error" class="error-message">{{ error }}</p>

        <button type="submit" class="login-btn">Log In</button>
      </form>
    </div>
  </div>

  <!-- Show logged-in user information if the user is logged in -->
  <div v-else>
    <p>Logged in as: {{ user.email }}</p>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.login-box {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1.2rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.9rem;
}

.input-group input:focus {
  outline: none;
  border-color: #007bff;
}

.login-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #0056b3;
}

/* Style for the error message */
.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .login-box {
    padding: 1.5rem;
  }
}
</style>
