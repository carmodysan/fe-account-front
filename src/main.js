import Vue from 'vue';
import App from './components/App';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import axios from 'axios';

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL_API;

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

store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
	new Vue({
		router,
		store,
		vuetify,
		render: (h) => h(App),
	}).$mount('#app');
});
