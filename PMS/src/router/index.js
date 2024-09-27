import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue' // Import Login page
import TodoView from '../views/TodoView.vue'   // Import To-Do page
import { auth } from '../modules/firebase'     // Firebase authentication instance

// Define routes for your app
const routes = [
  { path: '/', component: LoginView },        
  { path: '/todos', component: TodoView }    
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect the '/todos' route
router.beforeEach((to, from, next) => {
  const user = auth.currentUser 

  if (to.path === '/todos' && !user) {
    next('/') 
  } else {
    next()    
  }
})

export default router
