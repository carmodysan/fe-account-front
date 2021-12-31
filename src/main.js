import Vue from 'vue';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './routes';
import store from './store';

Vue.config.productionTip = false;

require('./store/subscriber');

/**
 * --------------------------------------- Filter ---------------------------------------
 * Attention, avec vue 3, il faudra changer, les filtres ne sont plus autorisés (voir doc)
 */
Vue.filter('formatMonth', function (value) {
	if (value) {
		switch (value) {
			case 1:
				return 'Janvier';
			case 2:
				return 'Février';
			case 3:
				return 'Mars';
			case 4:
				return 'Avril';
			case 5:
				return 'Mai';
			case 6:
				return 'Juin';
			case 7:
				return 'Juillet';
			case 8:
				return 'Août';
			case 9:
				return 'Septembre';
			case 10:
				return 'Octobre';
			case 11:
				return 'Novembre';
			case 12:
				return 'Décembre';
			default:
				break;
		}
	}
});

var currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

Vue.filter('formatCurrencyNumber', function (value) {
	if (value) {
		return currencyFormatter.format(value);
	}
});
/**
 * --------------------------------------- End Filter ---------------------------------------
 */

new Vue({
	vuetify,
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
