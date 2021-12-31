// import AccountsDataService from '../services/AccountsDataService';
import AccountsDataService from '../services/AccountsDataService';
import MonthlyAccountsDataService from '../services/MonthlyAccountsDataService';
import store from './index';

export default {
	namespaced: true,

	state: {
		/**
		 * Objet représentant le compte sélectionné
		 */
		accountSelected: {},

		/**
		 * Tableau de tous les comptes mensuels du compte en cours
		 */
		monthlyAccounts: [],

		/**
		 * Boolean pour connaître l'état de la récupération des comptes mensuels
		 */
		monthlyAccountsRetrieving: true,
	},

	getters: {
		/**
		 * Retourne l'objet compte sélectionné.
		 *
		 * @param {Object} state
		 * @returns l'objet accountSelected
		 */
		getAccountSelected(state) {
			return state.accountSelected;
		},

		/**
		 * Retourne l'objet compte mensuel en cours.
		 *
		 * @param {Object} state
		 * @returns Le tableau des comptes mensuels du compte en cours
		 */
		getMonthlyAccounts(state) {
			return state.monthlyAccounts;
		},

		/**
		 * Retourne l'état de récupération des comptes mensuels.
		 *
		 * @param {Object} state
		 * @returns L'état de récupération des comptes mensuels
		 */
		isMonthlyAccountsRetrieving(state) {
			return state.monthlyAccountsRetrieving;
		},
	},

	mutations: {
		/**
		 * Définit le compte sélectionné
		 *
		 * @param {Object} state
		 * @param {Boolean} account
		 */
		setAccountsSelected(state, account) {
			state.accountSelected = account;
		},

		/**
		 * Définit le tableau des comptes mensuels du compte en cours
		 *
		 * @param {Object} state
		 * @param {Boolean} monthlyAccounts
		 */
		setMonthlyAccounts(state, monthlyAccounts) {
			state.monthlyAccounts = monthlyAccounts;
		},
		
		/**
		 * Définit l'état de récupération des comptes mensuels
		 *
		 * @param {Object} state
		 * @param {Boolean} monthlyAccountsRetrieving
		 */
		setMonthlyAccountsRetrieving(state, monthlyAccountsRetrieving) {
			state.monthlyAccountsRetrieving = monthlyAccountsRetrieving;
		},
	},

	actions: {
		/**
		 * Récupère tous les comptes de l'utilisateur courant s'ils n'ont pas déjà été précédement récupérés.
		 *
		 * @param {Object} account Compte sélectionné
		 */
		retrieveAccountSelected({ commit }, account) {
			commit('setAccountsSelected', account);
		},

		refreshAccountSelected({ commit, dispatch, state }) {
			AccountsDataService.getCurrentAccount(state.accountSelected.id).then((response) => {
				commit('setAccountsSelected', response.data); // On enregistre le compte courant
			}).catch(() => {
				dispatch('snackbar/showSnackbar', { name: 'alertAccountsRetrievingError' }, { root: true });
				store.commit('setLoading', false); // On arrête le loader
			}).finally(() => {
				store.commit('setLoading', false); // On arrête le loader
			})
		},

		/**
		 * ==============> Partie Comptes Mensuels <==============
		 */
		retrieveMonthlyAccounts({commit, dispatch, state}) {
			commit('setMonthlyAccountsRetrieving', true); // On switch l'état de la récupération des comptes mensuels

			MonthlyAccountsDataService.getAll(state.accountSelected.id).then((response) => {
				commit('setMonthlyAccounts', response.data['hydra:member']); // On récupère tous les comptes mensuels
				console.log(state.monthlyAccounts);
			}).catch(() => {
				dispatch('snackbar/showSnackbar', { name: 'alertMARetrievingError' }, { root: true });
				commit('setMonthlyAccountsRetrieving', false); // On switch l'état de la récupération des comptes mensuels
			}).finally(() => {
				commit('setMonthlyAccountsRetrieving', false); // On switch l'état de la récupération des comptes mensuels
			})
		},

		/**
		 * Créé les 12 comptes en fonction de l'année passée en paramètre et les enregistre en BDD via l'API.
		 *
		 * @param {Number} year L'année qu'on souhaite créer
		 */
		createMonthlyAccounts({ dispatch, state }, year) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			const promises = []; // Tableau des futurs promises
			const currentYear = new Date().getFullYear(); // On récupère l'année courante
			const currentMonth = new Date().getMonth(); // On récupère le mois courant

			// On parcourt les 12 mois à créer.
			for (let month = 0; month < 12; month++) {

				const monthlyAccount = {}; // Création de l'objet
				monthlyAccount.year = year; // Ajout de l'année
				monthlyAccount.month = month; // Ajout du mois
				monthlyAccount.currentAccount = '/api/current_accounts/' + state.accountSelected.id; // Ajout de la référence au mois courant

				// Si le mois et l'année correspondent alors l'état du compte mensuel est à en cours.
				if (year == currentYear && month == currentMonth) monthlyAccount.state = 'current';
				else monthlyAccount.state = 'close';

				const promise = MonthlyAccountsDataService.create(monthlyAccount); // On récupère le promise en appelant l'API via Axios
				promises.push(promise); // On met le promise dans le tableau des promises
			}

			// On traite toutes les promises
			Promise.all(promises)
				.catch(() => {
					store.commit('setLoading', false); // On arrête le loader
					dispatch('snackbar/showSnackbar', { name: 'alertMACreatingError' }, { root: true });
				})
				.finally(() => {
					dispatch('accounts/refreshAccounts', state.accountSelected.authorId, { root: true }); // On rafraichit la liste des comptes
					dispatch('refreshAccountSelected'); // On rafraichit le compte courant
					dispatch('snackbar/showSnackbar', { name: 'alertMACreated' }, { root: true });
				});

			// store.commit('setLoading', false); // On arrête le loader (code normalement non utile)
		},
	},
};
