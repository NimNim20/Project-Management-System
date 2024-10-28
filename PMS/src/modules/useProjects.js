import { ref, onMounted } from 'vue';
import { projectsList, projectsFirebaseListRef, db } from './firebase';
import { onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

export const useProjects = () => {
  const newProjectTitle = ref('');
  const projects = ref([]);

  const addProject = async () => {
    if (newProjectTitle.value.trim() === '') return;
    try {
      await addDoc(projectsList, {
        title: newProjectTitle.value,
        description: ''
      });
      newProjectTitle.value = '';
    } catch (error) {
      console.error('Failed to add project', error);
    }
  };

  const deleteProject = async (id) => {
    console.log("deleting project with id: ", id);
    await deleteDoc(doc(db, projectsFirebaseListRef, id));
  };

  return { projects, newProjectTitle, addProject, deleteProject };
};

// In your Vue component
export default {
  setup() {
    const { projects, newProjectTitle, addProject, deleteProject } = useProjects();

    onMounted(() => {
      onSnapshot(projectsList, (snapshot) => {
        projects.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() // spread operator        
        }));
      }, (error) => {
        console.error("Error in snapshot listener: ", error);
      });
    });

    return { projects, newProjectTitle, addProject, deleteProject };
  }
};
