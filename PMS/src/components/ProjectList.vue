<script setup>
import { ref } from 'vue'

const { projects, selectedProjectId } = defineProps({
  projects: Array,
  selectedProjectId: [Number, String]
})

const emit = defineEmits(['selectProject'])

const handleProjectClick = (id) => {
  emit('selectProject', id)
}
</script>

<template>
  <div class="project-list">
    <h2>Projects</h2>

    <!-- Show the list of projects -->
    <ul v-if="projects.length">
      <li v-for="project in projects" 
          :key="project.id" 
          :class="{ selected: project.id === selectedProjectId }"
          @click="handleProjectClick(project.id)">
        {{ project.name }}
      </li>
    </ul>

    <p v-else>No projects available</p>
  </div>
</template>

<style scoped>
.project-list ul {
  list-style-type: none;
  padding: 0;
}

.project-list li {
  padding: 10px;
  background-color: #f0f0f0;
  margin-bottom: 5px;
  cursor: pointer;
}

.project-list li.selected {
  background-color: #00bcd4;
  color: white;
}
</style>
