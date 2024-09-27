import { ref } from 'vue'
import { db } from './firebase' // Firebase setup should have Firestore initialized
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore'
import { useUsers } from './useUsers' // Import to get the logged-in user

export const useTodos = () => {
  const { user } = useUsers() // Get the logged-in user
  const todos = ref([])
  const error = ref(null)

  // Fetch todos for the logged-in user
  const fetchTodos = () => {
    if (!user.value) return

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.value.uid)
    )
    
    onSnapshot(q, (snapshot) => {
      todos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }, (err) => {
      error.value = err.message
    })
  }

  // Add a new to-do
  const addTodo = async (text) => {
    try {
      await addDoc(collection(db, 'todos'), {
        text,
        userId: user.value.uid,
        completed: false,
        createdAt: new Date()
      })
    } catch (err) {
      error.value = err.message
    }
  }

  // Delete a to-do
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id))
    } catch (err) {
      error.value = err.message
    }
  }

  // Update a to-do
  const updateTodo = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, 'todos', id), updatedData)
    } catch (err) {
      error.value = err.message
    }
  }

  return {
    todos,
    error,
    fetchTodos,
    addTodo,
    deleteTodo,
    updateTodo
  }
}
