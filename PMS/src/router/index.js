import { createRouter, createWebHistory } from 'vue-router'
import TodoView from '../views/ProjectManagement.vue'   
import Home from '../views/HomeView.vue'       
import Login from '../views/LoginView.vue'  
import About from '../views/AboutView.vue'                
import { auth } from '../modules/fbfile/firebase'     
import ProjectManagement from '../views/ProjectManagement.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectManagement,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  { 
    path: '/todos', 
    component: TodoView,
  },
]


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
