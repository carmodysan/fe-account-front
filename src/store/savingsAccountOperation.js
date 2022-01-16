import SavingsAccountOperationsDataService from '../services/SavingsAccountOperationsDataService';

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

		/**
		 * Retourne le compte sélectionné.
		 *
		 * @param {Object} state
		 * @param {Object} getters
		 * @param {Object} rootState
		 * @param {Object} rootGetters
		 * @returns Le compte sélectionné
		 */
		getAccountSelected(state, getters, rootState, rootGetters) {
			return rootGetters['accountDetails/getAccountSelected'];
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
		},
	},

	actions: {
		/**
		 * Crée une opération.
		 *
		 * @param {Object} data Les données contenant l'opération qu'on va enregistrer en BDD via l'API et l'identifiant du compte mensuel.
		 */
		createOperation({ dispatch }, data) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			SavingsAccountOperationsDataService.create(data.operation)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationCreated' }, { root: true });
					dispatch('retrieveOperations', data.accountId);
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationCreatingError' }, { root: true });
				})
				.finally(() => {
					store.commit('setLoading', false); // On ferme l'affichage du loader.
				});
		},

		/**
		 * Récupère l'ensemble des opérations du compte d'épargne.
		 *
		 * @param {Object} param0 commit, dispatch, state, getters
		 * @param {String} accountId Identifiant du compte d'épargne
		 */
		retrieveOperations({ commit, dispatch, state, getters }, accountId) {
			commit('setOperationsRetrieving', true); // On définit l'état de récupération à true
			state.operations = []; // On vide le tableau des opérations.

			SavingsAccountOperationsDataService.getAll(accountId)
				.then((response) => {
					commit('setOperations', response.data['hydra:member']); // On récupère l'ensemble des opérations du compte d'épargne
					dispatch('accountDetails/refreshSavingsAccountSelected', { operations: state.operations }, { root: true }); // On raffraichit le compte sélectionné en cours.
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationRetrievingError' }, { root: true });
				})
				.finally(() => {
					commit('setOperationsRetrieving', false); // On définit l'état de récupération à false
				});
		},

		/**
		 * Met à jour une opération du compte mensuel.
		 *
		 * @param {Object} param0
		 * @param {Operation} operation L'opération à mettre à jour en BDD
		 */
		editOperation({ dispatch }, operation) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.
			const accountId = operation.savingsAccount.split('/')[3]; // On récupère l'identifiant du compte mensuel

			SavingsAccountOperationsDataService.update(operation.id, operation)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationUpdated' }, { root: true }); // La MAJ s'est bien déroulée
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationUpdatingError' }, { root: true });
				})
				.finally(() => {
					dispatch('retrieveOperations', accountId); // On raffraichit la liste des opérations
					store.commit('setLoading', false); // On enlève l'affichage du loader.
				});
		},

		/**
		 * Supprime une opération via l'API.
		 *
		 * @param {Dispatch} param0
		 * @param {Object} operation Objet de type opération
		 */
		deleteOperation({ dispatch }, operation) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.
			const accountId = operation.savingsAccount.split('/')[3]; // On récupère l'identifiant du compte mensuel

			SavingsAccountOperationsDataService.delete(operation.id)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationDeleted' }, { root: true }); // Tout s'est bien déroulé
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertOperationDeletingError' }, { root: true });
				})
				.finally(() => {
					store.commit('setLoading', false); // On arrête le loader
					dispatch('retrieveOperations', accountId); // On raffraichit la liste des opérations
				});
		},
	},
};
