<script setup>
import { ref } from 'vue';
import { useUsers } from '../modules/useUsers';
import { useProjects } from '../modules/useProjects';

const { user, login, logout, isLoggedIn, error } = useUsers();

const email = ref('');
const password = ref('');

// Handle the login process
const handleLogin = async () => {
  try {
    await login(email.value, password.value);
    if (user.value) {
      useProjects();
    }
  } catch (err) {
    console.error('Login error:', err);
  }
};

const handleLogout = () => {
  logout();
};
</script>

<template>
  <div class="login-container bg-black text-orange-400 p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-12">
    <h1 class="text-3xl font-bold text-center mb-4">🎃 Halloween Login 👻</h1>

    <!-- Show an error message if login fails -->
    <p v-if="error" class="error-message text-red-400 text-center mb-4">{{ error }}</p>

    <!-- Login form -->
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block font-semibold">Email:</label>
        <input v-model="email" type="email" id="email" required
               class="mt-1 block w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>

      <div class="mb-4">
        <label for="password" class="block font-semibold">Password:</label>
        <input v-model="password" type="password" id="password" required
               class="mt-1 block w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>

      <button type="submit" class="bg-orange-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-orange-500">
        Login
      </button>
      <button v-if="isLoggedIn" @click.prevent="handleLogout" class="mt-2 bg-red-600 text-white py-2 px-4 rounded transition duration-300 hover:bg-red-500">
        Logout
      </button>
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
  animation: pulse 10s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
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
  color: black;
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
