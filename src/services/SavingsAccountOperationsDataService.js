import axios from './FEApiService';

class SavingsAccountOperationsDataService {
    /**
     * Récupère toutes les opérations d'un compte d'épargne.
     * 
     * @param String id Identifiant du compte d'épargne
     * @returns la liste des opérations d'un compte d'épargne.
     */
	getAll(id) {
		return axios.get(`/savings_accounts/${id}/savings_account_operations`);
	}

    /**
     * Récupère une opération particulière.
     * 
     * @param String id Identifiant de l'opération
     * @returns une opération.
     */
	get(id) {
		return axios.get(`/savings_account_operations/${id}`);
	}

    /**
     * Créé une opération
     * 
     * @param Operation data 
     * @returns Response
     */
	create(data) {
		return axios.post('/savings_account_operations', data);
	}

    /**
     * Met à jour une opération.
     * 
     * @param String id Identifiant de l'opération
     * @param Operation data 
     * @returns Response
     */
	update(id, data) {
		return axios.put(`/savings_account_operations/${id}`, data);
	}

    /**
     * Supprime une opération.
     * 
     * @param String id Identifiant de l'opération
     * @returns Response
     */
	delete(id) {
		return axios.delete(`/savings_account_operations/${id}`);
	}
}

export default new SavingsAccountOperationsDataService();
