import PublicServiceDataService from '../services/PublicServiceDataService';

import store from './index';

export default {
	namespaced: true,

	state: {
        /**
         * Tableau de tous les grades
         */
        ranks: [],

        /**
         * Boolean pour connaître l'état de récupération du tableau des grades
         */
        ranksRetrieving: true,
    },

    getters: {
        /**
         * Retourne la liste de tous les grades
         * 
         * @param {Object} state 
         * @returns La liste de tous les grades
         */
        getRanks(state) {
            return state.ranks;
        },

        /**
         * Retourne l'état de récupération du tableau des grades
         * 
         * @param {Object} state 
         * @returns l'état de récupération du tableau des grades
         */
        isRanksRetrieving(state) {
            return state.ranksRetrieving;
        }
    },

    mutations: {
        /**
         * Définit le tableau des grades.
         * 
         * @param {Object} state 
         * @param {Array} ranks Tableau des grades
         */
        setRanks(state, ranks) {
            state.ranks = ranks;
        },

        /**
         * Définit l'état de récupération du tableau des grades.
         * 
         * @param {Object} state 
         * @param {Boolean} ranksRetrieving Etat de récupération du tableau des grades
         */
        setRanksRetrieving(state, ranksRetrieving) {
            state.ranksRetrieving = ranksRetrieving;
        },
    },

    actions: {
        /**
         * ======>>> Partie Grades <<<======
         */
        /**
         * Créé un grade
         * 
         * @param {Object} param0 dispatch
         * @param {Object} rank Les données contenant le grade.
         */
        createRank({dispatch}, rank) {
            store.commit('setLoading', true); // On déclenche l'affichage du loader.

			PublicServiceDataService.create(rank)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertRankCreated' }, { root: true });
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertRankCreatingError' }, { root: true });
				})
				.finally(() => {
					store.commit('setLoading', false); // On ferme l'affichage du loader.
					dispatch('retrieveRanks');
				});
        },

        /**
         * Récupère l'ensemble des grades
         * 
         * @param {Object} param0 commit, dispatch, state
         */
        retrieveRanks({commit, state, dispatch}) {
            commit('setRanksRetrieving', true); // On définit l'état de récupération à true
			state.ranks = []; // On vide le tableau des opérations périodiques.

			PublicServiceDataService.getAll()
				.then((response) => {
					commit('setRanks', response.data['hydra:member']); // On récupère l'ensemble des grades
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertRanksRetrievingError' }, { root: true });
				})
				.finally(() => {
					commit('setRanksRetrieving', false); // On définit l'état de récupération à false
				});
        },

        /**
         * Modifie un grade
         * 
         * @param {Object} param0 {dispatch}
		 * @param {Operation} rank Le grade à mettre à jour en BDD
         */
        editRank({ dispatch }, rank) {
            store.commit('setLoading', true); // On déclenche l'affichage du loader.

			PublicServiceDataService.update(rank.id, rank)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertRankUpdated' }, { root: true }); // La MAJ s'est bien déroulée
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertRankUpdatingError' }, { root: true });
				})
				.finally(() => {
					dispatch('retrieveRanks', rank.authorId); // On raffraichit la liste des grades
					store.commit('setLoading', false); // On enlève l'affichage du loader.
				});
        },

        /**
         * Supprime un grade
         * 
         * @param {Dispatch} param0
		 * @param {Object} rank Objet de type grade
         */
        deleteRank({ dispatch }, rank) {
            store.commit('setLoading', true); // On déclenche l'affichage du loader.

			PublicServiceDataService.delete(rank.id)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertRankDeleted' }, { root: true }); // Tout s'est bien déroulé
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertRankDeletingError' }, { root: true });
				})
				.finally(() => {
					dispatch('retrieveRanks', rank.authorId); // On raffraichit la liste des grades
					store.commit('setLoading', false); // On arrête le loader
				});
        }
    },
}