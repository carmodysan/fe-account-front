import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

// Le layout du site
import Layout from './components/layout/Layout';

// Pages
import Login from '@/pages/User/Login';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Accounts from '@/pages/Accounts/Account';
import Empty from '@/pages/Empty/Empty';

Vue.use(VueRouter);

const routes = [
	{ path: '/login', name: 'Login', component: Login }, // Partie Login

	// Partie connectée
	{
		path: '/',
		component: Layout,
		beforeEnter: (to, from, next) => {
			isAuthenticated(next);
		},
		children: [
			{
				path: '',
				name: 'Home',
				component: Home,
				beforeEnter: (to, from, next) => {
					isAuthenticated(next);
				},
			},
			{
				path: 'dashboard',
				name: 'Dashboard',
				component: Dashboard,
				beforeEnter: (to, from, next) => {
					isAuthenticated(next);
				},
			},
			{
				path: 'accounts',
				name: 'Accounts',
				component: Accounts,
				beforeEnter: (to, from, next) => {
					isAuthenticated(next);
				},
			},
			{
				path: 'empty',
				name: 'Empty',
				component: Empty,
				beforeEnter: (to, from, next) => {
					isAuthenticated(next);
				},
			}
		],
	},

	// Si une page non définie est appelée
	{ path: '*', redirect: { name: 'Home' } },
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
