import axios from './FEApiService';

class CurrentAccountOperationsDataService {
    /**
     * Récupère toutes les opérations d'un compte mensuel.
     * 
     * @param String maId Identifiant du compte mensuel
     * @returns la liste des opérations d'un compte mensuel.
     */
	getAll(maId) {
		return axios.get(`/monthly_accounts/${maId}/current_account_operations`);
	}

    /**
     * Récupère une opération particulière.
     * 
     * @param String id Identifiant de l'opération
     * @returns une opération.
     */
	get(id) {
		return axios.get(`/current_account_operations/${id}`);
	}

    /**
     * Créé une opération
     * 
     * @param Operation data 
     * @returns Response
     */
	create(data) {
		return axios.post('/current_account_operations', data);
	}

    /**
     * Met à jour une opération.
     * 
     * @param String id Identifiant de l'opération
     * @param Operation data 
     * @returns Response
     */
	update(id, data) {
		return axios.put(`/current_account_operations/${id}`, data);
	}

    /**
     * Supprime une opération.
     * 
     * @param String id Identifiant de l'opération
     * @returns Response
     */
	delete(id) {
		return axios.delete(`/current_account_operations/${id}`);
	}
}

export default new CurrentAccountOperationsDataService();
