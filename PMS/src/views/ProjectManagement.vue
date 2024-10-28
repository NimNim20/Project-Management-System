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

// Removed duplicate handleToggleComplete function

const handleDeleteProject = (id) => {
  deleteProject(id);
};

const handleToggleComplete = (projectId, task) => {
  let newStatus;
  if (task.status === 'not started') {
    newStatus = 'in progress';
  } else if (task.status === 'in progress') {
    newStatus = 'completed';
  } else {
    newStatus = 'not started';
  }
  updateTaskInProject(projectId, task.id, { status: newStatus });
};
</script>

<template>
  <header>
    <navbarComponent />
  </header>
  <div class="project-container">
    <h2>Project Management</h2>

    <!-- Add Project Form -->
    <form @submit.prevent="handleAddProject">
      <input v-model="newProjectName" type="text" placeholder="Add a new project" required />
      <button type="submit">Add Project</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <ul v-if="projects.length">
  <li v-for="project in projects" :key="project.id">
    <h3>{{ project.projectTitle }}</h3>
    <button @click="handleDeleteProject(project.id)">Delete Project</button>

    <!-- Task List for each project -->
    <div class="task-list">
      <h4>Not Started</h4>
      <ul>
        <li v-for="task in project.tasks.filter(task => task.status === 'not started')" :key="task.id">
          <input type="checkbox" :checked="task.status === 'completed'" @change="handleToggleComplete(project.id, task)" />
          <span>{{ task.taskTitle }} (Assigned to: {{ task.assignedTo }}, Priority: {{ task.priority }})</span>
        </li>
      </ul>

      <h4>In Progress</h4>
      <ul>
        <li v-for="task in project.tasks.filter(task => task.status === 'in progress')" :key="task.id">
          <input type="checkbox" :checked="task.status === 'completed'" @change="handleToggleComplete(project.id, task)" />
          <span>{{ task.taskTitle }} (Assigned to: {{ task.assignedTo }}, Priority: {{ task.priority }})</span>
        </li>
      </ul>

      <h4>Done</h4>
      <ul>
        <li v-for="task in project.tasks.filter(task => task.status === 'completed')" :key="task.id">
          <input type="checkbox" :checked="task.status === 'completed'" @change="handleToggleComplete(project.id, task)" />
          <span>{{ task.taskTitle }} (Assigned to: {{ task.assignedTo }}, Priority: {{ task.priority }})</span>
        </li>
      </ul>
    </div>

    <p v-if="project.tasks.length === 0">No tasks yet!</p>

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
</style>
