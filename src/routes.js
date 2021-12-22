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
		name: 'Layout',
		component: Layout,
		beforeEnter: (to, from, next) => {
			if (!store.getters['auth/isAuthenticated']) {
				return next({
					name: 'Login',
				});
			}
			next();
		},
		children: [{ path: '', name: 'Home', component: Home }],
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
