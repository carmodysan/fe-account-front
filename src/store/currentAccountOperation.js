import CurrentAccountOperationsDataService from '../services/CurrentAccountOperationsDataService';

import store from './index';

export default {
	namespaced: true,

	state: {
		/**
		 * Liste des opérations
		 */
		operations: [],

        /**
         * Boolean pour connaître l'état de la récupération des opérations
         */
        operationsRetrieving: true,
	},

	getters: {
		/**
		 * Retourne la liste des opérations.
		 *
		 * @param {Object} state
		 * @returns La liste des opérations
		 */
		getOperations(state) {
			return state.operations;
		},

        /**
		 * Retourne l'état de récupération des opérations.
		 *
		 * @param {Object} state
		 * @returns L'état de récupération des opérations
		 */
		isOperationsRetrieving(state) {
			return state.operationsRetrieving;
		},
	},

	mutations: {
		/**
		 * Définit la liste des opérations.
		 *
		 * @param {Object} state
		 * @param {Array} operations Liste des opérations
		 */
		setOperations(state, operations) {
			state.operations = operations;
		},

        /**
         * Définit l'état de la récupération des opérations.
         * 
         * @param {Object} state 
         * @param {Boolean} operationsRetrieving Etat de la récupération des opérations.
         */
        setOperationsRetrieving(state, operationsRetrieving) {
            state.operationsRetrieving = operationsRetrieving;
        }
	},

	actions: {
		/**
		 * Crée une opération.
		 *
		 * @param {Object} data Les données contenant l'opération qu'on va enregistrer en BDD via l'API et l'identifiant du compte mensuel.
		 */
		createOperation({ dispatch }, data) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			CurrentAccountOperationsDataService.create(data.operation)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationCreated' }, { root: true });
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationCreatingError' }, { root: true });
				})
				.finally(() => {
					store.commit('setLoading', false); // On ferme l'affichage du loader.
                    dispatch('retrieveOperations', data.monthlyAccountId);
				});
		},

        /**
         * Récupère l'ensemble des opérations du compte mensuel.
         * 
         * @param {Object} param0 commit, dispatch, state
         * @param {String} monthlyAccountId Identifiant du compte mensuel
         */
		retrieveOperations({ commit, dispatch, state }, monthlyAccountId) {
            commit('setOperationsRetrieving', true); // On définit l'état de récupération à true
            state.operations = []; // On vide le tableau des opérations.

			CurrentAccountOperationsDataService.getAll(monthlyAccountId)
				.then((response) => {
					commit('setOperations', response.data['hydra:member']); // On récupère l'ensemble des opérations du compte mensuel
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationRetrievingError' }, { root: true });
				})
				.finally(() => {
                    commit('setOperationsRetrieving', false); // On définit l'état de récupération à false
                });
		},
	},
};
