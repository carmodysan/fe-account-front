import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

// Le layout du site
import Layout from './components/layout/Layout'

// Pages
import Login from '@/pages/User/Login';
import Home from '@/pages/Home';

Vue.use(VueRouter);

const routes = [
	{ path: '/login', name: 'Login', component: Login },
	{
		path: '/',
		component: Layout,
		beforeEnter: (to, from, next) => { isAuthenticated(next) },
		children: [{ path: '', name: 'Home', component: Home, beforeEnter: (to, from, next) => { isAuthenticated(next) }}],
	},
];


function isAuthenticated(next) {
	if (!store.getters['auth/isAuthenticated']) {
		return next({
			name: 'Login',
		});
	}
	next();
}

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
