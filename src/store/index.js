import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import snackbar from './snackbar';
import accounts from './accounts';
import accountDetails from './accountDetails';
import currentAccountOperation from './currentAccountOperation';
import periodicOperation from './periodicOperation';
import publicService from './publicService';

Vue.use(Vuex);

export default new Vuex.Store({
	namespaced: true,

	state: {
		// Contient l'état d'un chargement
		isLoading: false,

		// Contient l'état du drawer (sidebar)
		drawer: true,
	},

	getters: {
		/**
		 * Retourne l'état d'un chargement.
		 *
		 * @param {Object} state
		 * @returns l'état du chargement
		 */
		getLoading(state) {
			return state.isLoading;
		},

		/**
		 * Retourne l'état du drawer (sidebar).
		 *
		 * @param {Object} state
		 * @returns l'état du drawer (sidebar)
		 */
		getDrawerState(state) {
			return state.drawer;
		},
	},

	mutations: {
		/**
		 * Modifie l'état d'un chargement.
		 *
		 * @param {Object} state
		 * @param {boolean} newLoadingState
		 */
		setLoading(state, newLoadingState) {
			state.isLoading = newLoadingState;
		},

		/**
		 * Inverse l'état du drawer (sidebar).
		 *
		 * @param {Object} state
		 */
		toggleDrawer(state) {
			state.drawer = !state.drawer;
		},
	},

	actions: {
        toggleDrawer({ commit }) {
            commit('toggleDrawer');
        }
    },

	modules: {
		auth, snackbar, accounts, accountDetails, currentAccountOperation, periodicOperation, publicService
	},
});
