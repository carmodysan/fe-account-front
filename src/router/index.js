import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';
import Login from '../views/Login';
import Register from '../views/Register';
import Dashboard from '../views/Dashboard';
import About from '../views/About';
import Accounts from '../views/monthly-account/Accounts';
import AccountDetailsRouter from '../views/accounts/AccountDetailsRouter'
import AccountDetails from '../views/monthly-account/AccountDetails';
import MonthlyAccount from '../views/MonthlyAccount';
import Operations from '../views/monthly-account/Operations';
import OperationsList from '../views/accounts/MonthlyAccountOperations';
import OperationDetails from '../views/monthly-account/OperationDetails';
import OperationAdd from '../views/monthly-account/OperationAdd';
import PeriodicOperationList from '../views/monthly-account/PeriodicOperationList.vue';
import PeriodicOperationAdd from '../views/monthly-account/PeriodicOperationsAdd.vue';
import PeriodicOperationDetails from '../views/monthly-account/PeriodicOperationDetails.vue';
import PageNotFound from '../views/PageNotFound';
import store from '../store';

Vue.use(VueRouter);

const routes = [
	{
		path: '/home',
		name: 'home',
		component: Home,
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
	},
	{
		path: '/register',
		name: 'register',
		component: Register,
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		component: Dashboard,
		beforeEnter: (to, from, next) => {
			if (!store.getters['auth/isAuthenticated']) {
				return next({
					name: 'login',
				});
			}
			next();
		},
	},
	{
		path: '/accounts',
		name: 'accounts',
		component: Accounts,
		beforeEnter: (to, from, next) => {
			if (!store.getters['auth/isAuthenticated']) {
				return next({
					name: 'login',
				});
			}
			next();
		},
	},
	{
		path: '/accounts/:slugAccount',
		component: AccountDetailsRouter,
		beforeEnter: (to, from, next) => {
			if (!store.getters['auth/isAuthenticated']) {
				return next({
					name: 'login',
				});
			}
			next();
		},
		children: [
			{
				path: '',
				name: 'account-details',
				component: AccountDetails,
				beforeEnter: (to, from, next) => {
					if (!store.getters['auth/isAuthenticated']) {
						return next({
							name: 'login',
						});
					}
					next();
				},
			},
			{
				path: ':slugMonthlyAccount',
				name: 'operations-list',
				component: OperationsList,
				beforeEnter: (to, from, next) => {
					if (!store.getters['auth/isAuthenticated']) {
						return next({
							name: 'login',
						});
					}
					next();
				},
			},
		],
	},
	{
		path: '/monthly-accounts',
		name: 'monthly-accounts',
		component: MonthlyAccount,
		beforeEnter: (to, from, next) => {
			if (!store.getters['auth/isAuthenticated']) {
				return next({
					name: 'login',
				});
			}
			next();
		},
	},
	{
		path: '/monthly-accounts/:slug',
		component: Operations,
		children: [
			{
				path: 'operation/:id',
				name: 'operation-details',
				component: OperationDetails,
				beforeEnter: (to, from, next) => {
					if (!store.getters['auth/isAuthenticated']) {
						return next({
							name: 'login',
						});
					}
					next();
				},
			},
			{
				path: 'operations/add',
				name: 'operation-add',
				component: OperationAdd,
				beforeEnter: (to, from, next) => {
					if (!store.getters['auth/isAuthenticated']) {
						return next({
							name: 'login',
						});
					}
					next();
				},
			},
		],
	},
	{
		path: '/params/periodic-operations',
		name: 'periodic-operations',
		component: PeriodicOperationList,
		beforeEnter: (to, from, next) => {
			if (!store.getters['auth/isAuthenticated']) {
				return next({
					name: 'login',
				});
			}
			next();
		},
	},
	{
		path: '/params/periodic-operations-add',
		name: 'periodic-operations-add',
		component: PeriodicOperationAdd,
		beforeEnter: (to, from, next) => {
			if (!store.getters['auth/isAuthenticated']) {
				return next({
					name: 'login',
				});
			}
			next();
		},
	},
	{
		path: '/params/periodic-operations/:id',
		name: 'periodic-operations-details',
		component: PeriodicOperationDetails,
		beforeEnter: (to, from, next) => {
			if (!store.getters['auth/isAuthenticated']) {
				return next({
					name: 'login',
				});
			}
			next();
		},
	},
	{
		path: '/about',
		name: 'about',
		component: About,
	},
	{
		path: '/',
		redirect: { name: 'home' },
	},
	{
		path: '*',
		name: 'pagenotfound',
		component: PageNotFound,
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
