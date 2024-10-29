<template>
  <main>
    <NavComponent />

    <h1>Welcome to PMS - Project Management System</h1>




  </main>
</template>


<script setup>
import NavComponent from '../components/NavComponent.vue';

</script>

<style scoped>

.articleTitle{
  font-size: 2rem;
  font-weight: 700;
}

.aboutMakers{
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 5px;
}
.articleTitle {
  transition: background-image 1.5s ease-in-out;
}

.articleTitle:hover {
  background-image: linear-gradient(90deg, #f6b93b, #b71540);
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
</style>