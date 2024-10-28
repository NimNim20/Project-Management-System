<template>
  <div>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
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
  margin: 2rem 0;
  position: sticky;
}

</style>