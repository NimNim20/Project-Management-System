import { createRouter, createWebHistory } from 'vue-router'
import TodoView from '../views/ProjectManagement.vue'   // Import To-Do page
import Home from '../views/HomeView.vue'                          
import { auth } from '../modules/firebase'     // Firebase authentication instance

// Define routes for your app
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  { 
    path: '/todos', 
    component: TodoView,
  },
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
