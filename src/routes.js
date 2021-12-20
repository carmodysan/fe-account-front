import Vue from 'vue';
import VueRouter from 'vue-router';

// Pages
import Login from "@/pages/User/Login";
import Home from "@/pages/Home"

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'Layout',
        redirect: { name: 'Login'}
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    }
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;