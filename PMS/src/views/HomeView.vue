<script setup>
import { useUsers } from '../modules/user/useUsers';
import NavComponent from '../components/NavComponent.vue';

const { isLoggedIn } = useUsers(); 
</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen text-orange-400">
    <NavComponent />

    <!-- Hero Section -->
    <section class="w-full max-w-4xl text-center p-8">
      <h1 class="text-4xl md:text-5xl font-bold text-purple-600 mb-6">
        🎃 Welcome to PMS - Project Management System 👻
      </h1>
      <p class="text-lg md:text-xl text-gray-300 mb-8">
        Manage your projects with ease, collaborate seamlessly, and boost productivity like never before... if you dare!
      </p>
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
        <!-- Conditional Button Based on Login Status -->
        <router-link v-if="isLoggedIn" to="/projects">
          <button class="px-6 py-3 rounded-lg bg-orange-600 text-white text-lg font-semibold hover:bg-orange-500 transition duration-300">
            See Projects
          </button>
        </router-link>
        <router-link v-else to="/login">
          <button class="px-6 py-3 rounded-lg bg-orange-600 text-white text-lg font-semibold hover:bg-orange-500 transition duration-300">
            Get Started
          </button>
        </router-link>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>
