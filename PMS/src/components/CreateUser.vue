<template>
    <div>
      <h2>Create a New User</h2>
      <form @submit.prevent="handleCreateUser">
        <input v-model="name" type="text" placeholder="Name" />
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="age" type="number" placeholder="Age" />
        <button type="submit">Create User</button>
      </form>
  
      <div v-if="createdUser">
        <h3>User Created</h3>
        <p>Name: {{ createdUser.name }}</p>
        <p>Email: {{ createdUser.email }}</p>
        <p>Age: {{ createdUser.age }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { createUser } from '../modules/createUser';
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        age: '',
        createdUser: null
      };
    },
    methods: {
      handleCreateUser() {
        // Call the createUser function and store the returned user
        this.createdUser = createUser(this.name, this.email, this.age);
      }
    }
  };
  </script>
  
  <style>
  /* Add any necessary styles here */
  </style>
  