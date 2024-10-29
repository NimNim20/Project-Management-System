<script setup>
import NavComponent from '../components/NavComponent.vue';
</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
    <NavComponent />

    <!-- Hero Section -->
    <section class="w-full max-w-4xl text-center p-8">
      <h1 class="text-4xl md:text-5xl font-bold text-indigo-600 mb-6">
        Welcome to PMS - Project Management System
      </h1>
      <p class="text-lg md:text-xl text-gray-600 mb-8">
        Manage your projects with ease, collaborate seamlessly, and boost productivity like never before.
      </p>
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
        <!-- Updated Button with Router Link -->
        <router-link to="/login">
          <button class="px-6 py-3 rounded-lg bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-500 transition duration-300">
            Get Started
          </button>
        </router-link>
      </div>
    </section>
  </main>
</template>

<style scoped>
</style>
