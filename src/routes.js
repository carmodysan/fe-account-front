import Vue from 'vue';
import VueRouter from 'vue-router';
import Meta from 'vue-meta';

import store from './store';

// Le layout du site
import Layout from './components/layout/Layout';

// Pages
import Login from '@/pages/User/Login';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Accounts from '@/pages/Accounts/Accounts';
import CurrentAccount from '@/pages/Accounts/CurrentAccount';
import SavingsAccount from '@/pages/Accounts/SavingsAccount';
import PeriodicOperation from '@/pages/Accounts/PeriodicOperation';
import PublicService from '@/pages/PublicService/PublicService';
import Configuration from '@/pages/Configuration/Configuration';
import Empty from '@/pages/Empty/Empty';

Vue.use(VueRouter);
Vue.use(Meta);

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
				path: 'current-account-details',
				name: 'CurrentAccount',
				component: CurrentAccount,
				beforeEnter: (to, from, next) => {
					isAuthenticated(next);
				},
			},
			{
				path: 'periodic-operations',
				name: 'PeriodicOperation',
				component: PeriodicOperation,
				beforeEnter: (to, from, next) => {
					isAuthenticated(next);
				},
			},
			{
				path: 'savings-account-details',
				name: 'SavingsAccount',
				component: SavingsAccount,
				beforeEnter: (to, from, next) => {
					isAuthenticated(next);
				},
			},
			{
				path: 'public-service',
				name: 'PublicService',
				component: PublicService,
				beforeEnter: (to, from, next) => {
					isAuthenticated(next);
				},
			},
			{
				path: 'configuration',
				name: 'Configuration',
				component: Configuration,
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
