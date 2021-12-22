//import store from "./index";
import snackbarMsg from '../config/snackbarMsg';

export default {
	namespaced: true,

	state: {
		// L'objet paramétrable des notifications
		snackbars: [],
	},

	getters: {
		/**
		 * Retourne l'objet snackbar paramétrable.
		 *
		 * @param {Object} state
		 * @returns l'objet snackbar
		 */
		getSnackbars(state) {
			return state.snackbars;
		},
	},

	mutations: {
		/**
		 * Définit le snackbar du store avec le snackbar donné en paramètre.
		 *
		 * @param {Object} state
		 * @param {Snackbar} snackbar
		 */
		setSnackbar(state, snackbar) {
			state.snackbars = state.snackbars.concat(snackbar);
		},

		/**
		 * Supprime du tableau des Snackbars le snackbar passé en paramètre.
		 * 
		 * @param {Object} state 
		 * @param {Snackbar} snackbar 
		 */
		removeSnackbar(state, snackbar) {
			let index = state.snackbars.indexOf(snackbar);
			state.snackbars.splice(index);
		}
	},

	actions: {
		/**
		 * Affiche le snackbar définit par le nom. Tous les snackbar sont disponible dans
		 * config/snackbarMsg.js.
		 *
		 * @param {*} param0
		 * @param {string} name le nom de la sncakbar qu'on souhaite afficher
		 */
		showSnackbar({ commit }, name) {
			if (name && name !== '') {
				let snackbar = snackbarMsg[name]; // On récupère le snackbar en fonction du nom
				snackbar.showing = true; // 
				commit('setSnackbar', snackbar);
			}
		},

		/**
		 * Supprime du tableau des Snackbars le snackbar passé en paramètre.
		 * 
		 * @param {*} param0 
		 * @param {Snackbar} snackbar 
		 */
		removeSnackbar({ commit }, snackbar) {
			commit('removeSnackbar', snackbar);
		}
	},
};
