<template>
  <main>
    <NavComponent />

    <h1>Welcome to PMS - Project Management System</h1>

    <section>
      <h2 class="articleTitle">Makers of the website</h2>
      <article class="aboutMakers">
        We are two students, Simon & Benjamin, who decided to take on a challenge for our Adv. JavaScript class.
        We are two passionate students who are eager to learn and grow in the field of web development.
      </article>

    </section>
  </main>
</template>


<script setup>
import NavComponent from '../components/NavComponent.vue';

</script>

<style scoped>

.articleTitle{
  font-size: 2rem;
  font-weight: 700;
  margin: 1rem;
}

.aboutMakers{
  font-size: 1.2rem;
  font-weight: 500;
  margin: 1rem;
  padding: 1rem;
  border-radius: 5px;
}

</style>