import AccountsDataService from '../services/AccountsDataService';

export default {
	namespaced: true,

	state: {
		/**
		 * L'objet représentant la liste des comptes.
		 */
		accounts: [],

		/**
		 * Boolean pour savoir si les comptes sont en cours de récupération.
		 */
		isAccountsRetrieving: false,

		/**
		 * Boolean pour savoir si les comptes sont déjà récupérés.
         * Utile pour éviter de faire des appels inutiles à l'API quand il y a des changements de pages (par exemple).
		 */
		accountsRetrieved: false,
	},

	getters: {
		/**
		 * Retourne l'objet accounts (liste des comptes).
		 *
		 * @param {Object} state
		 * @returns l'objet accounts
		 */
		getAccounts(state) {
			return state.accounts;
		},

		/**
		 * Retourn l'objet indiquant si les comptes sont en cours de récupération.
		 *
		 * @param {Object} state
		 * @returns l'objet isAccountsRetrieving
		 */
		getIsAccountsRetrieving(state) {
			return state.isAccountsRetrieving;
		},

        /**
         * Retourne l'objet indiquant si les comptes sont déjà récupérés.
         * 
         * @param {Object} state 
         * @returns l'objet accountsRetrieved
         */
        getAccountsRetrieved(state) {
            return state.accountsRetrieved;
        }
	},

	mutations: {
		/**
		 * Définit la liste des comptes dans le store.
		 *
		 * @param {Object} state
		 * @param Array accounts
		 */
		addAccounts(state, accounts) {
			state.accounts.push.apply(state.accounts, accounts);
		},

        /**
         * Vide la liste de comptes.
         * 
         * @param {Object} state 
         */
        emptyAccounts(state) {
            state.accounts = [];
        },

		/**
		 * Définit le boolean si les comptes sont en cours de récupération.
		 *
		 * @param {Object} state
		 * @param {Boolean} isAccountsRetrieving
		 */
		setIsAccountsRetrieving(state, isAccountsRetrieving) {
			state.isAccountsRetrieving = isAccountsRetrieving;
		},

        /**
         * Définit le boolean indiquant si les comptes sont récupérés.
         * 
         * @param {Object} state 
         * @param {Boolean} accountsRetrieved 
         */
        setAccountsRetrieved(state, accountsRetrieved) {
            state.accountsRetrieved = accountsRetrieved;
        }
	},

	actions: {
		/**
		 * Récupère tous les comptes de l'utilisateur courant s'ils n'ont pas déjà été précédement récupérés.
		 *
		 * @param string user ID de l'utilisateur
		 */
		retrieveAccounts({ commit, state }, user) {
			commit('setIsAccountsRetrieving', true);

			// Seulement si les comptes n'ont pas déjà été récupérés
			if (!state.accountsRetrieved) {
                commit('emptyAccounts'); // On vide la liste des comptes au cas où elle ne serait pas vide.
				AccountsDataService.getAll(user)
					.then((responses) => {
						// On récupère toutes les réponses et on les ajoute dans le tableau des comptes
						for (const response of responses) {
							commit('addAccounts', response.data['hydra:member']);
						}
					})
					.catch((e) => {
						throw e;
					})
					.finally(() => {
						commit('setIsAccountsRetrieving', false); // Les comptes ne sont plus en cours de récupération
                        commit('setAccountsRetrieved', true); // Les comptes ont été récupérés
					});
			} else {
                commit('setIsAccountsRetrieving', false); // Les comptes ne sont plus en cours de récupération
            }
		},

        /**
         * Permet de forcer le rafraichissement dans le store de la liste des comptes disponibles avec le getter 'getAccounts'.
         * 
         * @param {*} user Id de l'utilisateur
         */
		refreshAccounts({dispatch, commit}, user) {
            commit('setAccountsRetrieved', false); // On indique que les comptes sont à rafraichir en flaggant à false.
            dispatch('retrieveAccounts', user); // On lance la récupération.
        },
	},
};
