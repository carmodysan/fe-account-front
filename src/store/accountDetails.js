// import AccountsDataService from '../services/AccountsDataService';

export default {
	namespaced: true,

    state: {
        /**
         * Objet représentant le compte sélectionné
         */
        accountSelected: {},
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
    }
}