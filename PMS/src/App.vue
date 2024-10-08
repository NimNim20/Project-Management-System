<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import { useUsers } from './modules/useUsers'
import ProjectList from './components/ProjectList.vue'
import ProjectDetails from './components/ProjectDetails.vue'
import { useProjects } from './modules/useProjects'

// User authentication composable
const { user, login, logout } = useUsers()

// Project management composable
const { projects, fetchProjects } = useProjects()
const selectedProjectId = ref(null)

// Fetch projects if user is logged in
const handleLogin = async () => {
  await login('admin@admin.com', 'admin1')
  if (user.value) {
    fetchProjects()  // Fetch projects after login
  }
}

const handleLogout = () => {
  logout()
  selectedProjectId.value = null  // Reset project selection on logout
}

// Handle selecting a project
const handleSelectProject = (projectId) => {
  selectedProjectId.value = projectId
}
</script>

<template>
  <div class="app-container">
    <header>
      <div class="wrapper">
        <div>
          <!-- Conditional login/logout buttons -->
          <button v-if="!user" @click="handleLogin">Log in</button>
          <button v-if="user" @click="handleLogout">Log out</button>
          <p v-if="user">Logged in as: {{ user.email }}</p>
        </div>
      </div>
    </header>

    <!-- Main Content: Show project management only if logged in -->
    <main v-if="user">
      <h1>Project Management System</h1>

      <div class="content">
        <!-- Project List Component -->
        <ProjectList 
          :projects="projects" 
          @selectProject="handleSelectProject" 
          :selectedProjectId="selectedProjectId" />

        <!-- Show Project Details only if a project is selected -->
        <div v-if="selectedProjectId">
          <ProjectDetails 
            :projectId="selectedProjectId" 
            :projects="projects" />
        </div>
        <div v-else>
          <p>Select a project to view details.</p>
        </div>
      </div>
    </main>

    <!-- If user is not logged in, display message -->
    <div v-else>
      <p>Please log in to access your projects.</p>
    </div>

    <!-- Vue Router View for other routes if needed -->
    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
}

.project-list {
  width: 35%;
  padding-right: 20px;
}

.project-details {
  width: 65%;
  border-left: 1px solid #ccc;
  padding-left: 20px;
}

button {
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #007a9b;
}

button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

p {
  margin-top: 1rem;
  font-size: 1.2rem;
}
</style>
