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
		 * Paramètre obligatoire : data:name
		 * Paramètre optionnel : data.text
		 *
		 * @param {*} param0
		 * @param {object} data les données passées en paramètre (à minima le nom)
		 */
		showSnackbar({ commit }, data) {
			if (data.name && data.name !== '') {
				let snackbar = snackbarMsg[data.name]; // On récupère le snackbar en fonction du nom
				snackbar.showing = true; // On modifie la visibilité du snackbar
				if (data.text !== undefined) snackbar.text = data.text;
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
