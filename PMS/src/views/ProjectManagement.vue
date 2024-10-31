<script setup>
import { ref, onMounted } from 'vue';
import { useProjects } from '../modules/useProjects';
import navbarComponent from '../components/NavComponent.vue';

const { projects, error, addProject, addTaskToProject, updateTaskInProject, deleteProject, deleteTaskFromProject } = useProjects();

const newProjectName = ref('');
const newTask = ref({ text: '', assignedTo: '', status: '', priority: 'Normal', dueDate: '' });

// Modal states
const isModalVisible = ref(false);
const isAddTaskModalVisible = ref(false);
const confirmedProjectId = ref(null);
const confirmedProjectTitle = ref(''); // New ref for project title

// Task modal states
const isTaskModalVisible = ref(false);
const confirmedTaskId = ref(null);
const confirmedTaskProjectId = ref(null);
const confirmedTaskTitle = ref('');

onMounted(() => {
  useProjects();
});

const isAddingProject = ref(false);

const handleAddProject = () => {
  if (newProjectName.value.trim()) {
    addProject(newProjectName.value.trim());
    newProjectName.value = '';
    isAddingProject.value = false; // Close input after adding
  }
};


// Show confirmation modal
const confirmDelete = (id, title) => {
  confirmedProjectId.value = id;
  confirmedProjectTitle.value = title;
  isModalVisible.value = true;
};

// Delete project after confirmation
const handleDeleteProject = (id) => {
  deleteProject(id);
  closeModal(); 
};

// Show confirmation modal for task deletion
const confirmDeleteTask = (task, projectId, title) => {
  confirmedTaskId.value = task.id;
  confirmedTaskProjectId.value = projectId;
  confirmedTaskTitle.value = title;
  isTaskModalVisible.value = true;
};

// Delete task after confirmation
const handleDeleteTask = () => {
  deleteTaskFromProject(confirmedTaskProjectId.value, confirmedTaskId.value);
  closeTaskModal();
};


// Close modal
const closeModal = () => {
  isModalVisible.value = false;
  confirmedProjectId.value = null;
  confirmedProjectTitle.value = '';
};

// Open Add Task Modal
const openAddTaskModal = (projectId) => {
  confirmedProjectId.value = projectId; // Set the project ID for the task
  isAddTaskModalVisible.value = true; // Show add task modal
};

// Close Add Task Modal
const closeAddTaskModal = () => {
  isAddTaskModalVisible.value = false; // Hide modal
  confirmedProjectId.value = null; // Reset project ID
};

const closeTaskModal = () => {
  isTaskModalVisible.value = false;
  confirmedTaskId.value = null;
  confirmedTaskProjectId.value = null;
  confirmedTaskTitle.value = '';
};


const handleAddTask = (projectId) => {
  if (newTask.value.text.trim()) {
    addTaskToProject(projectId, newTask.value);
    newTask.value = { text: '', assignedTo: '', priority: 'Normal', dueDate: '' };
    closeAddTaskModal(); // Close modal after adding task
  }
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

const isProjectModalVisible = ref(false);

const openProjectModal = () => {
  isProjectModalVisible.value = true;
};

const closeProjectModal = () => {
  isProjectModalVisible.value = false;
};
</script>

<template>
  <header>
    <navbarComponent />
  </header>

  <div class="project-container">
    <h2 class="text-2xl text-orange-300 mb-3">Project Management</h2>

    <button @click="openProjectModal" class="add-project-btn">Add Project</button>

<!-- Modal for adding a project -->
<div v-if="isProjectModalVisible" class="modal2">
  <div class="modal-content2">
    <span class="close2" @click="closeProjectModal">&times;</span>
    <h2>Add New Project</h2>
    <form @submit.prevent="handleAddProject">
      <input v-model="newProjectName" type="text" placeholder="Project Name" required class="large-input" />
      <button type="submit" class="greenBtn2">Add</button>
    </form>
  </div>
</div>


    <p v-if="error" class="error">{{ error }}</p>

    <ul v-if="projects.length">
      <li v-for="project in projects" :key="project.id">
        <h3 class="flex justify-center text-4xl font-bold text-emerald-500">{{ project.projectTitle }}</h3>
        <button class="deleteProject" @click="confirmDelete(project.id, project.projectTitle)">Delete Project</button>
        <button class="addTaskBtn" @click="openAddTaskModal(project.id)">Add a new task!</button>

        <div v-if="isAddTaskModalVisible" class="modal2">
          <div class="modal-content2">
            <span class="close2" @click="closeAddTaskModal">&times;</span>
            <h2>Add New Task</h2>
            <form @submit.prevent="handleAddTask(confirmedProjectId)">
              <input v-model="newTask.text" type="text" placeholder="Task Name" required />
              <input v-model="newTask.assignedTo" type="text" placeholder="Assigned To" />
              <select v-model="newTask.priority">
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
              <input v-model="newTask.dueDate" type="date" />
              <button type="submit" class="greenBtn2">Add Task</button>
            </form>
          </div>
        </div>

        <!-- Task List for each project -->
        <div class="task-list">
          <h1 class="text-4xl font-bold">Tasks</h1>
          <div class="grid-container">
            <div class="grid-item">
              <h5 class="status-title">Not Started</h5>
              <ul>
                <li v-for="task in sortedTasks(project.tasks, 'not started')" :key="task.id" class="task-item">
                  <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
                      {{ task.taskTitle }}
                    </h5>
                    <p class="taskDesc font-normal text-sm text-white">
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
                    <button class="edit-task" @click="startEditingTask(task, project.id)">Edit</button>
                    <button class="delete-task" @click="confirmDeleteTask(task, project.id, task.taskTitle)">Delete</button>
                  </div>
                </li>
              </ul>
            </div>

            <div class="grid-item">
              <h5 class="status-title">In Progress</h5>
              <ul>
                <li v-for="task in sortedTasks(project.tasks, 'in progress')" :key="task.id" class="task-item">
                  <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
                      {{ task.taskTitle }}
                    </h5>
                    <p class="taskDesc font-normal text-sm text-white">
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
                    <button class="edit-task" @click="startEditingTask(task, project.id)">Edit</button>
                    <button class="delete-task" @click="confirmDeleteTask(task, project.id, task.taskTitle)">Delete</button>
                  </div>
                </li>
              </ul>
            </div>

            <div class="grid-item">
              <h5 class="status-title">Completed</h5>
              <ul>
                <li v-for="task in sortedTasks(project.tasks, 'completed')" :key="task.id" class="task-item">
                  <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
                      {{ task.taskTitle }}
                    </h5>
                    <p class="taskDesc font-normal text-sm text-white">
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
                    <button class="edit-task" @click="startEditingTask(task, project.id)">Edit</button>
                    <button class="delete-task" @click="confirmDeleteTask(task, project.id, task.taskTitle)">Delete</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p v-if="project.tasks.length === 0">No tasks yet!</p>
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

    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2 class="text-neutral-950">Are you sure you want to delete the project "{{ confirmedProjectTitle }}"?</h2>
        <p class="text-neutral-950">This action cannot be undone.</p>
        <div class="confirmButtons">
        <button class="greenBtn text-emerald-400" @click="handleDeleteProject(confirmedProjectId)">Yes</button>
        <button class="redBtn text-rose-600" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="isTaskModalVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeTaskModal">&times;</span>
      <h2 class="text-neutral-950">Are you sure you want to delete this task "{{ confirmedTaskTitle }}"?</h2>
      <p class="text-neutral-950">This action cannot be undone.</p>
      <div class="confirmButtons">
        <button class="greenBtn text-emerald-400" @click="handleDeleteTask">Yes</button>
        <button class="redBtn text-rose-600" @click="closeTaskModal">Cancel</button>
      </div>
    </div>
  </div>
  </div>
</template>


<style>

.add-project-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  background-color: #4CAF50;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-project-btn:hover {
  background-color: #45a049;
}

.modal2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease; 
  z-index: 1000;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.confirmButtons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}

.modal-content2 {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
}
.close2 {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  font-weight: bold;
  color: #555;
  cursor: pointer;
  transition: color 0.2s;
}

.close2:hover {
  color: #333;
}
.modal-content2 h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}


.modal-content2 form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


.modal-content2 input,
.modal-content2 select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.modal-content2 input:focus,
.modal-content2 select:focus {
  outline: none;
  border-color: #4CAF50; 
}

.modal-content2 .greenBtn2,
.modal-content2 .redBtn2 {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-content2 .greenBtn2 {
  background-color: #4CAF50;
  color: #fff;
}

.modal-content2 .greenBtn2:hover {
  background-color: #45a049;
}

.modal-content2 .redBtn2 {
  background-color: #f44336;
  color: #fff;
}

.modal-content2 .redBtn2:hover {
  background-color: #d32f2f;
}


.modal-content2 .button-group2 {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.addTaskBtn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 10px;
}

.addTaskBtn:hover {
  background-color: #45a049;
}

.greenBtn {
  background-color: #08925f;
  color: white;
  transition: background-color 0.3s;
}

.greenBtn:hover {
  background-color: #10B981;
}


.redBtn {
  background-color: #703834;
  color: white;
  transition: background-color 0.3s;
}

.redBtn:hover {
  background-color: #ff0000;
}

.project-container {
  max-width: 1000px;
  gap: 50px;
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


.taskEdit{
  border: 2px solid #ccc;
}

.edit-task {
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin-top: 10px;
}

.delete-task {
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin-top: 10px;
  margin-left: 5px;
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
  background-color: #f44336; /* Red */
}

 .modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}  

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: center;
  position: relative;
}

.close {
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 1.5rem;
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
