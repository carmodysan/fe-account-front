import axios from './FEApiService';

class AccountsDataService {
	/**
	 * Récupère tous les comptes d'un utilisateurs.
	 *
	 * @param String authorId Identifiant de l'utilisateur
	 * @returns la liste des comptes.
	 */
	getAll(authorId) {
		const currentAccounts = this.getAllCurrentAccounts(authorId);
		const savingsAccounts = this.getAllSavingsAccounts(authorId);

		return Promise.all([currentAccounts, savingsAccounts]);
	}

	/**
	 * Récupère tous les comptes courants d'un utilisateur.
	 *
	 * @param String authorId  Identifiant de l'utilisateur
	 * @returns la liste des comptes courants
	 */
	getAllCurrentAccounts(authorId) {
		return axios.get(`/current_accounts?authorId=${authorId}&order[establishment]`);
	}

	/**
	 * Récupère tous les comptes d'épargne d'un utilisateur.
	 *
	 * @param String authorId  Identifiant de l'utilisateur
	 * @returns la liste des comptes d'épargne
	 */
	getAllSavingsAccounts(authorId) {
		return axios.get(`/savings_accounts?authorId=${authorId}&order[establishment]`);
	}

	/**
	 * Récupère un compte courant particulier.
	 *
	 * @param String id Identifiant du compte
	 * @returns un compte.
	 */
	getCurrentAccount(id) {
		return axios.get(`/current_accounts/${id}`);
	}

	/**
	 * Récupère un compte d'épargne particulier.
	 *
	 * @param String id Identifiant du compte
	 * @returns un compte.
	 */
	 getSavingsAccount(id) {
		return axios.get(`/savings_accounts/${id}`);
	}

    /**
     * Créé un compte courant.
     * 
     * @param {*} data les données du compte courant à créer
     * @returns Response La response d'axios pour le POST
     */
	createCurrentAccount(data) {
        return axios.post(`/current_accounts`, data);
    }

	/**
     * Créé un compte d'épargne.
     * 
     * @param {*} data les données du compte d'épargne à créer
     * @returns Response La response d'axios pour le POST
     */
	 createSavingsAccount(data) {
        return axios.post(`/savings_accounts`, data);
    }

	/**
	 * Met à jour un compte.
	 *
	 * @param String id Identifiant du compte
	 * @param Account data
	 * @returns Response
	 */
	updateAccount(account) {
		switch (account['@type']) {
			case 'CurrentAccount': // Compte courant
				return axios.put(`/current_accounts/${account.id}`, account);
			case 'SavingsAccount': // Compte d'épargne
				return axios.put(`/savings_accounts/${account.id}`, account);

			default:
				throw 'Error: category does not exist !';
		}
	}

	/**
	 * Supprime un compte.
	 *
	 * @param String id Identifiant du compte
	 * @returns Response
	 */
	deleteAccount(account) {
		switch (account['@type']) {
			case 'CurrentAccount': // Compte courant
				return axios.delete(`/current_accounts/${account.id}`);
			case 'SavingsAccount': // Compte d'épargne
				return axios.delete(`/savings_accounts/${account.id}`);

			default:
				throw 'Error: category does not exist !';
		}
	}
}

export default new AccountsDataService();
