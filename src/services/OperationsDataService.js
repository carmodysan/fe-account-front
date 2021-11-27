import axios from 'axios';

class OperationsDataService {
    /**
     * Récupère toutes les opérations d'un compte mensuel.
     * 
     * @param String maId Identifiant du compte mensuel
     * @returns la liste des opérations d'un compte mensuel.
     */
	getAll(maId) {
		return axios.get(`/monthly_accounts/${maId}/operations`);
	}

    /**
     * Récupère une opération particulière.
     * 
     * @param String id Identifiant de l'opération
     * @returns une opération.
     */
	get(id) {
		return axios.get(`/operations/${id}`);
	}

    /**
     * Créé une opération
     * 
     * @param Operation data 
     * @returns Response
     */
	create(data) {
		return axios.post('/operations', data);
	}

    /**
     * Met à jour une opération.
     * 
     * @param String id Identifiant de l'opération
     * @param Operation data 
     * @returns Response
     */
	update(id, data) {
		return axios.put(`/operations/${id}`, data);
	}

    /**
     * Supprime une opération.
     * 
     * @param String id Identifiant de l'opération
     * @returns Response
     */
	delete(id) {
		return axios.delete(`/operations/${id}`);
	}
}

export default new OperationsDataService();
