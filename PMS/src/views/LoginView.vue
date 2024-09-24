<script setup>
import { ref } from 'vue'
import { useUsers } from '../modules/useUsers'

const { user, login, logout } = user()
</script>

<template>
  <div>
    <div>
      <button v-if="!user" @click="login('admin@admin.com', 'admin1')">Log in</button>
      <button v-if="user" @click="logout">Log out</button>
      <p v-if="user">Logged in as: {{ user.email }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>