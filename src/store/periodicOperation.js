import PeriodicOperationsDataService from '../services/PeriodicOperationsDataService';

import store from './index';

export default {
	namespaced: true,

	state: {
		/**
		 * Liste des opérations périodiques
		 */
		periodicOperations: [],

		/**
		 * Boolean pour connaître l'état de la récupération des opérations périodiques
		 */
		periodicOperationsRetrieving: true,
	},

	getters: {
		/**
		 * Retourne la liste des opérations périodiques.
		 *
		 * @param {Object} state
		 * @returns La liste des opérations périodiques
		 */
		getPeriodicOperations(state) {
			return state.periodicOperations;
		},

		/**
		 * Retourne l'état de récupération des opérations périodiques.
		 *
		 * @param {Object} state
		 * @returns L'état de récupération des opérations périodiques
		 */
		isPeriodicOperationsRetrieving(state) {
			return state.periodicOperationsRetrieving;
		},

		/**
		 * Retourne le compte mensuel sélectionné.
		 * 
		 * @param {Object} state 
		 * @param {Object} getters 
		 * @param {Object} rootState 
		 * @param {Object} rootGetters 
		 * @returns le compte mensuel sélectionné
		 */
		getSelectedMonthlyAccount(state, getters, rootState, rootGetters) {
			return rootGetters['accountDetails/getSelectedMonthlyAccount'];
		},
	},

	mutations: {
		/**
		 * Définit la liste des opérations périodiques.
		 *
		 * @param {Object} state
		 * @param {Array} periodicOperations Liste des opérations périodiques
		 */
		setPeriodicOperations(state, periodicOperations) {
			state.periodicOperations = periodicOperations;
		},

		/**
		 * Définit l'état de la récupération des opérations périodiques.
		 *
		 * @param {Object} state
		 * @param {Boolean} periodicOperationsRetrieving Etat de la récupération des opérations périodiques.
		 */
		setPeriodicOperationsRetrieving(state, periodicOperationsRetrieving) {
			state.periodicOperationsRetrieving = periodicOperationsRetrieving;
		},
	},

	actions: {
		/**
		 * Crée une opération périodique.
		 *
		 * @param {Object} data Les données contenant l'opération périodique qu'on va enregistrer en BDD via l'API et l'identifiant du compte mensuel.
		 */
		createPeriodicOperation({ dispatch }, operation) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			PeriodicOperationsDataService.create(operation)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertPeriodicOperationCreated' }, { root: true });
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertPeriodicOperationCreatingError' }, { root: true });
				})
				.finally(() => {
					store.commit('setLoading', false); // On ferme l'affichage du loader.
					dispatch('retrievePeriodicOperations', operation.authorId);
				});
		},

		/**
		 * Récupère l'ensemble des opérations périodiques.
		 *
		 * @param {Object} param0 commit, dispatch, state
		 * @param {String} userId Identifiant de l'utilisateur
		 */
		retrievePeriodicOperations({ commit, dispatch, state }, userId) {
			commit('setPeriodicOperationsRetrieving', true); // On définit l'état de récupération à true
			state.periodicOperations = []; // On vide le tableau des opérations périodiques.

			PeriodicOperationsDataService.getAll(userId)
				.then((response) => {
					commit('setPeriodicOperations', response.data['hydra:member']); // On récupère l'ensemble des opérations du compte mensuel
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertPeriodicOperationRetrievingError' }, { root: true });
				})
				.finally(() => {
					commit('setPeriodicOperationsRetrieving', false); // On définit l'état de récupération à false
				});
		},

		/**
		 * Met à jour une opération périodique.
		 *
		 * @param {Object} param0
		 * @param {Operation} operation L'opération périodique à mettre à jour en BDD
		 */
		editPeriodicOperation({ dispatch }, operation) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			PeriodicOperationsDataService.update(operation.id, operation)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertPeriodicOperationUpdated' }, { root: true }); // La MAJ s'est bien déroulée
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertPeriodicOperationUpdatingError' }, { root: true });
				})
				.finally(() => {
					dispatch('retrievePeriodicOperations', operation.authorId); // On raffraichit la liste des opérations périodiques
					store.commit('setLoading', false); // On enlève l'affichage du loader.
				});
		},

		/**
		 * Supprime une opération périodique via l'API.
		 *
		 * @param {Dispatch} param0
		 * @param {Object} operation Objet de type opération périodique
		 */
		deletePeriodicOperation({ dispatch }, operation) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			PeriodicOperationsDataService.delete(operation.id)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertPeriodicOperationDeleted' }, { root: true }); // Tout s'est bien déroulé
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertPeriodicOperationDeletingError' }, { root: true });
				})
				.finally(() => {
					store.commit('setLoading', false); // On arrête le loader
					dispatch('retrievePeriodicOperations', operation.authorId); // On raffraichit la liste des opérations
				});
		},

		/**
		 * Transforme l'opération périodique en opération et l'envoie dans la liste des opérations du compte mensuel.
		 *
		 * @param {Object} param0
		 * @param {PeriodicOperation} data Données contenant l'opération périodique à ajouter à la liste des opérations et la notion de multiplicité
		 */
		addPeriodicOperationToOperations({ getters, dispatch }, data) {
			let newOperation = {};

			let monthlyAccount = getters.getSelectedMonthlyAccount;
			newOperation.dateOp = new Date(monthlyAccount.year, monthlyAccount.month, data.operation.dayOfMonth + 1).toISOString().substr(0, 10);
			newOperation.category = data.operation.category;
			newOperation.description = data.operation.description;
			newOperation.credit = data.operation.credit;
			newOperation.debit = data.operation.debit;
			newOperation.checked = false;
			newOperation.monthlyAccount = '/api/monthly_accounts/' + monthlyAccount.id;
			newOperation.fromPeriodic = true;

			// Tout bug, il faut regarder à quoi ressemble l'objet dans la partie du dispatch ci-dessous.
			dispatch('currentAccountOperation/createOperation', { operation: newOperation, monthlyAccountId: monthlyAccount.id, multiple: data.multiple }, { root: true }); // Tout s'est bien déroulé
		},

		/**
		 * Ajoute toutes les opérations périodiques dans la liste des opérations du compte mensuel
		 */
		 addAllPeriodicOperationsToOperations({ state, dispatch }) {
			state.periodicOperations.forEach(element => {
				dispatch('addPeriodicOperationToOperations', { operation: element, multiple: true }); // Tout s'est bien déroulé
			});
		 }
	},
};
