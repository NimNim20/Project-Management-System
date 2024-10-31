import { ref, onMounted, watch } from 'vue';
import { projectsList, projectsFirebaseListRef, db } from '../fbfile/firebase';
import { onSnapshot, addDoc, doc, deleteDoc, collection, updateDoc, where, query } from 'firebase/firestore';
import { useUsers } from '../user/useUsers';

export const useProjects = () => {
  const { user, isLoggedIn, isAdmin } = useUsers();
  const projects = ref([]);
  const newProjectTitle = ref('');
  const error = ref(null);

  const addProject = async (title) => {
    if (!user.value) {
      error.value = 'User is not logged in';
      return;
    }

    if (title.trim() === '') return;

    try {
      await addDoc(projectsList, {
        projectTitle: title,
        projectDesc: '',
        createdAt: new Date(),
        uid: user.value.uid
      });
      newProjectTitle.value = '';
    } catch (e) {
      console.error('Failed to add project:', e);
      error.value = 'Failed to add project';
    }
  };

  const addTaskToProject = async (projectId, task) => {
    if (!user.value) {
      error.value = 'User is not logged in';
      return;
    }

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

  const updateTaskInProject = async (projectId, taskId, updatedTask) => {
    if (!user.value) {
      error.value = 'User is not logged in';
      return;
    }

    const taskDocRef = doc(db, projectsFirebaseListRef, projectId, 'taskHandling', taskId);

    try {
      await updateDoc(taskDocRef, updatedTask);
    } catch (e) {
      console.error('Failed to update task:', e);
      error.value = 'Failed to update task';
    }
  };

  const deleteProject = async (id) => {
    if (!user.value) {
      error.value = 'User is not logged in';
      return;
    }

    try {
      await deleteDoc(doc(db, projectsFirebaseListRef, id));
    } catch (e) {
      console.error('Failed to delete project:', e);
      error.value = 'Failed to delete project';
    }
  };

  const deleteTaskFromProject = async (projectId, taskId) => {
    if (!user.value) {
      error.value = 'User is not logged in';
      return;
    }

    try {
      const taskDocRef = doc(db, projectsFirebaseListRef, projectId, 'taskHandling', taskId);
      await deleteDoc(taskDocRef);
      console.log(`Task ${taskId} deleted from project ${projectId}`);
    } catch (e) {
      console.error("Error deleting task: ", e);
      error.value = 'Error deleting task';
    }
  };

  // Fetching projects if loggedin
  watch(isLoggedIn, (loggedIn) => {
    if (!loggedIn || !user.value) {
      projects.value = [];
      return;
    }

    const userProjectsQuery = isAdmin.value
      ? projectsList // Administrator can see all the projects, currently no filtering or designation of who made it
      : query(projectsList, where('uid', '==', user.value.uid));

    onSnapshot(userProjectsQuery, (snapshot) => {
      projects.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tasks: []
      }));

      projects.value.forEach(async (project) => {
        const taskHandlingRef = collection(db, projectsFirebaseListRef, project.id, 'taskHandling');
        
        onSnapshot(taskHandlingRef, (taskSnapshot) => {
          project.tasks = taskSnapshot.docs.map(taskDoc => ({
            id: taskDoc.id,
            ...taskDoc.data()
          }));
        }, (e) => {
          console.error('Error fetching tasks:', e);
          error.value = 'Error fetching tasks';
        });
      });
    }, (e) => {
      console.error('Error fetching projects:', e);
      error.value = 'Error fetching projects';
    });
  });

  return { projects, newProjectTitle, addProject, deleteProject, addTaskToProject, updateTaskInProject, error, deleteTaskFromProject };
};
