<script setup>
import { ref, onMounted } from 'vue'
import { useProjects } from '../modules/useProjects'

// Get methods and state from the useProjects composable
const { projects, error, fetchProjects, addProject, deleteProject, addTaskToProject, updateTaskInProject } = useProjects()

const newProjectName = ref('')
const newTask = ref({ text: '', assignedTo: '', priority: 'Normal', dueDate: '' })


// Fetch projects when the component is mounted
onMounted(() => {
  fetchProjects()
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

<script setup>
/* 
Week 35 Setup
setup firebase project
setup vue
npm install firebase + npm install firebase-tools
firebase login (in terminal)
open firebase console and "create a mew project" + "create new database"
Changed the rules so that the database is opened for longer 
Made placeholder collection (data)
Imported firebase  firebaseConfig (api key, and more) 
Imported Firebase functions (initializeApp, getFirestore, collection etc.)
Created input field to add a new movie - STEP 1
Created a list of movies - STEP 2
Created a reference to the movies collection in Firebase - STEP 2.5
Created a function to retrieve a new movie to the list - STEP 3
Created a function to add a new movie to the list - STEP 4
Created a function to delete a movie from the list - STEP 5
Installed dotenv and created a .env file with the firebaseConfig (Security)
*/
import { ref, onMounted } from 'vue'
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration (STEP FIREBASE)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Step 1 Create a new movie title and store it in a ref
const projectTitle = ref('')
// const projectDesc = ref('')

// Step 2 Create a list of movies and store it in a ref
const projects = ref([])

// Step 2.5 Create a reference to the movies collection in Firebase
const projectsFirebaseCollectionRef = 'projects'

const projectsCollection = collection(db, projectsFirebaseCollectionRef);
// Step 3 Create a function to retrieve a new movie to the list
onMounted (() => {
  onSnapshot(projectsCollection, (snapshot) => {
    projects.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() //Spread Operator
      // title: doc.data().title
    }))
  })
})

// Step 4 Create a function to add a new movie to the list
const addProject = async () => {
  if (projectTitle.value.trim() === '') return; // Checks to see if the input is empty, return (stops the function)
  
  await addDoc(projectsCollection, {
    title: projectTitle.value
  })

  projectTitle.value = ''
}

// Step 5: create a function to delete a movie from the list
const deleteProject = async (id) => {
  console.log("Deleting project with id: ", id)
  await deleteDoc(doc(db, projectsFirebaseCollectionRef, id))
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

</style>
