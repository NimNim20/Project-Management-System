<script setup>
import NavComponent from '@/components/NavComponent.vue';
</script>

<template>
  <NavComponent />

  <section class="makers-section">
    <h2 class="section-title">Meet the Makers</h2>
    <article class="makers-description">
      <p class="intro">
        We are <strong>Simon</strong> and <strong>Benjamin</strong>, two driven students tackling a project for our Advanced JavaScript class.
      </p>
      <p class="mission">
        Our goal is to grow and learn in the field of web development while creating something valuable and impactful.
      </p>
    </article>
  </section>
</template>

<style scoped>
.makers-section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #1c1f26; 
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.makers-section:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(131, 131, 131, 0.2); 
}


.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f4f4f9;
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
}


.section-title::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background-color: #ff6b6b; 
  margin: 0.5rem auto 0;
}

.makers-description {
  text-align: center;
  color: #d1d5db;
  font-size: 1.1rem;
  line-height: 1.6;
}

.intro strong {
  color: #ff6b6b;
}

.section-title:hover {
  color: #ff6b6b;
  transition: color 0.3s ease;
}

.mission {
  margin-top: 0.8rem;
  color: #e5e7eb;
}
</style>