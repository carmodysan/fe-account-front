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
		 * Objet représentant le compte mensuel en cours
		 */
		selectedMonthlyAccount: {},

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
		 * Retourne le tableau des comptes mensuels.
		 *
		 * @param {Object} state
		 * @returns Le tableau des comptes mensuels du compte en cours
		 */
		getMonthlyAccounts(state) {
			return state.monthlyAccounts;
		},

		/**
		 * Retourne l'objet compte mensuel en cours.
		 *
		 * @param {Object} state
		 * @returns L'objet compte mensuel en cours.
		 */
		getSelectedMonthlyAccount(state) {
			return state.selectedMonthlyAccount;
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

		/**
		 * Définit le compte mensuel en cours
		 *
		 * @param {Object} state
		 * @param {Boolean} selectedMonthlyAccount
		 */
		setSelectedMonthlyAccounts(state, selectedMonthlyAccount) {
			state.selectedMonthlyAccount = selectedMonthlyAccount;
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
			AccountsDataService.getCurrentAccount(state.accountSelected.id)
				.then((response) => {
					commit('setAccountsSelected', response.data); // On enregistre le compte courant
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertAccountsRetrievingError' }, { root: true });
					store.commit('setLoading', false); // On arrête le loader
				})
				.finally(() => {
					store.commit('setLoading', false); // On arrête le loader
				});
		},

		/**
		 * ==============> Partie Comptes Mensuels <==============
		 */
		retrieveMonthlyAccounts({ commit, dispatch, state }) {
			commit('setMonthlyAccountsRetrieving', true); // On switch l'état de la récupération des comptes mensuels
			state.monthlyAccounts = []; // On vide le tableau au cas où il resterait des résidus

			MonthlyAccountsDataService.getAll(state.accountSelected.id)
				.then((response) => {
					commit('setMonthlyAccounts', response.data['hydra:member']); // On récupère tous les comptes mensuels
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertMARetrievingError' }, { root: true });
					commit('setMonthlyAccountsRetrieving', false); // On switch l'état de la récupération des comptes mensuels
				})
				.finally(() => {
					dispatch('searchCurrentMonthlyAccount'); // On récupère le compte mensuel en cours
					commit('setMonthlyAccountsRetrieving', false); // On switch l'état de la récupération des comptes mensuels
				});
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
				// Si non si le mois et l'année sont supérieurs à celui en cours, état à upcoming
				// Sinon état close.
				if (year == currentYear && month == currentMonth) {
					monthlyAccount.state = 'current';
				} else if (year == currentYear && month > currentMonth) {
					monthlyAccount.state = 'upcoming';
				} else if (year > currentYear) {
					monthlyAccount.state = 'upcoming';
				}
				else {
					monthlyAccount.state = 'close';
				}

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
					dispatch('retrieveMonthlyAccounts'); // On rafraichit le compte courant
					dispatch('snackbar/showSnackbar', { name: 'alertMACreated' }, { root: true });
				});

			// store.commit('setLoading', false); // On arrête le loader (code normalement non utile)
		},

		/**
		 * Cherche et définit le compte mensuel en cours.
		 *
		 * @param {Object} param0
		 */
		searchCurrentMonthlyAccount({ commit, state }) {
			// On vide le compte mensuel en cours
			state.selectedMonthlyAccount = {};

			// On récupère le premier élément (et seul normalement) ayant l'état current
			const currentMonthlyAccount = state.monthlyAccounts.find((element) => element.state === 'current');
			if (currentMonthlyAccount) {
				// Si la recherche précédente a bien trouvé quelque chose
				commit('setSelectedMonthlyAccounts', currentMonthlyAccount);
			}
		},

		/**
		 * Change le compte mensuel en cours comme le seul à être à l'état current
		 * @param {Object} param0
		 */
		changeCurrentMonthlyAccount({ state }) {
			// On recherche l'ancien compte mensuel en cours
			for (const ma of state.monthlyAccounts) {
				if (ma.state === 'current') {
					// Si on en trouve
					ma.state = 'open'; // On modifie à juste ouvert (open)
					MonthlyAccountsDataService.update(ma.id, ma); // On met à jour le nouvel état en BDD via l'API.
				}
			}

			state.selectedMonthlyAccount.state = 'current';
			MonthlyAccountsDataService.update(state.selectedMonthlyAccount.id, state.selectedMonthlyAccount); // On met à jour l'état en BDD via l'API.
		},

		/**
		 * Change le compte mensuel sélectionné.
		 *
		 * @param {Object} param0
		 */
		changeSelectedMonthlyAccount({ commit }, monthlyAccount) {
			commit('setSelectedMonthlyAccounts', monthlyAccount); // On écrase le précédent compte mensuel sélectionné.
		},
	},
};
