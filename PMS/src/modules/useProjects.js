// useProjects.js
import { ref, onMounted } from 'vue';
import { projectsList, projectsFirebaseListRef, db } from './firebase';
import { onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

export const useProjects = () => {

  const newProjectTitle = ref('');

  const projects = ref([]);

  onMounted(() => {
    onSnapshot(projectsList, (snapshot) => {
      projects.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() // spread operator        
      }))
    })
  })

  const addProject = async () => {
    if (newProjectTitle.value.trim() === '') return
    try {
      await addDoc(projectsList, {
        title: newProjectTitle.value,
        description: ''
      })

      newProjectTitle.value = ''
    } catch (error) {
      error.value = 'Failed to add project'
    }
  }

  const deleteProject = async (id) => {
    console.log("deleting project with id: ", id)
    await deleteDoc(doc(db, projectsFirebaseListRef, id))
  } 



return { projects, newProjectTitle, addProject, deleteProject }
}
  // Add task to a project
  // const addTaskToProject = (projectId, task) => {
  //   const project = projects.value.find(project => project.id === projectId)
  //   if (project) {
  //     project.tasks.push({
  //       id: Date.now(),
  //       text: task.text,
  //       assignedTo: task.assignedTo || null,
  //       priority: task.priority || 'Normal',
  //       dueDate: task.dueDate || null,
  //       completed: false
  //     })
  //   }
  // }

  // Update task in a project
  // const updateTaskInProject = (projectId, taskId, updatedTask) => {
  //   const project = projects.value.find(project => project.id === projectId)
  //   if (project) {
  //     const task = project.tasks.find(task => task.id === taskId)
  //     if (task) {
  //       Object.assign(task, updatedTask)
  //     }
  //   }
  // }

