// useProjects.js
import { ref, onMounted } from 'vue';
import { moviesCollection, moviesFirebaseCollectionRef, db } from './firebase';
import { onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

// export function useProjects() {
//   const projects = ref([])
//   const error = ref(null)

export const useProjects = () => {

}

  // Fetch projects
  const fetchProjects = async () => {
    try {
      // Simulate API call
      projects.value = [
        { id: 1, name: 'Project Alpha', tasks: [] },
        { id: 2, name: 'Project Beta', tasks: [] }
      ]
    } catch (err) {
      error.value = 'Failed to fetch projects.'
    }
  }

  // Add project
  const addProject = (name) => {
    projects.value.push({
      id: Date.now(),
      name,
      tasks: []
    })
  }

  // Delete project
  const deleteProject = (id) => {
    projects.value = projects.value.filter(project => project.id !== id)
  }

  // Add task to a project
  const addTaskToProject = (projectId, task) => {
    const project = projects.value.find(project => project.id === projectId)
    if (project) {
      project.tasks.push({
        id: Date.now(),
        text: task.text,
        assignedTo: task.assignedTo || null,
        priority: task.priority || 'Normal',
        dueDate: task.dueDate || null,
        completed: false
      })
    }
  }

  // Update task in a project
  const updateTaskInProject = (projectId, taskId, updatedTask) => {
    const project = projects.value.find(project => project.id === projectId)
    if (project) {
      const task = project.tasks.find(task => task.id === taskId)
      if (task) {
        Object.assign(task, updatedTask)
      }
    }
  }

  return { projects, error, fetchProjects, addProject, deleteProject, addTaskToProject, updateTaskInProject }
}
