<script setup>
import { ref, onMounted } from 'vue';
import { useProjects } from '../modules/useProjects';
import navbarComponent from '../components/NavComponent.vue';

const { projects, error, addProject, deleteProject, addTaskToProject, updateTaskInProject } = useProjects();

const newProjectName = ref('');
const newTask = ref({ text: '', assignedTo: '', priority: 'Normal', dueDate: '' });

// Fetch projects when the component is mounted
onMounted(() => {
  useProjects();
});

const handleAddProject = () => {
  if (newProjectName.value.trim()) {
    addProject(newProjectName.value.trim());
    newProjectName.value = ''; // Clear input after adding
  }
};

const handleAddTask = (projectId) => {
  if (newTask.value.text.trim()) {
    addTaskToProject(projectId, newTask.value);
    newTask.value = { text: '', assignedTo: '', priority: 'Normal', dueDate: '' }; // Clear task input
  }
};

const handleDeleteProject = (id) => {
  deleteProject(id);
};

const handleToggleComplete = (projectId, task, newStatus) => {
  updateTaskInProject(projectId, task.id, { status: newStatus });
};
</script>

<template>
  <header>
    <navbarComponent />
  </header>
  <div class="project-container">
    <h2 class="text-2xl text-orange-300 mb-3">Project Management</h2>

    <!-- Add Project Form -->
    <form @submit.prevent="handleAddProject">
      <input v-model="newProjectName" type="text" placeholder="Add a new project" required class="large-input" />
      <button type="submit" class="addProject">Add Project</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <ul v-if="projects.length">
      <li v-for="project in projects" :key="project.id">
        <h3>{{ project.projectTitle }}</h3>
        <button class="deleteProject" @click="handleDeleteProject(project.id)">Delete Project</button>

        <!-- Task List for each project -->
        <div class="task-list">
          <h4>Tasks</h4>
          <ul>
            <li v-for="task in project.tasks" :key="task.id" class="task-item">
              <span>{{ task.taskTitle }} (Assigned to: {{ task.assignedTo }}, Priority: {{ task.priority }})</span>
              <div class="status-buttons">
                <button 
                  class="task-button" 
                  :class="{ 'not-started': task.status === 'not started' }"
                  @click="handleToggleComplete(project.id, task, 'not started')">Not Started</button>
                <button 
                  class="task-button" 
                  :class="{ 'in-progress': task.status === 'in progress' }"
                  @click="handleToggleComplete(project.id, task, 'in progress')">In Progress</button>
                <button 
                  class="task-button" 
                  :class="{ 'completed': task.status === 'completed' }"
                  @click="handleToggleComplete(project.id, task, 'completed')">Completed</button>
              </div>
            </li>
          </ul>
        </div>

        <p v-if="project.tasks.length === 0">No tasks yet!</p>

        <!-- Add Task Form for each project -->
        <form class="taskForm" @submit.prevent="handleAddTask(project.id)">
          <input v-model="newTask.text" type="text" placeholder="Add a new task" required />
          <input v-model="newTask.assignedTo" type="text" placeholder="Assigned to" />
          <select class="taskPrio" v-model="newTask.priority">
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>
          <input v-model="newTask.dueDate" type="date" />
          <button class="addTask" type="submit">Add Task</button>
        </form>
      </li>
    </ul>
  </div>
</template>

<style>
.project-container {
  max-width: 800px;
  margin: auto;
}
.completed {
  text-decoration: line-through;
}
.error {
  color: red;
}

.task-list h4 {
  margin-top: 20px;
  font-size: 1.2em;
}

.task-list ul {
  list-style: none;
  padding: 0;
}

.task-list li {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

button, [role="button"] {
  cursor: pointer;
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 5px;
}

button, input, optgroup, select, textarea {
  font: inherit;
  margin: 0;
  border: 0;
  outline: 0;
  border-radius: 15px;
  text-align: center;
  color: black;
}

.large-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.addProject {
  color: white;
  background-color: #000000;
}

.deleteProject {
  color: white;
  background-color: #ff0000;
}

.taskForm {
  display: flex;
  margin-top: 20px;
  gap: 10px;
}

.addTask {
  color: white;
  background-color: #000000;
}

.taskPrio {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 15px;
  color: black;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}

.status-buttons {
  display: flex;
  gap: 5px;
}

.task-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.not-started {
  background-color: red; /* Red for not started */
  color: white;
}

.in-progress {
  background-color: yellow; /* Yellow for in progress */
  color: black;
}

.completed {
  background-color: green; /* Green for completed */
  color: white;
}

.task-button:hover {
  opacity: 0.8; /* Slightly dim on hover */
}
</style>
