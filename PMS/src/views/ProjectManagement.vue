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
          <h1 class="text-4xl font-bold">Tasks</h1>
          <div class="grid-container">
            <div class="grid-item">
              <h5 class="status-title">Not Started</h5>
              <ul>
                <li v-for="task in sortedTasks(project.tasks, 'not started')" :key="task.id" class="task-item">
                  <div class="block max-w-sm p-6 bg- border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                      {{ task.taskTitle }}
                    </h5>
                    <p class="taskDesc font-normal text-sm text-gray-700">
                      Assigned to: {{ task.assignedTo }}, Priority: {{ task.priority }}<br />
                      Due Date: {{ task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A' }}
                    </p>
                    <div class="status-buttons mt-4">
                      <select v-model="task.status" @change="handleToggleComplete(project.id, task, task.status)">
                        <option value="not started">Not Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div class="status-indicator not-started"></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div class="grid-item">
              <h5 class="status-title">In Progress</h5>
              <ul>
                <li v-for="task in sortedTasks(project.tasks, 'in progress')" :key="task.id" class="task-item">
                  <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                      {{ task.taskTitle }}
                    </h5>
                    <p class="taskDesc font-normal text-sm text-gray-700">
                      Assigned to: {{ task.assignedTo }}, Priority: {{ task.priority }}<br />
                      Due Date: {{ task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A' }}
                    </p>
                    <div class="status-buttons mt-4">
                      <select v-model="task.status" @change="handleToggleComplete(project.id, task, task.status)">
                        <option value="not started">Not Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div class="status-indicator in-progress"></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div class="grid-item">
              <h5 class="status-title">Completed</h5>
              <ul>
                <li v-for="task in sortedTasks(project.tasks, 'completed')" :key="task.id" class="task-item">
                  <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                      {{ task.taskTitle }}
                    </h5>
                    <p class="taskDesc font-normal text-sm text-gray-700">
                      Assigned to: {{ task.assignedTo }}, Priority: {{ task.priority }}<br />
                      Due Date: {{ task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A' }}
                    </p>
                    <div class="status-buttons mt-4">
                      <select v-model="task.status" @change="handleToggleComplete(project.id, task, task.status)">
                        <option value="not started">Not Started</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div class="status-indicator completed"></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p v-if="project.tasks.length === 0">No tasks yet!</p>

        <!-- Add Task Form for each project -->
        <form class="taskForm" @submit.prevent="handleAddTask(project.id)">
          <input v-model="newTask.text" type="text" placeholder="Add a new task" required />
          <input v-model="newTask.assignedTo" type="text" placeholder="Assigned to" />
          <select class="taskPrio" v-model="newTask.priority">
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
          <input v-model="newTask.dueDate" type="date" />
          <button class="addTask" type="submit">Add Task</button>
        </form>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProjects } from '../modules/useProjects';
import navbarComponent from '../components/NavComponent.vue';

const { projects, error, addProject, deleteProject, addTaskToProject, updateTaskInProject } = useProjects();

const newProjectName = ref('');
const newTask = ref({ text: '', assignedTo: '', priority: 'Normal', dueDate: '' });

onMounted(() => {
  useProjects();
});

const handleAddProject = () => {
  if (newProjectName.value.trim()) {
    addProject(newProjectName.value.trim());
    newProjectName.value = '';
  }
};

const handleAddTask = (projectId) => {
  if (newTask.value.text.trim()) {
    addTaskToProject(projectId, newTask.value);
    newTask.value = { text: '', assignedTo: '', priority: 'Normal', dueDate: '' };
  }
};

const handleDeleteProject = (id) => {
  deleteProject(id);
};

const handleToggleComplete = (projectId, task, newStatus) => {
  updateTaskInProject(projectId, task.id, { status: newStatus });
};

// Function to sort tasks by priority
const sortedTasks = (tasks, status) => {
  return tasks
    .filter(task => task.status === status)
    .sort((a, b) => {
      const priorityOrder = { High: 1, Normal: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
};
</script>

<style>
.project-container {
  max-width: 1000px;
  gap: 50px;
  margin: auto;
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
  margin-top: 10px;
}

.taskForm input {
  margin-right: 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
}

.grid-item {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  position: relative;
}

.status-title {
  margin-bottom: 8px;
  font-size: 1.5em;
  text-align: center;
  color: black;
}

.task-item {
  padding: 10px;
}

/* Status Indicator Circle Styles */
.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 50px;
  display: inline-block;
}

/* Status Indicator Colors */
.status-indicator.not-started {
  background-color: red;
}

.status-indicator.in-progress {
  background-color: yellow;
}

.status-indicator.completed {
  background-color: green;
}

/* Dropdown Styles */
select {
  appearance: none;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 1em;
  color: #333;
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s;
}

select:hover {
  border-color: #007BFF;
}

select:focus {
  border-color: #0056b3;
}

.taskDesc {
  max-width: 140px;
}
</style>
