import axios from './FEApiService';

class PeriodicOperationsDataService {
    /**
     * Récupère toutes les opérations périodiques d'un compte mensuel.
     * 
     * @param String authorId Identifiant de l'utilisateur
     * @returns la liste des opérations d'un compte mensuel.
     */
	getAll(authorId) {
		return axios.get(`/periodic_operations?authorId=${authorId}&order[dayOfMonth]`);
        // console.log(authorId);
        // return axios.get(`/periodic_operations`);
	}

    /**
     * Récupère une opération périodique particulière.
     * 
     * @param String id Identifiant de l'opération
     * @returns une opération.
     */
	get(id) {
		return axios.get(`/periodic_operations/${id}`);
	}

    /**
     * Créé une opération périodique
     * 
     * @param Operation data 
     * @returns Response
     */
	create(data) {
		return axios.post('/periodic_operations', data);
	}

    /**
     * Met à jour une opération périodique.
     * 
     * @param String id Identifiant de l'opération
     * @param Operation data 
     * @returns Response
     */
	update(id, data) {
		return axios.put(`/periodic_operations/${id}`, data);
	}

    /**
     * Supprime une opération périodique.
     * 
     * @param String id Identifiant de l'opération
     * @returns Response
     */
	delete(id) {
		return axios.delete(`/periodic_operations/${id}`);
	}
}

export default new PeriodicOperationsDataService();
