<script setup>
import { ref, onMounted } from 'vue'
import { useTodos } from '../modules/useTodos'

// Get methods and state from the useTodos composable
const { todos, error, fetchTodos, addTodo, deleteTodo, updateTodo } = useTodos()

const newTask = ref('')

// Fetch todos when the component is mounted
onMounted(() => {
  fetchTodos()
})

// Handle adding a new task
const handleAddTodo = () => {
  if (newTask.value.trim()) {
    addTodo(newTask.value.trim())
    newTask.value = '' // Clear input after adding
  }
}

// Handle toggling task completion
const handleToggleComplete = (todo) => {
  updateTodo(todo.id, { completed: !todo.completed })
}

// Handle deleting a task
const handleDeleteTodo = (id) => {
  deleteTodo(id)
}
</script>

<template>
  <div class="todo-container">
    <h2>My To-Do List</h2>

    <form @submit.prevent="handleAddTodo">
      <input v-model="newTask" type="text" placeholder="Add a new task" required />
      <button type="submit">Add Task</button>
    </form>

    <!-- Show error if there's one -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Show the list of tasks -->
    <ul v-if="todos.length">
      <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.completed }">
        <input type="checkbox" :checked="todo.completed" @change="handleToggleComplete(todo)" />
        <span>{{ todo.text }}</span>
        <button @click="handleDeleteTodo(todo.id)">Delete</button>
      </li>
    </ul>

    <p v-else>No tasks yet!</p>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f9f9f9;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.completed span {
  text-decoration: line-through;
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}
</style>
