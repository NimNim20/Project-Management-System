<template>
  <div>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/projects">Projects</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  gap: 1.5rem; 
  margin: 2rem 0;
  position: sticky;
}

nav a {

  color:rgb(255, 255, 255);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s ease;
}

nav a:hover {
  color: rgb(184, 83, 174);
  transform: scale(1.1);
}
</style>
