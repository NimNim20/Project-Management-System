import { ref, onMounted } from 'vue';
import { projectsList, projectsFirebaseListRef, db } from './firebase';
import { onSnapshot, addDoc, doc, deleteDoc, collection, updateDoc } from 'firebase/firestore';

export const useProjects = () => {
  const projects = ref([]);
  const newProjectTitle = ref('');
  const error = ref(null);

  // Add a new project
  const addProject = async (title) => {
    if (title.trim() === '') return;
    try {
      await addDoc(projectsList, {
        projectTitle: title,
        projectDesc: '',
        createdAt: new Date()
      });
      newProjectTitle.value = '';
    } catch (e) {
      console.error('Failed to add project:', e);
      error.value = 'Failed to add project';
    }
  };

  // Add a new task to a specific project
  const addTaskToProject = async (projectId, task) => {
    try {
      const taskCollectionRef = collection(db, projectsFirebaseListRef, projectId, 'taskHandling');
      await addDoc(taskCollectionRef, {
        taskTitle: task.text,
        assignedTo: task.assignedTo,
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: new Date(),
        status: 'not started'
      });
    } catch (e) {
      console.error('Failed to add task:', e);
      error.value = 'Failed to add task';
    }
  };

  // Toggle task completion or update other task fields
  const updateTaskInProject = async (projectId, taskId, updates) => {
    try {
      const taskDocRef = doc(db, projectsFirebaseListRef, projectId, 'taskHandling', taskId);
      await updateDoc(taskDocRef, updates);
    } catch (e) {
      console.error('Failed to update task:', e);
      error.value = 'Failed to update task';
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, projectsFirebaseListRef, id));
    } catch (e) {
      console.error('Failed to delete project:', e);
      error.value = 'Failed to delete project';
    }
  };

  // Fetch projects and their tasks
  onMounted(() => {
    // Listen to changes in the projects collection
    onSnapshot(projectsList, (snapshot) => {
      projects.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tasks: [] // Initialize tasks array for each project
      }));

      // Fetch tasks for each project
      projects.value.forEach(async (project) => {
        const taskHandlingRef = collection(db, projectsFirebaseListRef, project.id, 'taskHandling');
        
        // Listen to changes in the tasks subcollection of each project
        onSnapshot(taskHandlingRef, (taskSnapshot) => {
          project.tasks = taskSnapshot.docs.map(taskDoc => ({
            id: taskDoc.id,
            ...taskDoc.data()
          }));
        }, (error) => {
          console.error('Error fetching tasks:', error);
          error.value = 'Error fetching tasks';
        });
      });
    }, (error) => {
      console.error('Error fetching projects:', error);
      error.value = 'Error fetching projects';
    });
  });

  return { projects, newProjectTitle, addProject, deleteProject, addTaskToProject, updateTaskInProject, error };
};
