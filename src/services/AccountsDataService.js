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
	 * Récupère un compte particulier.
	 *
	 * @param String id Identifiant du compte
	 * @returns un compte.
	 */
	get(id) {
		return axios.get(`/accounts/${id}`);
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
	 * Met à jour un compte.
	 *
	 * @param String id Identifiant du compte
	 * @param Account data
	 * @returns Response
	 */
	update(id, data) {
		return axios.put(`/accounts/${id}`, data);
	}

	/**
	 * Supprime un compte.
	 *
	 * @param String id Identifiant du compte
	 * @returns Response
	 */
	delete(id) {
		return axios.delete(`/accounts/${id}`);
	}
}

export default new AccountsDataService();
