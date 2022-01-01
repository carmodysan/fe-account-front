import store from './index';

import CurrentAccountOperationsDataService from '../services/CurrentAccountOperationsDataService';

export default {
	namespaced: true,

	state: {},

	getters: {},

	mutations: {},

	actions: {
		/**
		 *
		 * @param {Object} operation L'opération qu'on va enregistrer en BDD via l'API.
		 */
		createOperation({ dispatch }, operation) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			CurrentAccountOperationsDataService.create(operation)
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationCreatingError' }, { root: true });
				})
				.finally(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationCreated' }, { root: true });
					store.commit('setLoading', false); // On ferme l'affichage du loader.
				});
		},
	},
};
