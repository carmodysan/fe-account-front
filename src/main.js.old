import Vue from 'vue';
import App from './components/App';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import setupInterceptorApi from './services/SetupInterceptorsApi';

Vue.config.productionTip = false;

setupInterceptorApi(store);
require('./store/subscriber');

Vue.filter('formatMonth', function (value) {
	if (value) {
		switch (value) {
			case 1:
				return 'January';
			case 2:
				return 'February';
			case 3:
				return 'March';
			case 4:
				return 'April';
			case 5:
				return 'May';
			case 6:
				return 'June';
			case 7:
				return 'July';
			case 8:
				return 'August';
			case 9:
				return 'September';
			case 10:
				return 'October';
			case 11:
				return 'November';
				case 12:
				return 'December';
			default:
				break;
		}
	}
});

var currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR'});

Vue.filter('formatCurrencyNumber', function (value) {
	if (value) {
		return currencyFormatter.format(value);
	}
});

store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
	new Vue({
		router,
		store,
		vuetify,
		render: (h) => h(App),
	}).$mount('#app');
});
