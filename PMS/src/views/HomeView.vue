<template>
  <main>
    <NavComponent />

    <h1>Welcome to PMS - Project Management System</h1>

    <section>
      <h2 class="articleTitle text-center text-2xl font-bold mb-4">Makers of the Website</h2>
        <article class="aboutMakers text-center">
          <span class="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent text-3xl font-semibold">
             We are two students, Simon & Benjamin, who decided to take on a challenge for our Adv. JavaScript class.
          </span>
            <br />
              <span class="text-white text-lg">We are two passionate students who are eager to learn and grow in the field of web development.</span>
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
}

.aboutMakers{
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 5px;
}
.articleTitle span {
  transition: background-position 0.3s ease-in-out;
}

.articleTitle span:hover {
  background-size: 200% 100%;
  background-position: right center;
}
</style>