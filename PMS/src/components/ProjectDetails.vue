<script setup>
import { ref, watch } from 'vue'
import { useProjects } from '../modules/useProjects'

const props = defineProps({
  projectId: [Number, String],
  projects: Array
})

const { addTaskToProject, updateTaskInProject } = useProjects()

const newTask = ref({
  text: '',
  assignedTo: '',
  priority: '',
  dueDate: ''
})

const selectedProject = ref(null)

// Watch for changes in the projectId to update the selected project
watch(() => props.projectId, (newVal) => {
  selectedProject.value = props.projects.find(project => project.id === newVal)
})

// Handle adding a task to the selected project
const handleAddTask = () => {
  if (newTask.value.text.trim()) {
    addTaskToProject(selectedProject.value.id, newTask.value)
    newTask.value = { text: '', assignedTo: '', priority: '', dueDate: '' } // Clear task input
  }
}

// Handle task completion toggle
const handleToggleComplete = (task) => {
  updateTaskInProject(selectedProject.value.id, task.id, { completed: !task.completed })
}
</script>

<template>
  <div class="project-details">
    <h2>{{ selectedProject?.name }} - Tasks</h2>

    <!-- Task List for the selected project -->
    <ul v-if="selectedProject?.tasks.length">
      <li v-for="task in selectedProject.tasks" :key="task.id" :class="{ completed: task.completed }">
        <input type="checkbox" :checked="task.completed" @change="handleToggleComplete(task)" />
        <span>{{ task.text }} (Assigned to: {{ task.assignedTo }}, Priority: {{ task.priority }})</span>
      </li>
    </ul>
    <p v-else>No tasks yet for this project!</p>

    <!-- Add New Task -->
    <h3>Add New Task</h3>
    <form @submit.prevent="handleAddTask">
      <input v-model="newTask.text" type="text" placeholder="Task description" required />
      <input v-model="newTask.assignedTo" type="text" placeholder="Assigned to" />
      <select v-model="newTask.priority">
        <option>Low</option>
        <option>Normal</option>
        <option>High</option>
      </select>
      <input v-model="newTask.dueDate" type="date" />
      <button type="submit">Add Task</button>
    </form>
  </div>
</template>

<style scoped>
.project-details {
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.completed span {
  text-decoration: line-through;
}
</style>
