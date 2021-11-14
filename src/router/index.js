import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Login from '../views/Login'
import Register from '../views/Register'
import Dashboard from '../views/Dashboard'
import About from '../views/About'
import PageNotFound from '../views/PageNotFound'
import store from '../store'

Vue.use(VueRouter)

const routes = [
    {
        path: '/home',
        name: 'home',
        component: Home 
    },
    {
        path: '/login',
        name: 'login',
        component: Login 
    },
    {
        path: '/register',
        name: 'register',
        component: Register 
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        beforeEnter: (to, from, next) => {
            if (!store.getters['auth/isAuthenticated']) {
                return next({
                    name: 'login'
                })
            }
            next()
        }
    },
    {
      path: '/about',
      name: 'about',
      component: About 
  },
    {
        path: '*',
        name: 'pagenotfound',
        component: PageNotFound 
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router