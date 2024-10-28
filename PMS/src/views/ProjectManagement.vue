<script setup>
import { ref, onMounted } from 'vue'
import { useProjects } from '../modules/useProjects'

// Get methods and state from the useProjects composable
const { projects, error, addProject, deleteProject, addTaskToProject, updateTaskInProject } = useProjects()

const newProjectName = ref('')
const newTask = ref({ text: '', assignedTo: '', priority: 'Normal', dueDate: '' })


// Fetch projects when the component is mounted
onMounted(() => {
  useProjects()
})

// Handle adding a new project
const handleAddProject = () => {
  if (newProjectName.value.trim()) {
    addProject(newProjectName.value.trim())
    newProjectName.value = '' // Clear input after adding
  }
}

// Handle adding a task to a selected project
const handleAddTask = (projectId) => {
  if (newTask.value.text.trim()) {
    addTaskToProject(projectId, newTask.value)
    newTask.value = { text: '', assignedTo: '', priority: 'Normal', dueDate: '' } // Clear task input
  }
}

// Handle toggling task completion
const handleToggleComplete = (projectId, task) => {
  updateTaskInProject(projectId, task.id, { completed: !task.completed })
}

// Handle deleting a project
const handleDeleteProject = (id) => {
  deleteProject(id)
}
</script>

<template>
  <div class="project-container">
    <h2>Project Management</h2>

    <!-- Add Project Form -->
    <form @submit.prevent="handleAddProject">
      <input v-model="newProjectName" type="text" placeholder="Add a new project" required />
      <button type="submit">Add Project</button>
    </form>

    <!-- Show error if there's one -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Show list of projects -->
    <ul v-if="projects.length">
      <li v-for="project in projects" :key="project.id">
        <h3>{{ project.name }}</h3>
        <button @click="handleDeleteProject(project.id)">Delete Project</button>

        <!-- Task List for each project -->
        <ul v-if="project.tasks.length">
          <li v-for="task in project.tasks" :key="task.id" :class="{ completed: task.completed }">
            <input type="checkbox" :checked="task.completed" @change="handleToggleComplete(project.id, task)" />
            <span>{{ task.text }} (Assigned to: {{ task.assignedTo }}, Priority: {{ task.priority }})</span>
          </li>
        </ul>

        <p v-else>No tasks yet!</p>

        <!-- Add Task Form for each project -->
        <form @submit.prevent="handleAddTask(project.id)">
          <input v-model="newTask.text" type="text" placeholder="Add a new task" required />
          <input v-model="newTask.assignedTo" type="text" placeholder="Assigned to" />
          <select v-model="newTask.priority">
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>
          <input v-model="newTask.dueDate" type="date" />
          <button type="submit">Add Task</button>
        </form>
      </li>
    </ul>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

</style>
