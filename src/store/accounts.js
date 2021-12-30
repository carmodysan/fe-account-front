import AccountsDataService from '../services/AccountsDataService';
import store from './index';

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
		},
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
		},
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
						commit('setIsAccountsRetrieving', false); // Les comptes ne sont plus en cours de récupération
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
		refreshAccounts({ dispatch, commit }, user) {
			commit('setAccountsRetrieved', false); // On indique que les comptes sont à rafraichir en flaggant à false.
			dispatch('retrieveAccounts', user); // On lance la récupération.
		},

		/**
		 * ==============> Partie Création des comptes <==============
		 */
		/**
		 * Créé un compte via l'API.
		 *
		 * @param {Dispatch} param0 dispatch
		 * @param {Object} account Objet de type account
		 */
		createAccount({ dispatch }, account) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			const categoryAccount = account.category; // On récupère la catégorie du compte

			delete account.category; // On supprime la catégorie des données à envoyer
			account.balance = '0'; // On ajoute le solde dans les données à envoyer

			switch (categoryAccount) {
				case 'Current':
					dispatch('createCurrentAccount', account);
					break;
				case 'Savings':
					break;

				default:
					store.commit('setLoading', false); // On arrête le loader
					throw 'Error: category does not exist !';
			}

			store.commit('setLoading', false); // Au cas où on ne serait passé dans aucune des instructions ci-dessus.
		},

		/**
		 * Créé un compte courant via l'API.
		 *
		 * @param {Dispatch} param0 dispatch
		 * @param {Object} account Objet de type account
		 */
		createCurrentAccount({ dispatch }, account) {
			account.upcomingBalance = '0'; // On ajoute le solde à venir dans les données à envoyer

			AccountsDataService.createCurrentAccount(account)
				.catch((e) => {
					store.commit('setLoading', false); // On arrête le loader
					throw e;
				})
				.finally(() => {
					store.commit('setLoading', false); // On arrête le loader
					dispatch('refreshAccounts', account.authorId);
				});
		},

		/**
		 * ==============> Partie Edition des comptes <==============
		 */
		/**
		 * Modifie un compte via l'API.
		 *
		 * @param {Dispatch} param0
		 * @param {Object} account Objet de type account
		 */
		editAccount({ dispatch }, account) {
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			// On switch sur la catégorie du compte (ici disponible sous @type)
			switch (account['@type']) {
				case 'CurrentAccount':
					dispatch('editCurrentAccount', account);
					break;
				case 'SavingsAccount':
					break;

				default:
					store.commit('setLoading', false); // On arrête le loader
					throw 'Error: category does not exist !';
			}

			store.commit('setLoading', false); // Au cas où on ne serait passé dans aucune des instructions ci-dessus.
		},

		/**
		 * Modifie un compte courant via l'API.
		 *
		 * @param {Dispatch} param0 dispatch
		 * @param {Object} account Objet de type account
		 */
		editCurrentAccount({ dispatch }, account) {
			AccountsDataService.updateCurrentAccount(account.id, account)
				.catch((e) => {
					store.commit('setLoading', false); // On arrête le loader
					throw e; // On laisse la vue gérer les erreurs
				})
				.finally(() => {
					store.commit('setLoading', false); // On arrête le loader
					dispatch('refreshAccounts', account.authorId);
				});
		},

		/**
		 * ==============> Partie Suppression des comptes <==============
		 */
		/**
		 * Supprime un compte via l'API.
		 *
		 * @param {Dispatch} param0
		 * @param {Object} account Objet de type account
		 */
		deleteAccount({ dispatch }, account) {
			console.log(account);
			store.commit('setLoading', true); // On déclenche l'affichage du loader.

			// On switch sur la catégorie du compte (ici disponible sous @type)
			switch (account['@type']) {
				case 'CurrentAccount':
					dispatch('deleteCurrentAccount', account);
					break;
				case 'SavingsAccount':
					dispatch('deleteSavingsAccount', account);
					break;

				default:
					store.commit('setLoading', false); // On arrête le loader
					throw 'Error: category does not exist !';
			}

			store.commit('setLoading', false); // Au cas où on ne serait passé dans aucune des instructions ci-dessus.
		},

		/**
		 * Supprime un compte courant via l'API.
		 *
		 * @param {Dispatch} param0 dispatch
		 * @param {Object} account Objet de type account
		 */
		deleteCurrentAccount({ dispatch }, account) {
			AccountsDataService.deleteCurrentAccount(account.id)
				.catch((e) => {
					store.commit('setLoading', false); // On arrête le loader
					throw e; // On laisse la vue gérer les erreurs
				})
				.finally(() => {
					store.commit('setLoading', false); // On arrête le loader
					dispatch('refreshAccounts', account.authorId);
				});
		},

		/**
		 * Supprime un compte d'épargne via l'API.
		 *
		 * @param {Dispatch} param0 dispatch
		 * @param {Object} account Objet de type account
		 */
		deleteSavingsAccount({ dispatch }, account) {
			AccountsDataService.deleteSavingsAccount(account.id)
				.catch((e) => {
					store.commit('setLoading', false); // On arrête le loader
					throw e; // On laisse la vue gérer les erreurs
				})
				.finally(() => {
					store.commit('setLoading', false); // On arrête le loader
					dispatch('refreshAccounts', account.authorId);
				});
		},
	},
};
