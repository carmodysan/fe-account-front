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

        /**
         * Tableau de la grille indiciaire
         */
        indexGrid: [],

        /**
         * Boolean pour connaître l'état de récupération de la grille indiciaire
         */
        indexGridRetrieving: true,
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
        },

        /**
         * Retourne la grille indiciaire
         * 
         * @param {Object} state 
         * @returns La grille indiciaire
         */
         getIndexGrid(state) {
            return state.indexGrid;
        },

        /**
         * Retourne l'état de récupération de la grille indiciaire
         * 
         * @param {Object} state 
         * @returns l'état de récupération de la grille indiciaire
         */
         isIndexGridRetrieving(state) {
            return state.indexGridRetrieving;
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

        /**
         * Définit la grille indiciaire.
         * 
         * @param {Object} state 
         * @param {Array} indexGrid Tableau des grades
         */
         setIndexGrid(state, indexGrid) {
            state.indexGrid = indexGrid;
        },

        /**
         * Définit l'état de récupération de la grille indiciaire.
         * 
         * @param {Object} state 
         * @param {Boolean} indexGridRetrieving Etat de récupération de la grille indiciaire
         */
        setIndexGridRetrieving(state, indexGridRetrieving) {
            state.indexGridRetrieving = indexGridRetrieving;
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

			PublicServiceDataService.createRank(rank)
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
			state.indexGrid = []; // On vide le tableau des opérations périodiques.

			PublicServiceDataService.getAllRanks()
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

			PublicServiceDataService.updateRank(rank.id, rank)
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

			PublicServiceDataService.deleteRank(rank.id)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertRankDeleted' }, { root: true }); // Tout s'est bien déroulé
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertRankDeletingError' }, { root: true });
				})
				.finally(() => {
					dispatch('retrieveRanks'); // On raffraichit la liste des grades
					store.commit('setLoading', false); // On arrête le loader
				});
        },

        /**
         * ======>>> Partie Grille indiciaire <<<======
         */
        /**
         * Créé un échelon dans la grille indiciaire
         * 
         * @param {Object} param0 dispatch
         * @param {Object} echelon Les données de l'échelon
         */
         createEchelon({dispatch}, echelon) {
            store.commit('setLoading', true); // On déclenche l'affichage du loader.

			PublicServiceDataService.createEchelon(echelon)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertEchelonCreated' }, { root: true });
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertEchelonCreatingError' }, { root: true });
				})
				.finally(() => {
					store.commit('setLoading', false); // On ferme l'affichage du loader.
					dispatch('retrieveIndexGrid');
				});
        },

        /**
         * Récupère la grille indiciaire
         * 
         * @param {Object} param0 commit, dispatch, state
         */
        retrieveIndexGrid({commit, state, dispatch}) {
            commit('setIndexGridRetrieving', true); // On définit l'état de récupération à true
			state.ranks = []; // On vide le tableau des opérations périodiques.

			PublicServiceDataService.getIndexGrid()
				.then((response) => {
					commit('setIndexGrid', response.data['hydra:member']); // On récupère l'ensemble des grades
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertIndexGridRetrievingError' }, { root: true });
				})
				.finally(() => {
					commit('setIndexGridRetrieving', false); // On définit l'état de récupération à false
				});
        },

        /**
         * Modifie un échelon
         * 
         * @param {Object} param0 {dispatch}
		 * @param {Operation} echelon L'échelon à mettre à jour en BDD
         */
        editEchelon({ dispatch }, echelon) {
            store.commit('setLoading', true); // On déclenche l'affichage du loader.

			PublicServiceDataService.updateEchelon(echelon.id, echelon)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertEchelonUpdated' }, { root: true }); // La MAJ s'est bien déroulée
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertEchelonUpdatingError' }, { root: true });
				})
				.finally(() => {
					dispatch('retrieveIndexGrid'); // On raffraichit la grille indiciaire
					store.commit('setLoading', false); // On enlève l'affichage du loader.
				});
        },

        /**
         * Supprime un échelon
         * 
         * @param {Dispatch} param0
		 * @param {Object} echelon Objet de type echelon (index grid)
         */
        deleteEchelon({ dispatch }, echelon) {
            store.commit('setLoading', true); // On déclenche l'affichage du loader.

			PublicServiceDataService.deleteEchelon(echelon.id)
				.then(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertEchelonDeleted' }, { root: true }); // Tout s'est bien déroulé
				})
				.catch(() => {
					dispatch('snackbar/showSnackbar', { name: 'alertEchelonDeletingError' }, { root: true });
				})
				.finally(() => {
					dispatch('retrieveIndexGrid'); // On raffraichit la grille indiciaire
					store.commit('setLoading', false); // On arrête le loader
				});
        },
    },
}