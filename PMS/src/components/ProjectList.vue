<script setup>

const props = defineProps({
  projects: {
    type: Array,
    default: () => [] 
  },
  selectedProjectId: {
    type: [Number, String],
    default: null
  }
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
    <ul v-if="props.projects.length > 0">
      <li v-for="project in props.projects" 
          :key="project.id" 
          :class="{ selected: project.id === props.selectedProjectId }"
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
  background-color: #000;
  margin-bottom: 5px;
  cursor: pointer;
}

.project-list li.selected {
  background-color: #00bcd4;
  color: white;
}
</style>
