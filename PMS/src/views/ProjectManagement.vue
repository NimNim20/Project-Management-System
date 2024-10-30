<script setup>
import { ref, onMounted } from 'vue';
import { useProjects } from '../modules/useProjects';
import navbarComponent from '../components/NavComponent.vue';

const { projects, error, addProject, addTaskToProject, updateTaskInProject } = useProjects();

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

const handleToggleComplete = (projectId, task, newStatus) => {
  updateTaskInProject(projectId, task.id, { status: newStatus });
};

const isEditing = ref(false); // Track if we are in edit mode
const editingTask = ref(null); // Store the task being edited

// Start editing a task
const startEditingTask = (task, projectId) => {
  isEditing.value = true;
  editingTask.value = { ...task, projectId }; // Include projectId for conditional check
};


// Save edited task

const handleSaveTask = async () => {
  if (editingTask.value) {
    const updatedTask = {
      taskTitle: editingTask.value.taskTitle,
      assignedTo: editingTask.value.assignedTo,
      priority: editingTask.value.priority,
      dueDate: editingTask.value.dueDate,
      status: editingTask.value.status
    };
    try {
      await updateTaskInProject(String(editingTask.value.projectId), String(editingTask.value.id), updatedTask);
      // Optionally refetch projects or update local state here
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      isEditing.value = false;
      editingTask.value = null;
    }
  }
};



// Cancel editing
const cancelEditing = () => {
  isEditing.value = false;
  editingTask.value = null;
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

                  <button class="edit-task" @click="startEditingTask(task, project.id)">Edit</button>
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

        <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 class="text-lg font-semibold mb-4 text-gray-700">Edit Task</h3>
            <form @submit.prevent="handleSaveTask" class="space-y-4">
              <input v-model="editingTask.taskTitle" type="text" placeholder="Edit task name" required
                    class="taskEdit w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none" />
              <input v-model="editingTask.assignedTo" type="text" placeholder="Edit assigned to"
                    class="taskEdit w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none" />
              <select v-model="editingTask.priority"
                      class="taskEdit w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none">
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
              </select>
              <input v-model="editingTask.dueDate" type="date"
                    class="taskEdit w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none" />
              <button type="submit" class="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600">Save Task</button>
              <button type="button" @click="cancelEditing" class="w-full py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400">Cancel</button>
            </form>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>
.project-container {
  max-width: 800px;
  margin: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
}

.taskEdit{
  border: 2px solid #ccc;
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
