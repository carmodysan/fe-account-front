import InterestRateDataService from '../services/InterestRateDataService';

import store from './index';

export default {
	namespaced: true,

	state: {
		/**
		 * Liste des taux d'intérêts
		 */
		interestRates: [],

		/**
		 * Taux d'intérêt en cours
		 */
		actualInterestRate: 0,

		/**
		 * Boolean pour connaître l'état de la récupération des taux d'intérêts
		 */
		interestRatesRetrieving: true,
	},

	getters: {
		/**
		 * Retourne la liste des taux d'intérêts.
		 *
		 * @param {Object} state
		 * @returns La liste des taux d'intérêts
		 */
		getInterestRates(state) {
			return state.interestRates;
		},

		/**
		 * Retourne le taux d'intérêt en cours.
		 *
		 * @param {Object} state
		 * @returns Le taux d'intérêt en cours
		 */
		getActualInterestRate(state) {
			return state.actualInterestRate;
		},

		/**
		 * Retourne l'état de récupération des taux d'intérêts.
		 *
		 * @param {Object} state
		 * @returns L'état de récupération des taux d'intérêts
		 */
		isInterestRatesRetrieving(state) {
			return state.interestRatesRetrieving;
		},
	},

	mutations: {
		/**
		 * Définit la liste des taux d'intérêts.
		 *
		 * @param {Object} state
		 * @param {Array} interestRates Liste des taux d'intérêts
		 */
		setInterestRates(state, interestRates) {
			state.interestRates = interestRates;
		},
		
		/**
		 * Définit le taux d'intérêt en cours.
		 *
		 * @param {Object} state
		 * @param {Array} actualInterestRate Le taux d'intérêt en cours
		 */
		setActualInterestRate(state, actualInterestRate) {
			state.actualInterestRate = actualInterestRate;
		},

		/**
		 * Définit l'état de la récupération des taux d'intérêts.
		 *
		 * @param {Object} state
		 * @param {Boolean} interestRatesRetrieving Etat de la récupération des taux d'intérêts.
		 */
		setInterestRatesRetrieving(state, interestRatesRetrieving) {
			state.interestRatesRetrieving = interestRatesRetrieving;
		},
	},

	actions: {
		/**
		 * Crée un taux d'intérêts.
		 *
		 * @param {Object} data Les données contenant du taux d'intérêts qu'on va enregistrer en BDD via l'API et l'identifiant du compte mensuel.
		 */
		createInterestRate({ dispatch }, data) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			InterestRateDataService.create(data.interestRate)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertInterestRateCreated' }, { root: true });
					dispatch('retrieveInterestRates', data.accountId);
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertInterestRateCreatingError' }, { root: true });
				})
				.finally(() => {
					store.commit('setLoading', false); // On ferme l'affichage du loader.
				});
		},

		/**
		 * Récupère l'ensemble des taux d'intérêts du compte d'épargne.
		 *
		 * @param {Object} param0 commit, dispatch, state, getters
		 * @param {String} accountId Identifiant du compte d'épargne
		 */
		retrieveInterestRates({ commit, dispatch, state }, accountId) {
			commit('setInterestRatesRetrieving', true); // On définit l'état de récupération à true
			state.interestRates = []; // On vide le tableau des taux d'intérêts.

			InterestRateDataService.getAll(accountId)
				.then((response) => {
					commit('setInterestRates', response.data['hydra:member']); // On récupère l'ensemble des taux d'intérêts du compte d'épargne
					// S'il y a des taux d'intérêts, on tente de récupérer le taux courant
					if (state.interestRates.length > 0) {
						const now = new Date(); // On récupère la date du jour
						// On cherche le taux de la date du jour
						const rate = state.interestRates.find(({startDate, endDate}) => new Date(startDate) <= now && now <= new Date(endDate)); 
						if (rate) commit('setActualInterestRate', rate.rate); // Si le taux existe, on l'actualise
						else commit('setActualInterestRate', 0);
					}
					// On raffraichit les intérêts cumulés depuis le début d'année
					dispatch('calculatePendingInterestRate');
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertInterestRateRetrievingError' }, { root: true });
				})
				.finally(() => {
					commit('setInterestRatesRetrieving', false); // On définit l'état de récupération à false
				});
		},

		/**
		 * Met à jour un taux d'intérêts du compte mensuel.
		 *
		 * @param {Object} param0
		 * @param {Operation} interestRate L'taux d'intérêts à mettre à jour en BDD
		 */
		editInterestRate({ dispatch }, interestRate) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.
			const accountId = interestRate.savingsAccount.split('/')[3]; // On récupère l'identifiant du compte mensuel

			InterestRateDataService.update(interestRate.id, interestRate)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertInterestRateUpdated' }, { root: true }); // La MAJ s'est bien déroulée
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertInterestRateUpdatingError' }, { root: true });
				})
				.finally(() => {
					dispatch('retrieveInterestRates', accountId); // On raffraichit la liste des taux d'intérêts
					store.commit('setLoading', false); // On enlève l'affichage du loader.
				});
		},

		/**
		 * Supprime un taux d'intérêts via l'API.
		 *
		 * @param {Dispatch} param0
		 * @param {Object} interestRate Objet de type taux d'intérêts
		 */
		deleteInterestRate({ dispatch }, interestRate) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.
			const accountId = interestRate.savingsAccount.split('/')[3]; // On récupère l'identifiant du compte mensuel

			InterestRateDataService.delete(interestRate.id)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertInterestRateDeleted' }, { root: true }); // Tout s'est bien déroulé
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertInterestRateDeletingError' }, { root: true });
				})
				.finally(() => {
					store.commit('setLoading', false); // On arrête le loader
					dispatch('retrieveInterestRates', accountId); // On raffraichit la liste des taux d'intérêts
				});
		},

		calculatePendingInterestRate({state}) {
			const now = new Date(); // On récupère la date du jour
			const firstJanuaryOfYear = new Date(now.getFullYear() + '-01-01'); // On récupère la date du 1er janvier de l'année actuelle
			
			const interestRate = state.interestRates.find(({startDate, endDate}) => new Date(startDate) <= now && now <= new Date(endDate)); // On récupère le taux actuel

			if (interestRate) { // Si le taux est définit
				// Cas le plus simple, le taux en cours a une date de début inférieure ou égale au 1er janvier de l'année actuelle
				if (interestRate.startDate <= firstJanuaryOfYear) {

				} else {
					
				}
			}
		}
	},
};
