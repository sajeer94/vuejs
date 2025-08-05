import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
// Layouts
import MainLayout from '../components/Layout/Mainlayout.vue'
import AuthLayout from '../components/Layout/AuthLayout.vue'

// Pages
import Login from '../components/Layout/AuthLayout.vue'
import Home from '../page/Home.vue'
import About from '../page/About.vue'
import Employee from '../page/Employee.vue'
import NotFound from '../components/NotFound.vue'

const routes = [
  {
    path: '/',
    redirect: '/auth/login' 
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true }, 
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home
      },
      {
        path: 'about',
        name: 'about',
        component: About
      },
      {
        path: 'employee',
        name: 'employee',
        component: Employee
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const accessToken = Cookies.get('access_token')

  if (requiresAuth && !accessToken) {
    next({ path: '/' }) 
  } else if (to.name === 'Login' && accessToken) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
